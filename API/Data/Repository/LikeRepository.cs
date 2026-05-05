using System;
using API.Entities;
using API.Helpers;
using API.Interface;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repository;

public class LikeRepository(AppDbContext dbContext) : ILikeRepository
{
    public void AddLike(MemberLike like)
    {
        dbContext.Add(like);
    }

    public void DeleteLike(MemberLike like)
    {
        dbContext.Remove(like);
    }

    public async Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId)
    {
        return await dbContext.Likes.Where(x => x.SourceMemberId == memberId).Select(x => x.TargetMemberId).ToListAsync();
    }

    public async Task<PaginatedResult<Member>> GetLikedMembers(string predicate, string memberId , PagingParam param)
    {
        var query = dbContext.Likes.AsQueryable();
        IQueryable<Member> querySelect;
        switch (predicate)
        {
            case  "liked": 
                 querySelect = query.Where(m => m.SourceMemberId == memberId).Select(m => m.TargetMember);
                 break;
            case "likedBy":
                querySelect = query.Where(m => m.TargetMemberId == memberId).Select(m => m.SourceMember);
                break;
            default: //Mutal likes
              var likeId = await GetCurrentMemberLikeIds(memberId);
              querySelect = query.Where(m => m.TargetMemberId == memberId && likeId.Contains(m.SourceMemberId)).Select(m => m.SourceMember);
              break;
        }

        return await PaginationHelper.CreateAsync(querySelect , param.PageNumber , param.PageSize);
    }

    public async Task<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId)
    {
        return await dbContext.Likes.FindAsync(sourceMemberId , targetMemberId);
    }

}
