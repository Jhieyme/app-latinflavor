import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../../../../app.routes';
import { AdminLogin } from './login';
import { ADMIN_LOGIN_DEMO, AdminAuthService } from '../../services/admin-auth.service';

describe('Admin login', () => {
  it('opens the login from /admin', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/admin', AdminLogin);
    expect(harness.routeNativeElement?.querySelector('input[type="password"]')).toBeTruthy();
  });

  it('rejects invalid credentials and accepts demo credentials', async () => {
    const auth = new AdminAuthService();
    await expectAsync(auth.login('admin', 'incorrect')).toBeRejectedWithError('El usuario o la contraseña no son correctos.');
    await expectAsync(auth.login(ADMIN_LOGIN_DEMO.username, ADMIN_LOGIN_DEMO.password)).toBeResolved();
  });

  it('shows login errors and clears the password after success', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const page = TestBed.runInInjectionContext(() => new AdminLogin());
    page.username = 'admin';
    page.password = 'incorrect';
    await page.submit();
    expect(page.error()).toContain('no son correctos');
    expect(page.success()).toBeFalse();
    page.password = ADMIN_LOGIN_DEMO.password;
    await page.submit();
    expect(page.success()).toBeTrue();
    expect(page.password).toBe('');
    expect(page.error()).toBe('');
  });
});
