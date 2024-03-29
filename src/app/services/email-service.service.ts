import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private corsAnywhereUrl = 'https://cors-anywhere.herokuapp.com/';
  private newEmailSubject = new BehaviorSubject<boolean>(false);
  newEmail$ = this.newEmailSubject.asObservable();
  private currentEmailSubject = new BehaviorSubject<string>('');
  currentEmail$ = this.currentEmailSubject.asObservable();

  constructor(private http: HttpClient) {}

  introduceSession(): Observable<any> {
    const apiUrl =
      'https://dropmail.me/api/graphql/p1EjsajfAj6YJFSJ?query=mutation%20%7BintroduceSession%20%7Bid%2C%20expiresAt%2C%20addresses%20%7Baddress%7D%7D%7D';

    const fullUrl = this.corsAnywhereUrl + apiUrl;
    return this.http.get(fullUrl);
  }

  fetchEmails(): Observable<any> {
    const apiUrl =
      'https://dropmail.me/api/graphql/p1EjsajfAj6YJFSJ?query=query%20%7Bsessions%20%7Bid%2C%20expiresAt%2C%20mails%20%7BrawSize%2C%20fromAddr%2C%20toAddr%2C%20downloadUrl%2C%20text%2C%20headerSubject%7D%7D%7D';

    const fullUrl = this.corsAnywhereUrl + apiUrl;
    return this.http.get(fullUrl);
  }

  notifyNewEmail() {
    this.newEmailSubject.next(true);
  }

  clearNewEmail() {
    this.newEmailSubject.next(false);
  }
  updateCurrentEmail(email: string) {
    this.currentEmailSubject.next(email);
  }
}
