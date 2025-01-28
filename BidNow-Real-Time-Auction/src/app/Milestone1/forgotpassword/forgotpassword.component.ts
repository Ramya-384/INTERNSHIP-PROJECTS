import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { catchError } from 'rxjs';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgotpassword.component.html',
  standalone: true,
  styleUrls: ['./forgotpassword.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class ForgotPasswordComponent {
  recoveryForm: FormGroup;
  feedbackMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.recoveryForm.valid) {
      const email = this.recoveryForm.get('email')?.value;
      
      this.authService.sendPasswordResetEmail(email).pipe(
        catchError((error) => {
          this.feedbackMessage = 'Error: Could not send password reset link. Please try again.';
          console.error('Password reset error:', error);
          return throwError(() => error);
        })
      ).subscribe(() => {
        this.feedbackMessage = 'A password reset link has been sent to your email.';
        this.recoveryForm.reset();
      });
    } else {
      console.error('Invalid form submission.');
    }
  }
}