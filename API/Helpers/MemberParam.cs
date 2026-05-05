using System;

namespace API.Helpers;

public class MemberParam : PagingParam
{
   public string? CurrentMemberId {get;set;}
   public string? Gender {get;set;}
   public int MinAge {get;set;} = 18;
   public int MaxAge {get;set;} = 100;
   public string OrderBy{get;set;} = "lastactive";

}