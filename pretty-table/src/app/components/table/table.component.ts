import { ChangeDetectionStrategy, Component, Input, OnInit, AfterViewInit, ViewChild } from '@angular/core'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { DisplayedColumns } from '../../models/table.model'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

@Component({
	selector: 'app-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss'],
	standalone: true,
	imports: [MatFormFieldModule, FormsModule, MatSelectModule, MatPaginator, MatTableModule, CommonModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T> implements OnInit, AfterViewInit {
	dataSource: MatTableDataSource<T>
	columnsProps: string[] = []
	@Input() fixedHeight: boolean = true
	@Input() manageColumnsMode: boolean = false
	@Input() pageSizeOptions: number[] = [5, 10, 25, 100]
	@Input() displayedColumns: DisplayedColumns[] = []
	@Input() data: T[] = []
	@ViewChild(MatPaginator) paginator: MatPaginator
	@ViewChild(MatSort) sort: MatSort

	ngOnInit(): void {
		this.dataSource = new MatTableDataSource(this.data)
		this.checkHiddenColumns()
	}

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator
		this.dataSource.sort = this.sort
		this.checkHiddenColumns()
	}

	applyFilter(column: string, filterValue: string): void {
		this.dataSource.filterPredicate = (data: T, filter: string) => {
			return String(data[column])?.trim().toLowerCase()?.includes(filter?.trim().toLowerCase())
		}
		this.dataSource.filter = filterValue.trim().toLowerCase()
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage()
		}
	}

	onChange(value: boolean, index: number): void {
		this.displayedColumns[index].hidden = value
		this.checkHiddenColumns()
	}

	checkHiddenColumns(): void {
		this.columnsProps = this.displayedColumns.filter((c) => !c?.hidden).map((column) => column?.name)
	}
}
