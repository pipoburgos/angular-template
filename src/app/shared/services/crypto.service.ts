import * as CryptoJS from 'crypto-js'

import { Injectable } from '@angular/core'
import { environment } from 'src/enviroments/enviroment'

type WordArray = CryptoJS.lib.WordArray
type CipherParams = CryptoJS.lib.CipherParams

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  public encrypt(value: WordArray | string): string {
    const encrypted = CryptoJS.AES.encrypt(
      value,
      environment.crypto_key ?? '',
    ).toString()
    return encrypted
  }

  public decrypt(value: CipherParams | string): string {
    const decrypted = CryptoJS.AES.decrypt(value, environment.crypto_key ?? '')
    try {
      return decrypted.toString(CryptoJS.enc.Utf8)
    } catch {
      return ''
    }
  }
}
