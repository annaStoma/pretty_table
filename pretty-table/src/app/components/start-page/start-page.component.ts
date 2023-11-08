import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DisplayedColumns} from "../../models/table.model";
import {UserData} from "../../models/user";
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
    {name: 'id', hidden: false},
    {name: 'name', hidden: false},
    {name: 'progress', hidden: false},
    {name: 'fruit', hidden: false},
  ];
  data: UserData[];
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
        this.data = [...data.items];
      })
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
