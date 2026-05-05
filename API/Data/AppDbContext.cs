using System;
using Microsoft.EntityFrameworkCore;
using API.Entities;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
namespace API.Data;

public class AppDbContext(DbContextOptions options) : IdentityDbContext<AppUser>(options)
{
   public DbSet<Member> Members {get;set;}
   public DbSet<Photo> Photos {get; set;}
   public DbSet<MemberLike> Likes {get;set;}
   public DbSet<Message> Messages {get; set;}
   public DbSet<SocketGroups> Groups {get;set;}
   public DbSet<SocketConnections> Connections {get;set;}


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

      modelBuilder.Entity<IdentityRole>().HasData(
         new IdentityRole {Id = "member-id" , Name = "Member" , NormalizedName = "MEMBER"},
          new IdentityRole {Id = "moderator-id" , Name = "Moderator" , NormalizedName = "MODERATOR"},
           new IdentityRole {Id = "admin-id" , Name = "Admin" , NormalizedName = "ADMIN"}

      );
        modelBuilder.Entity<Message>().HasOne(x => x.Sender).WithMany(x => x.MessagesSent).HasForeignKey(x => x.SenderId).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Message>().HasOne(x => x.Recipient).WithMany(x => x.MessagesRecieved).HasForeignKey(x => x.RecipientId).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<MemberLike>().HasKey(x => new{x.SourceMemberId , x.TargetMemberId});

        modelBuilder.Entity<MemberLike>().
        HasOne(x => x.SourceMember).WithMany(x => x.LikedMember).HasForeignKey(x => x.SourceMemberId).OnDelete(DeleteBehavior.Cascade);


        modelBuilder.Entity<MemberLike>().
        HasOne(x => x.TargetMember).WithMany(x => x.LikedByMember).HasForeignKey(x => x.TargetMemberId).OnDelete(DeleteBehavior.NoAction);

        var dateConverter = new ValueConverter<DateTime , DateTime>(
         v => v.ToUniversalTime(),
         v => DateTime.SpecifyKind(v , DateTimeKind.Utc)
        );

         var dateConverterOptional = new ValueConverter<DateTime? , DateTime?>(
         v => v.HasValue ? v.Value.ToUniversalTime() : null,
         v => v.HasValue ? DateTime.SpecifyKind(v.Value , DateTimeKind.Utc) : null
        );

        foreach(var entityTypes in modelBuilder.Model.GetEntityTypes())
      {
          foreach(var property in entityTypes.GetProperties())
         {
            if(property.ClrType == typeof(DateTime))
            {
               property.SetValueConverter(dateConverter);
            }
            else if(property.ClrType == typeof(DateTime?))
            {
               property.SetValueConverter(dateConverterOptional);
            }
         }
      }
    }
}
