import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiError } from '../../../types/ApiError';

@Component({
  selector: 'app-server-error',
  imports: [],
  templateUrl: './server-error.html',
  styleUrl: './server-error.css',
})
export class ServerError {
  private router = inject(Router);
  protected errorDetails = signal<ApiError | null>(null);
  detailsToggle = signal<Boolean>(false);

    constructor(){
       const navigation =  this.router.currentNavigation();
       this.errorDetails.set(JSON.parse(navigation?.extras?.state?.['error']) as ApiError);
    }


    toggleDetails(){
      this.detailsToggle.set(!this.detailsToggle());
    }
}
