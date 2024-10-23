import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class SvgCacheService {
  private svgCache: Record<string, string> = {} // Cache en memoria para los SVG

  public constructor(private readonly http: HttpClient) {}

  // Método para obtener el SVG cacheado o cargarlo si no está en caché
  public getSvg(url: string): Observable<string> {
    // Si el SVG ya está en el caché, devolverlo directamente
    if (this.svgCache[url]) {
      return of(this.svgCache[url])
    }

    // Si no está en caché, cargarlo vía HTTP y cachearlo
    return this.http.get(url, { responseType: 'text' }).pipe(
      tap(svg => (this.svgCache[url] = svg)), // Guardar el SVG en el caché
    )
  }
}
