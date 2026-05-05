using System;
using System.Linq.Expressions;
using API.DTOs;
using API.Entities;

namespace API.Extensions;

public static class MessageExtensions
{
   public static MessageDTO ToDTO(this Message message)
    {
        return new MessageDTO
        {
            Id = message.Id,
            Content = message.Content,
            DateRead = message.DateRead,
            DateSent = message.DateSent,
            SenderDisplayName = message.Sender.DisplayName,
            RecipientDisplayName = message.Recipient.DisplayName,
            SenderId = message.SenderId,
            RecipientId = message.RecipientId,
            SenderImageUrl = message.Sender.ImageUrl,
            RecipientImageUrl = message.Recipient.ImageUrl

        };
    }


    public static Expression<Func<Message, MessageDTO>> ToDTOProjection()
    {
        return message => new MessageDTO
        {
            Id = message.Id,
            Content = message.Content,
            DateRead = message.DateRead,
            DateSent = message.DateSent,
            SenderDisplayName = message.Sender.DisplayName,
            RecipientDisplayName = message.Recipient.DisplayName,
            SenderId = message.SenderId,
            RecipientId = message.RecipientId,
            SenderImageUrl = message.Sender.ImageUrl,
            RecipientImageUrl = message.Recipient.ImageUrl
        };
    }
}
