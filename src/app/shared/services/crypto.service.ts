import { Injectable } from '@angular/core'
import * as CryptoJS from 'crypto-js'
type WordArray = CryptoJS.lib.WordArray
type CipherParams = CryptoJS.lib.CipherParams

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private readonly secret = '8aac82ee-5c4e-4cc3-8750-cb9afe0c6d81'

  public encrypt(value: WordArray | string): string {
    const encrypted = CryptoJS.AES.encrypt(value, this.secret).toString()
    return encrypted
  }

  public decrypt(value: CipherParams | string): string {
    const decrypted = CryptoJS.AES.decrypt(value, this.secret)
    return decrypted.toString(CryptoJS.enc.Utf8)
  }
}
