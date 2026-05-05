using System;

using API.Data.Repository;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

[Authorize]
public class MessageHub(IUnitOfWork uow, IHubContext<PresenceHub> presenceHub) : Hub
{

    public override async Task OnConnectedAsync()
    {
        
        var httpContext = Context.GetHttpContext();
        var otherUser = httpContext?.Request?.Query["userId"].ToString() ?? throw
        new HubException("Other user not found");

        var groupName = GetGroupName(GetMemberId(), otherUser);
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        
        await AddToGroup(groupName);

        var messagesThread = await uow.MessageRepository.GetMessageThread(GetMemberId(), otherUser);

        await Clients.Group(groupName).SendAsync("RecieveMessagesThread", messagesThread);
    }

    public async Task SendMessages(CreateMessageDTO createMessageDTO)
    {
        var sender = await uow.MemberRepository.GetMemberAsync(GetMemberId());
        var recipient = await uow.MemberRepository.GetMemberAsync(createMessageDTO.RecipientId);

        if (sender == null || recipient == null || sender.Id == recipient.Id)
            throw new HubException("Can not create message");

        var message = new Message
        {
            Content = createMessageDTO.Content,
            RecipientId = recipient.Id,
            SenderId = sender.Id
        };
        
        var groupName  = GetGroupName(GetMemberId(), createMessageDTO.RecipientId);
        
        var group = await uow.MessageRepository.GetGroup(groupName);
        var isUserInGroup = group != null && group.Connections.Any(x => x.UserId == message.RecipientId);

        if(isUserInGroup)
        {
            message.DateRead = DateTime.UtcNow;
        }

        uow.MessageRepository.AddMessage(message);

        if (await uow.Completed())
        {
          var connections = await PressenceTracker.GetUserConnections(recipient.Id);

           if(connections != null && connections.Count > 0 && !isUserInGroup)
            {
                await presenceHub.Clients.Clients(connections).SendAsync("NewMessageRecieved" , message.ToDTO());
            }

          await Clients.Group(groupName).SendAsync("NewMessages", message.ToDTO());
        };

    }

    private async Task<bool> AddToGroup(string groupName)
    {
        var group = await uow.MessageRepository.GetGroup(groupName);
        var connection = new SocketConnections(Context.ConnectionId , GetMemberId());

        if(group == null)
        {
             group = new SocketGroups(groupName);
             await uow.MessageRepository.AddGroup(group);
        }

        group.Connections.Add(connection);
        return await uow.Completed();
    }
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await uow.MessageRepository.RemoveConnection(Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }


    private string GetMemberId()
    {
        return Context.User?.GetMemberId() ?? throw new HubException("Unable to fetch member Id");
    }
    private string GetGroupName(string currentUserId, string otherUserId)
    {
        var compare = string.CompareOrdinal(currentUserId, otherUserId) < 0;
        return compare ? $"{currentUserId}-{otherUserId}" : $"{otherUserId}-{currentUserId}";
    }
}
