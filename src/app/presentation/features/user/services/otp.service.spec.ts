import { fakeAsync, tick } from '@angular/core/testing';
import { OTP_DEMO, OtpChallenge, OtpService } from './otp.service';

describe('OTP simulation', () => {
  let service: OtpService;
  let challenge: OtpChallenge;

  beforeEach(() => { service = new OtpService(); });

  function request(): void {
    service.requestCode('ana@example.com').then(value => challenge = value);
    tick(OTP_DEMO.delayMs);
  }

  it('accepts the demo code once and rejects reuse', fakeAsync(() => {
    request();
    let verified = false;
    service.verifyCode('ana@example.com', OTP_DEMO.code, challenge.id).then(() => verified = true);
    tick(OTP_DEMO.delayMs);
    expect(verified).toBeTrue();
    let message = '';
    service.verifyCode('ana@example.com', OTP_DEMO.code, challenge.id).catch(error => message = error.message);
    tick(OTP_DEMO.delayMs);
    expect(message).toContain('Solicita un nuevo');
  }));

  it('rejects an incorrect code', fakeAsync(() => {
    request();
    let message = '';
    service.verifyCode('ana@example.com', '000000', challenge.id).catch(error => message = error.message);
    tick(OTP_DEMO.delayMs);
    expect(message).toContain('no es correcto');
  }));

  it('rejects an expired code', fakeAsync(() => {
    request();
    tick(OTP_DEMO.expiresInSeconds * 1000);
    let message = '';
    service.verifyCode('ana@example.com', OTP_DEMO.code, challenge.id).catch(error => message = error.message);
    tick(OTP_DEMO.delayMs);
    expect(message).toContain('venció');
  }));

  it('invalidates a previous challenge when a new code is requested', fakeAsync(() => {
    request();
    const previousId = challenge.id;
    request();
    let message = '';
    service.verifyCode('ana@example.com', OTP_DEMO.code, previousId).catch(error => message = error.message);
    tick(OTP_DEMO.delayMs);
    expect(message).toContain('Solicita un nuevo');
  }));

  it('rejects a code for another email', fakeAsync(() => {
    request();
    let message = '';
    service.verifyCode('other@example.com', OTP_DEMO.code, challenge.id).catch(error => message = error.message);
    tick(OTP_DEMO.delayMs);
    expect(message).toContain('Solicita un nuevo');
  }));
});
