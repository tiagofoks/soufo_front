import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserMenuComponent } from '../../components/user-menu/user-menu';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-account',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, UserMenuComponent],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class AccountComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  readonly initials = signal('');
  readonly userEmail = signal('');
  readonly saveMessage = signal('');
  readonly saveError = signal('');
  readonly isSaving = signal(false);

  profileForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: [{ value: '', disabled: true }],
    phone: [''],
    location: [''],
    bio: ['', Validators.maxLength(280)],
    github: [''],
    linkedin: ['']
  });

  ngOnInit(): void {
    if (!this.userService.isAuthenticated()) {
      void this.router.navigate(['/login']);
      return;
    }

    const profile = this.userService.getProfile();
    this.initials.set(this.userService.getInitials());
    this.userEmail.set(profile.email);

    this.profileForm.patchValue({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      bio: profile.bio,
      github: profile.github,
      linkedin: profile.linkedin
    });
  }

  async saveProfile(): Promise<void> {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.saveMessage.set('');
    this.saveError.set('');

    const formValue = this.profileForm.getRawValue();

    this.userService.updateProfile({
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      phone: formValue.phone,
      location: formValue.location,
      bio: formValue.bio,
      github: formValue.github,
      linkedin: formValue.linkedin
    });

    this.initials.set(this.userService.getInitials());
    this.isSaving.set(false);
    this.saveMessage.set('Perfil atualizado com sucesso.');
  }

  goToChangePassword(): void {
    void this.router.navigate(['/forgot-password']);
  }
}
