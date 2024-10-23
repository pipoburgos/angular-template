import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core'
import { SafeHtml } from '@angular/platform-browser'
import { SvgCacheService } from './svg-cache.service'

@Component({
  selector: 'app-svg',
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgComponent implements OnInit {
  @Input({ required: true }) public src!: string
  public svgContent: SafeHtml | undefined

  public constructor(
    private readonly svgCacheService: SvgCacheService,
    private readonly elRef: ElementRef,
    private readonly renderer: Renderer2,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.svgCacheService.getSvg(this.src).subscribe(svg => {
      // Crear un contenedor temporal para el SVG
      const temp = document.createElement('div')
      temp.innerHTML = svg

      // Extraer el nodo SVG desde el contenedor temporal
      const svgElement = temp.querySelector('svg')

      // Insertar el SVG directamente en el componente
      if (svgElement) {
        this.renderer.appendChild(this.elRef.nativeElement, svgElement)
      }
      this.cdr.detectChanges()
    })
  }
}
