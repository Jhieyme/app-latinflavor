import { AppInput } from '../../../../shared/input/input';
import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { DocumentType } from '../../../../../../domain/models/customer/customer';
import { UserSessionStore } from '../../services/store/user-session.store';
import { CustomerProfileFacade } from '../../services/facades/customer-profile-facade';
import { ToastService } from '../../../../../services/toast/toast.service';

@Component({
  selector: 'app-complete-profile',
  imports: [AppInput, FormsModule],
  templateUrl: './complete-profile.html',
  styleUrl: './complete-profile.css',
})
export class CompleteProfile {
  readonly editing = input(false);
  readonly saved = output<void>();
  private readonly store = inject(UserSessionStore);
  private readonly facade = inject(CustomerProfileFacade);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly customer = this.store.profile();
  readonly email = this.customer?.email ?? this.store.email();
  readonly saving = signal(false);
  firstName = this.customer?.firstName ?? '';
  paternalLastName = this.customer?.paternalLastName ?? '';
  maternalLastName = this.customer?.maternalLastName ?? '';
  phone = (this.customer?.phoneNumber ?? '').replace(/^\+51/, '');
  documentType: DocumentType = this.customer?.documentType ?? 'DNI';
  documentNumber = this.customer?.documentNumber ?? '';
  birthDate = this.customer?.birthDate ?? '';
  readonly maxBirthDate = this.yesterday();

  private yesterday(): string {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  updatePhone(value: string): void {
    this.phone = value.replace(/\D/g, '').slice(0, 9);
  }

  completeProfile(form: NgForm): void {
    if (!this.store.accessToken()) return;
    const userId = this.store.session()?.userId;
    if (this.saving() || !this.customer || !userId) return;
    if (form.invalid || this.birthDate > this.maxBirthDate) {
      form.control.markAllAsTouched();
      this.toast.show(
        'Revisa los datos y selecciona una fecha de nacimiento anterior a hoy.',
        'error',
      );
      return;
    }
    this.saving.set(true);
    this.facade
      .complete(this.customer.id, userId, {
        firstName: this.firstName.trim(),
        paternalLastName: this.paternalLastName.trim(),
        maternalLastName: this.maternalLastName.trim(),
        phoneNumber: this.phone,
        documentType: this.documentType,
        documentNumber: this.documentNumber.trim(),
        birthDate: this.birthDate,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.saving.set(false)),
      )
      .subscribe({
        next: (customer) => {
          this.store.setProfile(customer);
          if (!this.store.accessToken()) return;
          if (!customer.profileCompleted) {
            this.toast.show(
              'Tu perfil aún está incompleto. Revisa los campos requeridos.',
              'error',
            );
            return;
          }
          if (this.editing()) {
            this.toast.show('Tu perfil se actualizó correctamente.');
            this.saved.emit();
          } else {
            void this.router.navigate(['/user/home'], { replaceUrl: true });
          }
        },
        error: (error: unknown) => this.toast.showError(error),
      });
  }
}
