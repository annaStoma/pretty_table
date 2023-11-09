import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DisplayedColumns} from "../../models/table.model";
import {UserDataCustom} from "../../models/user";
import {UserService} from "../../services/user.service";
import {delay, finalize, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartPageComponent implements OnInit {
  showSpinner: boolean = true;
  displayedColumns: DisplayedColumns[] = [
    {name: 'activeCustom', hidden: false, nameInTable: 'active'},
    {name: 'balance', hidden: false},
    {name: 'picture', hidden: false},
    {name: 'age', hidden: false},
    {name: 'nameCustom', hidden: false, nameInTable: 'name'},
    {name: 'company', hidden: false},
    {name: 'email', hidden: false},
    {name: 'address', hidden: false},
    {name: 'tagsCustom', hidden: false, nameInTable: 'tags'},
    {name: 'favoriteFruit', hidden: false, nameInTable: 'favorite fruit'},
  ];
  data: UserDataCustom[];
  protected readonly destroySubject: Subject<void> = new Subject<void>();

  constructor(private userService: UserService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.userService.getUsers()
      .pipe(takeUntil(this.destroySubject),
        delay(2000),
        finalize(() => {
          this.showSpinner = false;
          this.cdr.detectChanges();
        }))
      .subscribe(data => {
        data.items = data.items.map(item => ({
          ...item,
          balance: item.balance || '-',
          company: item.company || '-',
          email: item.email || '-',
          picture: item.picture || '-',
          nameCustom: `${item.name?.first} ${item.name?.last}`,
          tagsCustom: item.tags.join(', '),
          activeCustom: item.isActive ? 'Yes' : 'No',
        }));
        this.data = [...data.items as UserDataCustom[]];
      })
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
