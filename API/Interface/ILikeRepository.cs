using System;
using API.Entities;
using API.Helpers;

namespace API.Interface;

public interface ILikeRepository
{
   Task<MemberLike?> GetMemberLike(string sourceId, string targetId);
   Task<PaginatedResult<Member>> GetLikedMembers(string predicate, string memberId , PagingParam param);
   Task<IReadOnlyList<string>> GetCurrentMemberLikeIds (string memberId);
   void DeleteLike(MemberLike like);
   void AddLike(MemberLike like);



}
