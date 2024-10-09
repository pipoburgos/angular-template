import { Injectable } from '@angular/core'
import { CryptoService } from './crypto.service'

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public constructor(private readonly cryptoService: CryptoService) {}

  public set(value: unknown, key: string): void {
    const encrypted = this.cryptoService.encrypt(JSON.stringify(value))
    localStorage.setItem(key, encrypted)
  }

  public get<T>(key: string): T {
    const value = localStorage.getItem(key)

    if (!value) return {} as T

    const descrypted = value ? this.cryptoService.decrypt(value) : null
    return descrypted ? JSON.parse(descrypted) : null
  }

  public remove(key: string): void {
    localStorage.removeItem(key)
  }
}
