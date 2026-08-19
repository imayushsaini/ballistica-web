import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { V2LoginResponse, V2User } from '../models/model';

const API_V2 = 'https://mods.69420555.xyz/v2';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  /**
   * Exchanges a Ballistica Public API Key / Token for a signed JWT session.
   * Endpoint: POST /v2/login
   * Body: { token: "<ballistica_api_key>" }
   */
  loginWithApiKey(apiKey: string): Observable<V2LoginResponse> {
    return this.http.post<V2LoginResponse>(`${API_V2}/login`, {
      token: apiKey.trim(),
    });
  }

  /**
   * Fetches profile info for the authenticated user.
   * Endpoint: GET /v2/accounts/me
   */
  getAccountProfile(): Observable<V2User> {
    return this.http.get<V2User>(`${API_V2}/accounts/me`);
  }
}
