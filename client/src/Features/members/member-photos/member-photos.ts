import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../Core/services/member-service';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Members, Photo } from '../../../types/Member';
import { ActivatedRoute } from '@angular/router';
import { ImageUpload } from '../../../Shared/image-upload/image-upload';
import { AccountService } from '../../../Core/services/account-service';
import { User } from '../../../types/user';
import { OverflowIconButton } from '../../../Shared/overflow-icon-button/overflow-icon-button';
import { DeleteIconButton } from '../../../Shared/delete-icon-button/delete-icon-button';

@Component({
  selector: 'app-member-photos',
  imports: [AsyncPipe, ImageUpload, OverflowIconButton, DeleteIconButton],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css',
})
export class MemberPhotos implements OnInit {
  protected memberService = inject(MemberService);
  public accountService = inject(AccountService);
  private activeRoute = inject(ActivatedRoute);
  protected photos$?: Observable<Photo[]>;
  protected photos = signal<Photo[]>([]);
  public isLoading = signal<boolean>(false);

  constructor() {
    const memberId = this.activeRoute.parent?.snapshot?.paramMap.get('id');
    if (memberId) {
      this.photos$ = this.memberService.getMemberPhoto(memberId);
    }
  }
  ngOnInit(): void {
    const memberId = this.activeRoute.parent?.snapshot?.paramMap.get('id');
    if (memberId) {
      this.memberService.getMemberPhoto(memberId).subscribe({
        next: (photo) => {
          this.photos.set(photo);
        },
      });
    }
  }

  onUploadPhoto(file: File) {
    this.isLoading.set(true);
    this.memberService.uploadPhoto(file).subscribe({
      next: (photo) => {
        this.memberService.showMemberUpdateForm.set(false);
        this.isLoading.set(false);
        this.photos.update((photos) => [...photos, photo]);

        if (!this.accountService.currentUser()?.imageURL) {
          let current = this.accountService.currentUser();
          if (current) {
            current.imageURL = photo.url;
            this.accountService.setCurrentUser(current as User);
            this.memberService.member.update( value => {
              if(!value) return value;
              return { ...value, imageUrl: photo.url };
            });
          }
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        console.log(error);
      },
    });
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();
        if (currentUser) {
          console.log('Image has been chnaged here');
          currentUser.imageURL = photo.url;

          this.accountService.setCurrentUser(currentUser as User);
        }
        this.memberService.member.update(
          (member) =>
            ({
              ...member,
              imageUrl: photo.url,
            }) as Members,
        );
      },
    });
  }

  onDeletePhoto(photo: Photo) {
    this.memberService.deletePhoto(photo).subscribe({
      next: () => {
        this.photos.update((photos) => photos.filter((x) => x.id != photo.id));
      },
    });
  }

  photoMock() {
    return Array.from({ length: 20 }, (_, i) => ({
      url: '/user.png',
    }));
  }
}
