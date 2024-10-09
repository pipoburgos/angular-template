import { Injectable } from '@angular/core'
import { HttpRequest, HttpResponse } from '@angular/common/http'
import { environment } from 'src/enviroments/enviroment'

export interface CacheEntry {
  url: string
  response: HttpResponse<unknown>
  entryTime: number
}

export abstract class Cache {
  public abstract get(req: HttpRequest<unknown>): HttpResponse<unknown> | null
  public abstract put(
    req: HttpRequest<unknown>,
    res: HttpResponse<unknown>,
  ): void
}

/**
 * Servicio que gestiona CRUD sobre memoria caché del navegador.
 */
@Injectable({
  providedIn: 'root',
})
export class CacheService implements Cache {
  private readonly cacheMap = new Map<string, CacheEntry>()
  private readonly minutes = environment.max_cache_minutes * 60_000

  public get(req: HttpRequest<unknown>): HttpResponse<unknown> | null {
    const entry = this.cacheMap.get(req.urlWithParams)
    if (!entry) {
      return null
    }

    const isExpired = Date.now() - entry.entryTime > this.minutes
    return isExpired ? null : entry.response
  }

  public put(req: HttpRequest<unknown>, res: HttpResponse<unknown>): void {
    const entry: CacheEntry = {
      url: req.urlWithParams,
      response: res,
      entryTime: Date.now(),
    }
    this.cacheMap.set(req.urlWithParams, entry)
    this.deleteExpiredCache()
  }

  public clear(): void {
    this.cacheMap.forEach(entry => {
      this.cacheMap.delete(entry.url)
    })
  }

  private deleteExpiredCache(): void {
    this.cacheMap.forEach(entry => {
      if (Date.now() - entry.entryTime > this.minutes) {
        this.cacheMap.delete(entry.url)
      }
    })
  }
}
