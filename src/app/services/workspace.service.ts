import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API = 'https://mods.69420555.xyz';
const API4 = 'https://mods4.69420555.xyz';
@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  workspaces: any;
  constructor(private http: HttpClient) {
    this.initializeWorksapce();
  }

  initializeWorksapce() {
    this.fetchWorkspaceList().subscribe(
      (data: any) => {
        if (data.status == 200) {
          this.workspaces = data.body.workspaces.filter(
            (workspace: string) => workspace != '',
          );
          this.workspaces = this.workspaces.map(
            (element: string, index: number) => {
              return element.replace(index + 1 + ': ', '');
            },
          );
          this.verifyWorkspace();
        }
      },
      (error) => {
        this.workspaces = [];
      },
    );
  }

  verifyWorkspace() {
    if (this.workspaces.length == 0) {
      // no workspace available in this account : sad  , lets create one
      console.log('no workspace found under this account');
      this.createWorkspace('BCS MODS').subscribe((response) => {
        if (response.status == 200) {
          this.setActive('BCS MODS').subscribe((response2) => {
            if (response2.status == 200) {
              console.log('BCS MODS is now activated for this accounr');
              this.initializeWorksapce();
            }
          });
        }
      });
    }
  }

  fetchWorkspaceList() {
    this.http
      .get<HttpResponse<any>>(`${API4}/workspacelist`, {
        headers: { 'Content-Type': 'text/plain' },
        observe: 'response',
      })
      .subscribe((data) => {
        console.log('got data', data);
      });
    return this.http.get<HttpResponse<any>>(`${API}/workspacelist`, {
      headers: { 'Content-Type': 'test/plain' },
      observe: 'response',
    });
  }

  getWorkspaceList() {
    return this.workspaces;
  }

  installModToWorkspace(fileId: string, fileName: string, workspace: string) {
    return this.http.post<HttpResponse<any>>(
      `${API}/urltoworkspace`,
      { fileId: fileId, fileName: fileName, workspace: workspace },
      { observe: 'response' },
    );
  }

  createWorkspace(name: string) {
    return this.http.post<HttpResponse<any>>(
      `${API}/createworkspace`,
      { name: name },
      { observe: 'response' },
    );
  }

  setActive(name: string) {
    return this.http.post<HttpResponse<any>>(
      `${API}/setworkspace`,
      { name: name },
      { observe: 'response' },
    );
  }
}
