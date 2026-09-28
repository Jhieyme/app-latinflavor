import { AppInput } from '../../../../shared/input/input';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserSessionStore } from '../../services/store/user-session.store';

@Component({
  selector: 'app-complete-profile',
  imports: [AppInput, FormsModule],
  templateUrl: './complete-profile.html',
  styleUrl: './complete-profile.css',
})
export class CompleteProfile {
  private readonly userSessionStore = inject(UserSessionStore);
  private readonly router = inject(Router);

  readonly email = this.userSessionStore.email;
  readonly session = this.userSessionStore.session;
  name = '';
  phone = '';

  updatePhone(value: string): void {
    this.phone = value.replace(/\D/g, '').slice(0, 9);
  }

  completeProfile(): void {
    const name = this.name.trim();

    if (!this.session() || !name || !/^9\d{8}$/.test(this.phone)) return;

    this.userSessionStore.completeProfile({
      name,
      email: this.email(),
      phone: `+51${this.phone}`,
    });

    void this.router.navigate(['/user/home'], {
      state: { userName: name },
    });
  }

}
