import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';

@Injectable()
export class PasswordService {
  hashPassword(password: string): Promise<string> {
    return argon.hash(password);
  }

  comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return argon.verify(hashedPassword, plainPassword);
  }
}
