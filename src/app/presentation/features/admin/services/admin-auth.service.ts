import { Injectable } from '@angular/core';

export const ADMIN_LOGIN_DEMO = {
  username: 'admin',
  password: 'LatinFlavor123',
} as const;

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  // Sustituir por la llamada a la API. Esta simulación no crea sesión ni tokens.
  async login(username: string, password: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (username !== ADMIN_LOGIN_DEMO.username || password !== ADMIN_LOGIN_DEMO.password) {
      throw new Error('El usuario o la contraseña no son correctos.');
    }
  }
}
