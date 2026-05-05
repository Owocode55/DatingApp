using System;
using System.Security.Claims;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
namespace API.SignalR;

[Authorize]
public class PresenceHub(PressenceTracker pressenceTracker) : Hub
{

    public override async Task OnConnectedAsync()
    {
        await pressenceTracker.UserConnected(GetMemberId(), Context.ConnectionId);
        //Context.User?.FindFirstValue(ClaimTypes.Email)
        await Clients.Others.SendAsync("UserOnline" , GetMemberId());

        await Clients.All.SendAsync("GetOnlineUsers" , await pressenceTracker.GetOnlineUsers());
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await Clients.Others.SendAsync("UserOffline" , GetMemberId());
        await Clients.All.SendAsync("GetOnlineUsers" , await pressenceTracker.GetOnlineUsers());
    
        await base.OnDisconnectedAsync(exception);
    }

    private string GetMemberId()
    {
        return Context.User?.GetMemberId() ?? throw new HubException(); 
    }


}
