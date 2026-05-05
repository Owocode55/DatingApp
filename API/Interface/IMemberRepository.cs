using System;
using API.Entities;
using API.Helpers;

namespace API.Interface;

public interface IMemberRepository
{
   void UpdateMember(Member member);
   Task<Member?> GetMemberAsync(string id);
   Task<Member ?> GetMemberForUpdateAsync(string id);
   Task<PaginatedResult<Member>> GetMembersAsync(MemberParam param);
   Task<IReadOnlyList<Photo>> GetMemberPhotoAsync(string memberId);
}
