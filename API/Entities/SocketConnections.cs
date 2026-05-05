using System;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace API.Entities;

public class SocketConnections(string connectionId, string userId)
{
  [Key]
   public string ConnectionId {get;set;} = connectionId;
   public string UserId {get;set;} = userId;
   public string GroupName { get; set; } = null!;
   public SocketGroups Group {get;set;} = null!;

}
