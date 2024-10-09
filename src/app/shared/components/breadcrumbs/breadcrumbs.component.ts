import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core'
import {
  Router,
  NavigationEnd,
  ActivatedRouteSnapshot,
  RouterModule,
} from '@angular/router'
import { filter } from 'rxjs'

interface Breadcrumb {
  label: string
  url: string
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent implements OnInit {
  public breadcrumbs: Breadcrumb[] = []

  public constructor(
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.createBreadcrumbs(
          this.router.routerState.snapshot.root,
        )
        this.cdr.detectChanges()
      })
  }

  private createBreadcrumbs(
    route: ActivatedRouteSnapshot,
    url = '',
    breadcrumbs: Breadcrumb[] = [],
  ): { label: string; url: string }[] {
    const children: ActivatedRouteSnapshot[] = route.children

    if (children.length === 0) {
      return breadcrumbs
    }

    for (const child of children) {
      const routeURL: string = child.url.map(segment => segment.path).join('/')
      if (routeURL !== '') {
        url += `/${routeURL}`
      }

      breadcrumbs.push({ label: routeURL, url })
      return this.createBreadcrumbs(child, url, breadcrumbs)
    }

    return breadcrumbs
  }
}
