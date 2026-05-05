using System;
using System.Text.RegularExpressions;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interface;

public interface IMessageRepository
{

void AddMessage(Message message);
void DeleteMessage(Message message);

Task<Message?> GetMessageById(string messageId);
Task<PaginatedResult<MessageDTO>> GetMessagesFromMembers(MeassageParam param);

Task<IReadOnlyList<MessageDTO>> GetMessageThread(string currentMemberId, string recipientId);

Task AddGroup(SocketGroups group);
Task RemoveConnection(string connectionId);

Task<SocketConnections?> GetConnection(string connectionId);

Task<SocketGroups?> GetGroup(string name);
   
Task<SocketGroups?> GetGroupForConnection(string connectionId);
}
