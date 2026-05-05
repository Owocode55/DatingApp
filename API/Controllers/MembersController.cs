using System.Security.Claims;
using API.Data;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class MembersController(IUnitOfWork uow, IPhotoService photoService) : BaseAPIController
    {
        [HttpGet]
        public async Task<ActionResult<PaginatedResult<Member>>> GetMembers([FromQuery]MemberParam param)
        {
            param.CurrentMemberId = User.GetMemberId();
            return Ok(await uow.MemberRepository.GetMembersAsync(param));
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Member>> GetMember(string id)
        {
            var member = await uow.MemberRepository.GetMemberAsync(id);

            if (member == null) return NotFound();

            return member;
        }


        [HttpGet("{id}/photos")]
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhoto(string id)
        {
            var photos = await uow.MemberRepository.GetMemberPhotoAsync(id);

            if (photos == null) return NotFound();

            return Ok(photos);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateMember(UpdateMemberDTO updateMember)
        {
            var memberId = User.GetMemberId();

            if(string.IsNullOrWhiteSpace(memberId)) return BadRequest("Error retriving User Id");
            
            var member = await uow.MemberRepository.GetMemberForUpdateAsync(memberId);

            if(member == null) return NotFound("Member with Id not found");

            member.DisplayName = updateMember.DisplayName ?? member.DisplayName;
            member.Description = updateMember.Description ?? member.Description;
            member.Country = updateMember.Country ?? member.Country;
            member.City = updateMember.City ?? member.City;

            member.User.DisplayName = updateMember.DisplayName ?? member.User.DisplayName;

            uow.MemberRepository.UpdateMember(member);

            if(await uow.Completed()) return NoContent();

            return BadRequest("Error Saving Changes");
        }


        [HttpPost("add-photo")]
        public async Task<ActionResult<Photo>> AddPhoto(IFormFile file)
        {
            var memberId = User.GetMemberId();

            if(string.IsNullOrWhiteSpace(memberId)) return BadRequest("Error getting member details");

            var member = await uow.MemberRepository.GetMemberForUpdateAsync(memberId);

            if(member == null) return NotFound("member with Id not found");

            var uploadResult = await photoService.UploadPhotoAsync(file);

            if(uploadResult.Error != null) return BadRequest(uploadResult.Error.Message);

            var photo = new Photo
            {
                Url = uploadResult.SecureUrl.AbsoluteUri,
                PublicId = uploadResult.PublicId,
                MemberId = User.GetMemberId()
            };

            if(string.IsNullOrWhiteSpace(member.ImageUrl) || string.IsNullOrWhiteSpace(member.User.ImageUrl))
            {
                member.ImageUrl = photo.Url;
                member.User.ImageUrl = photo.Url;
            }

            member.Photos.Add(photo);

            if(await uow.Completed()) return photo;

            return BadRequest("Error uploading image");
        }


        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhtoto(int photoId)
        {
            var member = await uow.MemberRepository.GetMemberForUpdateAsync(User.GetMemberId());

            if(member == null) return BadRequest("Member not found");

            var photo = member.Photos.SingleOrDefault(x => x.Id == photoId);

            if(photo == null || photo.Url == member?.ImageUrl)
            return BadRequest("Can't set image as main image");

            member!.ImageUrl = photo.Url;
            member.User.ImageUrl = photo.Url;

            //uow.MemberRepository.UpdateMember(member);

            if(await uow.Completed()) return NoContent();

            return BadRequest("Error setting main image");
        }
    

    [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhtoto(int photoId)
        {
            var member = await uow.MemberRepository.GetMemberForUpdateAsync(User.GetMemberId());

            if(member == null) return BadRequest("Member not found");

            var photo = member.Photos.SingleOrDefault(x => x.Id == photoId);

            if(photo == null || photo.Url == member?.ImageUrl)
                return BadRequest("Can't delete photo");

            if (photo.PublicId != null)
            {
                var resp = await photoService.DeletePhotoAsync(photo.PublicId);
                if(resp.Error != null) return BadRequest(resp.Error.Message);
            }

            member?.Photos.Remove(photo);
            if(await uow.Completed()) 
               return Ok();

            return BadRequest("Error deleting photo");
        }
    }
}
