using System;

namespace API.Interface;

public interface IUnitOfWork
{
   ILikeRepository LikeRepository {get;}
   IMemberRepository MemberRepository {get;}
   IMessageRepository MessageRepository {get;}
   Task<bool> Completed();
   bool HasChanges();
}
