import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API = 'https://bcs.ballistica.workers.dev';

@Injectable({
  providedIn: 'root',
})
export class FreeServerService {
  constructor(private http: HttpClient) {}

  getPasscode(token: string) {
    return this.http.post<HttpResponse<any>>(
      `${API}/getpasscode`,
      { token: token },
      { observe: 'response' },
    );
  }
}
