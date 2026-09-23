import { Injectable } from '@angular/core';

// Sustituir los cuerpos de requestCode y verifyCode por llamadas HTTP.
// La interfaz no almacena tokens ni concede una sesión real.
export const OTP_DEMO = {
  code: '123456',
  expiresInSeconds: 300,
  resendInSeconds: 30,
  delayMs: 500,
} as const;

export interface OtpChallenge {
  id: string;
  expiresAt: number;
  resendAt: number;
}

@Injectable({ providedIn: 'root' })
export class OtpService {
  readonly demoCode = OTP_DEMO.code;
  private challenge?: OtpChallenge;
  private email = '';

  async requestCode(email: string): Promise<OtpChallenge> {
    await this.delay();
    const now = Date.now();
    this.email = email;
    this.challenge = {
      id: 'demo-' + now,
      expiresAt: now + OTP_DEMO.expiresInSeconds * 1000,
      resendAt: now + OTP_DEMO.resendInSeconds * 1000,
    };
    return { ...this.challenge };
  }

  async verifyCode(email: string, code: string, challengeId: string): Promise<void> {
    await this.delay();
    if (!this.challenge || this.challenge.id !== challengeId || email !== this.email) {
      throw new Error('Solicita un nuevo código para continuar.');
    }
    if (Date.now() >= this.challenge.expiresAt) {
      throw new Error('El código venció. Solicita uno nuevo.');
    }
    if (code !== OTP_DEMO.code) {
      throw new Error('El código no es correcto. Revísalo e inténtalo de nuevo.');
    }
    this.challenge = undefined;
  }

  private delay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, OTP_DEMO.delayMs));
  }
}
