import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API = "https://mods.ballistica.workers.dev"
const httpOption={
  headers:new HttpHeaders({'Content-Type':'application/json',})
};
let options = {
	headers: httpOption
     };
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  getProxy(){
    return this.http.post(`${API}/getproxy`,{});
  }

  checkLoginProgress(date: any,proxy: any,key: any) {
    return this.http.get<HttpResponse<any>>(`${API}/login`,{params:{date:date,proxy:proxy,key:key},observe:'response'});
  }
}
