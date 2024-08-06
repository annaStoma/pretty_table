import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core'
import { DisplayedColumns } from '../../models/table.model'
import { UserDataCustom } from '../../models/user'
import { UserService } from '../../services/user.service'
import { delay, finalize } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { TableComponent } from '../table/table.component'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { CommonModule } from '@angular/common'

@Component({
	selector: 'app-start-page',
	templateUrl: './start-page.component.html',
	styleUrls: ['./start-page.component.scss'],
	imports: [TableComponent, MatProgressSpinnerModule, CommonModule],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartPageComponent implements OnInit {
	showSpinner = signal(true)
	displayedColumns: DisplayedColumns[] = [
		{ name: 'activeCustom', hidden: false, nameInTable: 'active' },
		{ name: 'balance', hidden: false },
		{ name: 'picture', hidden: false },
		{ name: 'age', hidden: false },
		{ name: 'nameCustom', hidden: false, nameInTable: 'name' },
		{ name: 'company', hidden: false },
		{ name: 'email', hidden: false },
		{ name: 'address', hidden: false },
		{ name: 'tagsCustom', hidden: false, nameInTable: 'tags' },
		{ name: 'favoriteFruit', hidden: false, nameInTable: 'favorite fruit' },
	]
	data: UserDataCustom[] = []
	destroyRef = inject(DestroyRef)

	constructor(private userService: UserService) {}

	ngOnInit(): void {
		this.userService
			.getUsers()
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				delay(2000),
				finalize(() => this.showSpinner.set(false))
			)
			.subscribe((data) => {
				data.items = data.items?.map((item) => ({
					...item,
					balance: item.balance || '-',
					company: item.company || '-',
					email: item.email || '-',
					picture: item.picture || '-',
					nameCustom: `${item.name?.first} ${item.name?.last}`,
					tagsCustom: item.tags.join(', '),
					activeCustom: item.isActive ? 'Yes' : 'No',
				}))
				this.data = [...(data.items as UserDataCustom[])]
			})
	}
}
