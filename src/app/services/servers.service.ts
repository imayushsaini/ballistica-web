import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
const API = 'https://mods.69420555.xyz';
const httpOption = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class ServersService {
  constructor(private http: HttpClient) {}

  getServers(size: any, page: any, key: string) {
    return this.http.get(`${API}/allservers`, {
      params: { page: page, size: size, key: key },
    });
  }
}
