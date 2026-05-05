using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    [Authorize]
    public class MessagesController(IUnitOfWork uow) : BaseAPIController
    {
        [HttpPost]
        
        public async Task<ActionResult<MessageDTO>> CreateMessage(CreateMessageDTO createMessageDto)
        {
            var sender = await uow.MemberRepository.GetMemberAsync(User.GetMemberId());
            var recipient = await uow.MemberRepository.GetMemberAsync(createMessageDto.RecipientId);

            if (sender == null || recipient == null || sender.Id == recipient.Id)
                return BadRequest("Error creting message");

            var message = new Message
            {
                Content = createMessageDto.Content,
                RecipientId = recipient.Id,
                SenderId = sender.Id
            };

            uow.MessageRepository.AddMessage(message);

            if (await uow.Completed()) return message.ToDTO();

            return BadRequest("An error occured creating message");
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedResult<MessageDTO>>> GetMessages([FromQuery] MeassageParam param)
        {
            param.MemberId = User.GetMemberId();
           return await uow.MessageRepository.GetMessagesFromMembers(param);
        }

        [HttpGet("thread/{recipientId}")]
        public async Task<ActionResult<MessageDTO>> GetMessagesThread(string recipientId)
        {
           return Ok(await uow.MessageRepository.GetMessageThread(User.GetMemberId(), recipientId));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(string id)
        {
           var memberId = User.GetMemberId();
           var message = await uow.MessageRepository.GetMessageById(id);

           if(message == null) return NotFound("Message not found");

           if(message.SenderId != memberId && message.RecipientId != memberId)
              return BadRequest("You can't delete this message");

            if(message.SenderId == memberId) message.SenderDeleted = true;
            if(message.RecipientId == memberId) message.RecipientDeleted = true;

            if(message.SenderDeleted && message.RecipientDeleted)
            {
                uow.MessageRepository.DeleteMessage(message);
            }

            if(await uow.Completed()) return Ok();

            return BadRequest("Error deleting message");
            
        }
    }
}
