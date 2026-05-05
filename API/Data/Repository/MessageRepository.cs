using System;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interface;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repository;

public class MessageRepository(AppDbContext context) : IMessageRepository
{
    public async Task AddGroup(SocketGroups group)
    {
       await context.Groups.AddAsync(group);
    }

    public void AddMessage(Message message)
    {
        context.Messages.Add(message);
    }

    public void DeleteMessage(Message message)
    {
        context.Messages.Remove(message);
    }

    public async Task<SocketConnections?> GetConnection(string connectionId)
    {
        return await context.Connections.FindAsync(connectionId);
    }

    public async Task<SocketGroups?> GetGroup(string name)
    {
       return await context.Groups.Include(x => x.Connections).FirstOrDefaultAsync(x => x.Name == name);
    }

    public Task<SocketGroups?> GetGroupForConnection(string connectionId)
    {
        return context.Groups.Include(x => x.Connections).Where(x => x.Connections.Any(x => x.ConnectionId == connectionId)).FirstOrDefaultAsync();
    }

    public async Task<Message?> GetMessageById(string messageId)
    {
        return await context.Messages.FindAsync(messageId);
    }

    public async Task<PaginatedResult<MessageDTO>> GetMessagesFromMembers(MeassageParam param)
    {
        var query = context.Messages.OrderByDescending(x => x.DateSent).AsQueryable();

         query = param.Container switch
         {
             "Outbox" => query.Where(x => x.SenderId == param.MemberId && x.SenderDeleted == false),
             _ => query.Where(x => x.RecipientId == param.MemberId && x.RecipientDeleted == false)
         };

         var messageQuery = query.Select(MessageExtensions.ToDTOProjection());

         return await PaginationHelper.CreateAsync(messageQuery , param.PageNumber , param.PageSize);
    }

    public async Task<IReadOnlyList<MessageDTO>> GetMessageThread(string currentMemberId, string recipientId)
    {
       await context.Messages.Where(x => x.RecipientId == currentMemberId && x.SenderId == recipientId && x.DateRead == null)
       .ExecuteUpdateAsync(setters => setters.SetProperty(x => x.DateRead , DateTime.UtcNow));

       return await context.Messages.Where(x => 
       (x.RecipientId == currentMemberId && x.RecipientDeleted == false && x.SenderId == recipientId) 
       || (x.SenderId == currentMemberId && x.SenderDeleted == false && x.RecipientId == recipientId))
       .OrderBy(x => x.DateSent).
       Select(MessageExtensions.ToDTOProjection()).ToListAsync();
    }

    public async Task RemoveConnection(string connectionId)
    {
        await context.Connections.Where(x => x.ConnectionId == connectionId).ExecuteDeleteAsync();
    }


}
