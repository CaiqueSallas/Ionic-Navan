import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	private currentUserSubject: BehaviorSubject<User>;
	private token: BehaviorSubject<string>;

	public currentUser: Observable<User>;
	public tokenObservable: Observable<string>;

	constructor(private http: HttpClient) {
		this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
		this.token = new BehaviorSubject<string>(JSON.parse(localStorage.getItem('token')));
		this.currentUser = this.currentUserSubject.asObservable();
		this.tokenObservable = this.token.asObservable();
	}

	public get currentUserValue(): User {
		return this.currentUserSubject.value;
	}

	public get getToken(): string {
		return this.token.value;
	}

	login(username: string, password: string, tipoLogin: string) {
		return this.http.post<any>(`${environment.apiUrl}/login${tipoLogin}`, { username, password })
			.pipe(map(user => {
				console.log('user', user)
				localStorage.setItem('user', JSON.stringify(user.usuario));
				localStorage.setItem('token', JSON.stringify(user.token));
				this.currentUserSubject.next(user.usuario);
				return user.usuario;
			}));
	}

	logout() {
		return this.http.post<any>(`${environment.apiUrl}/logout`, { })
			.pipe(map(() => {

				localStorage.removeItem('user');
				localStorage.removeItem('token');

				this.currentUserSubject.next(null);
				return true;
			}));
	}
}
