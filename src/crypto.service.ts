import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  public encrypt(text: string) {
    const cipher = crypto.createCipher('aes-256-cbc', process.env.CRYPTO_KEY);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  public decrypt(text: string) {
    const decipher = crypto.createDecipher(
      'aes-256-cbc',
      process.env.CRYPTO_KEY,
    );
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
