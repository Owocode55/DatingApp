using System;
using System.ComponentModel.DataAnnotations;

namespace API.Entities;

public class SocketGroups(string name)
{
    [Key]
  public string Name {get;set;} = name;

  public ICollection<SocketConnections> Connections { get; set; }= [];
}
