using API.Data.Repository;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    public class LikesController(IUnitOfWork uow) : BaseAPIController
    {
        [HttpPost("{targetId}")]
        public async Task<ActionResult> LikeMember(string targetId)
        {
            var memberId = User.GetMemberId();

            if(memberId == null)
                return BadRequest("Error getting member");
            
            if(memberId == targetId)
                return BadRequest("You can't like yourself");

            var existLike = await uow.LikeRepository.GetMemberLike(memberId , targetId);

            if(existLike == null)
            {
                var like = new MemberLike
                {
                    SourceMemberId = memberId,
                    TargetMemberId = targetId
                };

                uow.LikeRepository.AddLike(like);
            }
            else
            {
                uow.LikeRepository.DeleteLike(existLike);
            }
            
            if(await uow.Completed()) return Ok();

            return BadRequest("error liking or unliking member");

        }


    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Member>>> GetMember([FromQuery]string predicate, [FromQuery]PagingParam param)
    {
        return Ok(await uow.LikeRepository.GetLikedMembers(predicate , User.GetMemberId() , param));  
    }

    [HttpGet("list")]
    public async Task<ActionResult<IReadOnlyList<Member>>> GetLikeIds()
    {
        return Ok(await uow.LikeRepository.GetCurrentMemberLikeIds(User.GetMemberId()));  
    }
}
}
