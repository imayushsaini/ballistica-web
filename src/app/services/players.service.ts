import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API = 'https://mods.ballistica.workers.dev';
const httpOption={
  headers:new HttpHeaders({'Content-Type':'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  constructor(private http:HttpClient) { }

  getPlayers(key:string){
    if(!key || key=="") key = "Andro"
    return this.http.get(`${API}/player` ,{params:{key:key}});
  }
}
