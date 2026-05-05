import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { User, UserRegistration } from '../../../types/user';
import { AccountService } from '../../../Core/services/account-service';
import { validate, ValidationError } from '@angular/forms/signals';
import { InputText } from '../../../Shared/input-text/input-text';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, InputText],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  membersFromHome = input.required<User[]>();
  cancelRegistration = output<boolean>();
  protected cred = {} as UserRegistration;
  //protected registerForm: FormGroup = new FormGroup({});
  protected credentialForm: FormGroup;
  protected profileForm: FormGroup;
  protected currentStep = signal(1);
  protected validationError = signal<string[]>([]);

  constructor() {
    this.credentialForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      confirmPassword: ['', [Validators.required, this.matchTo('password')]],
    });

    this.credentialForm.controls['password'].valueChanges.subscribe(() => {
      this.credentialForm.controls['confirmPassword'].updateValueAndValidity();
    });

    this.profileForm = this.fb.group({
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  /* ngOnInit(): void {
    this.initilizeForm();
  }

  initilizeForm() {
    this.registerForm = new FormGroup({
      email: new FormControl('john@test.com', [Validators.required, Validators.email]),
      displayName: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(15),
      ]),
      confirmPassword: new FormControl('', [Validators.required, this.matchTo("password")]),
    });

    this.registerForm.controls["password"].valueChanges.subscribe(()=>{
      this.registerForm.controls["confirmPassword"].updateValueAndValidity()
    })
  } */

  matchTo(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;

      if (!parent) return null;

      const matchValue = parent.get(matchTo)?.value;

      return control.value === matchValue ? null : { passwordMismatch: true };
    };
  }

  nextStep() {
    if (this.credentialForm.valid) {
      this.currentStep.update((value) => value + 1);
    }
  }

  previousStep() {
    this.currentStep.update((value) => value - 1);
  }

  getMAxDate() {
    const date = new Date();

    date.setFullYear(date.getFullYear() - 18);
    return date.toISOString().split('T')[0];
  }
  register() {
    if (this.credentialForm.valid && this.profileForm.valid) {
      const formData = { ...this.credentialForm.value, ...this.profileForm.value };
      this.accountService.register(formData).subscribe({
        next: () => {
          this.router.navigateByUrl('/members')
        },
        error: (error) =>
           {
            this.validationError.set(error)
            console.log(error)
          },
      });
    }
  }

  cancel() {
    this.cancelRegistration.emit(false);
  }
}
