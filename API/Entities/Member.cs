using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace API.Entities;

public class Member
{
   public string Id {get; set; } = null!;
   public required string DisplayName {get; set;}
   public string? ImageUrl {get; set;}
   public DateOnly DateOfBirth {get;set;}
   public required string Country {get; set;}
   public required string City {get;set;}
   public required string Gender {get; set;}
   public string? Description {get;set;} 
   public DateTime DateCreated {get; set;} = DateTime.UtcNow;
   public DateTime LastActive {get;set;} = DateTime.UtcNow;
   public List<Photo> Photos {get;set;} = [];
   
   [ForeignKey(nameof(Id))]
   public AppUser User {get;set;} = null!;
  [JsonIgnore]
   public List<MemberLike> LikedMember {get;set;} = [];
[JsonIgnore]
   public List<MemberLike> LikedByMember {get;set;} = [];
   public List<Message> MessagesSent {get;set;} = [];

   public List<Message> MessagesRecieved {get;set;}=[];

}
