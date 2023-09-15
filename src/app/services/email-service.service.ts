import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private corsAnywhereUrl = 'https://cors-anywhere.herokuapp.com/';
  constructor(private http: HttpClient) {}

  introduceSession(): Observable<any> {
    const apiUrl =
      'https://dropmail.me/api/graphql/p1EjsajfAj6YJFSJ?query=mutation%20%7BintroduceSession%20%7Bid%2C%20expiresAt%2C%20addresses%20%7Baddress%7D%7D%7D';

    const fullUrl = this.corsAnywhereUrl + apiUrl;
    return this.http.get(fullUrl);
  }
}
