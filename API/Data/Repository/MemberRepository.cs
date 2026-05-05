using System;
using API.Entities;
using API.Helpers;
using API.Interface;
using Microsoft.EntityFrameworkCore;
using Mono.TextTemplating;

namespace API.Data.Repository;

public class MemberRepository(AppDbContext context) : IMemberRepository
{
    public async Task<Member?> GetMemberAsync(string id)
    {
        return await context.Members.FindAsync(id);
    }

    public async Task<IReadOnlyList<Photo>> GetMemberPhotoAsync(string memberId)
    {
        return await context.Members.Where(m => m.Id == memberId).SelectMany(x => x.Photos).ToListAsync();
    }

    public async Task<PaginatedResult<Member>> GetMembersAsync(MemberParam param)
    {
        var query = context.Members.AsQueryable();

        query = query.Where(x => x.Id != param.CurrentMemberId);

        if (!string.IsNullOrWhiteSpace(param.Gender))
            query = query.Where(x => x.Gender == param.Gender);   
        
        var minDate = DateOnly.FromDateTime(DateTime.Today.AddYears(-param.MaxAge - 1));
        var maxDate = DateOnly.FromDateTime(DateTime.Today.AddYears(-param.MinAge));

        query = query.Where(x=> x.DateOfBirth >= minDate && x.DateOfBirth <= maxDate);

        query = param.OrderBy switch
        {
            "created" => query.OrderByDescending(x => x.DateCreated),
            _ => query.OrderByDescending(x => x.LastActive)
        };

        return await PaginationHelper.CreateAsync(query , param.PageNumber , param.PageSize);
    }

    public async Task<Member?> GetMemberForUpdateAsync(string id)
    {
        return await context.Members.Include(x => x.User).Include(x =>x.Photos).SingleOrDefaultAsync(x => x.Id == id);
    }


    public void UpdateMember(Member member)
    {
        context.Entry(member).State = EntityState.Modified;
    }
}
