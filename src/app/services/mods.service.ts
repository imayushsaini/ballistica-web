import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

const API = 'https://mods.69420555.xyz';
const httpOption = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class ModsService {
  constructor(private http: HttpClient) {}

  getMods(size: any, page: any, key: string) {
    return this.http.get(`${API}/mods`, {
      params: { page: page, size: size, key: key },
    });
  }
  downloadMod(fileId: String) {
    return this.http.get(`${API}/getFile?fileId=${fileId}`, {
      responseType: 'blob',
    });
  }
}
