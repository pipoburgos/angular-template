import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { Observable, tap } from 'rxjs'
import { environment } from 'src/enviroments/enviroment'
import { StorageService } from './storage.service'

export interface TokenResponse {
  access_token: string
  start_expiration_at: number
  expires_in: number
  refresh_token: string
  scope: string
  token_type: string
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient)
  private readonly router = inject(Router)
  private readonly dialog = inject(MatDialog)
  private tokenResponse: TokenResponse | null = null
  private readonly storageService = inject(StorageService)

  public get access_token(): string | undefined {
    return this.tokenResponse?.access_token
  }

  public get hasToken(): boolean {
    return !!this.tokenResponse
  }

  public constructor() {
    this.getTokenFromStorage()
  }

  private getTokenFromStorage() {
    this.tokenResponse = this.storageService.get('token')
  }

  public login(username: string, password: string): Observable<TokenResponse> {
    const body = new URLSearchParams()
    body.set('grant_type', 'password')
    body.set('client_id', environment.client_id)
    body.set('client_secret', environment.client_secret)
    body.set('username', username)
    if (password) {
      body.set('password', password)
    }
    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded',
      ),
    }
    const startExpirationAt = +(new Date().getTime() / 1000).toFixed(0)
    return (
      this.http.post(
        environment.token_endpoint,
        body.toString(),
        options,
      ) as Observable<TokenResponse>
    ).pipe(
      tap(tokenResponse => {
        this.setToken(tokenResponse, startExpirationAt)
      }),
    )
  }

  public refreshToken(): Observable<TokenResponse> {
    const body = new URLSearchParams()
    body.set('grant_type', 'refresh_token')
    body.set('client_id', environment.client_id)
    body.set('client_secret', environment.client_secret)
    body.set('refresh_token', this.tokenResponse?.refresh_token ?? '')
    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded',
      ),
    }
    const startExpirationAt = +(new Date().getTime() / 1000).toFixed(0)
    return (
      this.http.post(
        environment.token_endpoint,
        body.toString(),
        options,
      ) as Observable<TokenResponse>
    ).pipe(
      tap((tokenResponse: TokenResponse) => {
        this.setToken(tokenResponse, startExpirationAt)
      }),
    )
  }

  public logout(): Promise<boolean | void> {
    return this.router.navigateByUrl('login').then(() => {
      this.dialog?.closeAll()
      this.tokenResponse = null
      this.storageService.remove('token')
    })
  }

  private setToken(tokenResponse: TokenResponse, startExpirationAt: number) {
    tokenResponse.start_expiration_at = startExpirationAt
    this.tokenResponse = tokenResponse
    this.storageService.set(this.tokenResponse, 'token')
  }

  public tokenHasExpired(): boolean {
    if (this.tokenResponse) {
      const minutesRightNow = +(new Date().getTime() / 1000).toFixed(0)
      return (
        this.tokenResponse.start_expiration_at + this.tokenResponse.expires_in <
        minutesRightNow
      )
    }
    return false
  }
}
