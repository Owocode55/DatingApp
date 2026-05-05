import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-error-test',
  imports: [],
  templateUrl: './error-test.html',
  styleUrl: './error-test.css',
})
export class ErrorTest {
  private httpClient = inject(HttpClient);
  private baseURL = 'https://localhost:5001/api/';
  protected modelStateError =signal<[]>([]);

  get401Error() {
    this.httpClient.get(this.baseURL + 'buggy/auth').subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  get404Error() {
    this.httpClient.get(this.baseURL + 'buggy/not-found').subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  get500Error() {
    this.httpClient.get(this.baseURL + 'buggy/server-error').subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  get500BadRequest() {
    this.httpClient.get(this.baseURL + 'buggy/bad-request').subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  get400Validation() {
    this.httpClient.post(this.baseURL + 'account/register', {}).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        this.modelStateError.set(error);
        console.log(error);
      },
    });
  }
}
