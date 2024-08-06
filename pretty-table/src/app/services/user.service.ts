import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Grid, UserData } from '../models/user'
import { HttpClient } from '@angular/common/http'

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private url: string = '/assets/data.json'

	constructor(private http: HttpClient) {}

	getUsers(): Observable<Grid<UserData>> {
		return this.http.get<Grid<UserData>>(this.url)
	}
}
