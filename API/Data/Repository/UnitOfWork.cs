using System;
using API.Interface;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repository;

public class UnitOfWork(AppDbContext dbContext) : IUnitOfWork
{
    private ILikeRepository? _likeRepository;
    private IMessageRepository? _messageRepository;
    private IMemberRepository? _memberRepository;
    public ILikeRepository LikeRepository => _likeRepository ??= new LikeRepository(dbContext);

    public IMemberRepository MemberRepository => _memberRepository ??= new MemberRepository(dbContext);

    public IMessageRepository MessageRepository => _messageRepository ??= new MessageRepository(dbContext);

    public async Task<bool> Completed()
    {
        try
        {
            return await dbContext.SaveChangesAsync() > 0;
        }
        catch (DbUpdateException ex)
        {
            
            throw new Exception("Error updating chnages" , ex);
        }
    }

    public bool HasChanges()
    {
       return dbContext.ChangeTracker.HasChanges();
    }
}
