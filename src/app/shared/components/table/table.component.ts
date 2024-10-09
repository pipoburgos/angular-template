import { CommonModule, DatePipe } from '@angular/common'
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
} from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatSort, MatSortModule } from '@angular/material/sort'
import {
  MatColumnDef,
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table'
import { DialogService, EurosPipe, FechaPipe } from '@shared'
import { Subject } from 'rxjs'

export interface Column {
  text?: string
  id: string
  width?: number
}
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatSortModule,
    MatPaginatorModule,
    FechaPipe,
    DatePipe,
    EurosPipe,
  ],
  providers: [FechaPipe, DatePipe, EurosPipe],
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent
  implements OnChanges, OnDestroy, AfterViewInit, AfterContentInit
{
  @Input() public showDetails = false
  @Input() public showEdit = false
  @Input() public showDelete = false
  @Input({ required: true }) public columns: Column[] = []
  @Input() public pagination = false

  @Input() public items: unknown[] = []
  @Output() public details = new EventEmitter()
  @Output() public edit = new EventEmitter()
  @Output() public delete = new EventEmitter()
  public dataSource = new MatTableDataSource()
  public displayedColumns: string[] = []
  public actionWidth = '5px'
  @ViewChild(MatSort) public sort!: MatSort
  @ViewChild(MatPaginator)
  public paginator!: MatPaginator
  // Detecta las columnas proyectadas desde el padre
  @ContentChildren(MatColumnDef) public columnDefs!: QueryList<MatColumnDef>
  @ViewChild(MatTable) public table!: MatTable<unknown>
  private readonly unsubscribe$ = new Subject<void>()

  public constructor(
    private readonly dialogService: DialogService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  public ngOnChanges(simples: SimpleChanges): void {
    if (simples['columns']) {
      this.displayedColumns = this.columns.map(c => c.id)
    }

    if (simples['canDelete']) {
      this.displayedColumns.push('delete')
    }

    if (simples['items']) {
      this.dataSource.data = this.items
    }

    this.cdr.detectChanges()
  }

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
  }

  public ngAfterContentInit(): void {
    this.displayedColumns = this.columns.map(c => c.id)

    if (this.showDetails) this.displayedColumns.push('details')

    if (this.showEdit) this.displayedColumns.push('edit')

    if (this.showDelete) this.displayedColumns.push('delete')

    // Registrar las columnas personalizadas en la tabla
    this.columnDefs.forEach(columnDef => {
      this.table.addColumnDef(columnDef)
      if (!this.displayedColumns.includes(columnDef.name)) {
        this.displayedColumns.push(columnDef.name)
      }
    })

    this.cdr.detectChanges()
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  public detailsClick(row: Column): void {
    this.details.emit(row)
  }

  public editClick(row: Column): void {
    this.edit.emit(row)
  }

  public deleteClick(row: Column): void {
    this.dialogService.openConfirmDialog().subscribe(ok => {
      if (ok) this.delete.emit(row)
    })
  }
}
