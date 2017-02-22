import {Injectable, Inject} from '@angular/core';
import {RegistryAPIService} from './RegistryAPI.service'
import {Permission} from '../model/permission.model';
import {Headers, Http} from "@angular/http";
import 'rxjs/add/operator/toPromise';

const PERMISSIONS: Permission[] = [
  { name: 'EPP' },
  { name: 'SERVER_SIDE_STATUS' },
  { name: 'CRU_REGISTRY_ADMIN' },
  { name: 'CRU_REGISTRAR_USER' },
  { name: 'CRU_REGISTRAR_ADMIN' },
  { name: 'CRU_REGISTRAR_USER' },
  { name: 'CRU_TLD' },
  { name: 'CRU_REGISTRAR' },
  { name: 'CRU_PRICE_CATEGORIES' }
];

@Injectable()
export class PermissionService {

  private permissionUrl = 'api/permissions';
  private permissionParams = ["me"];
  private currentPath = location.pathname;
  private headers = new Headers({'Content-Type': 'application/json'});
  http: Http;

  constructor(private registryAPIService: RegistryAPIService, http: Http) {
    this.http = http;
  }

  update(permission: Permission): Promise<Permission> {
    const url = `${this.permissionUrl}/${permission.name}`;
    return this.http
      .put(url, JSON.stringify(permission), {headers: this.headers})
      .toPromise()
      .then(() => permission)
      .catch(this.handleError);
  }

  getPermission(name: string): Promise<Permission> {
    const url = `${this.permissionUrl}/${name}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as Permission)
      .catch(this.handleError);
  }

  getHPermissions(): Promise<Permission[]> {
    return this.http.get(this.permissionUrl)
      .toPromise()
      .then(response => response.json().data as Permission[])
      .catch(this.handleError);
  }

  public getSessionPermissionsArray():  Permission[]{
    return PERMISSIONS;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  // getSessionPermissionLevel(): Promise<Permission[]> {
  //
  //   if(this.currentPath != "/unauthorized") {
  //     // registryAPIService.apiGet(this.permissionParams).then(function (permissionData) {
  //     //   ctrl.userData = permissionData.data;
  //     //   ctrl.timeout(function () {
  //     //     /*
  //     //      * Note:
  //     //      * $timeouts are not called in unit tests so this will show up as not covered
  //     //      * readAuthCookies() does have its own tests though.
  //     //      */
  //     //     ctrl.readAuthCookies();
  //       }, 150);
  //     }, function (responseMessage) {
  //       console.log("failed to get user info: " + responseMessage.statusText);
  //       console.log("redirect to login");
  //       /*
  //        * TODO:
  //        * Add constants for routes, paths, urls...
  //        */
  //       // ctrl.window.location.href = "/login/#/";
  //     });
  //   }
  //   return http.get(this.permissionUrl)
  //     .toPromise()
  //     .then(response => response.json().data as Permission[])
  //     .catch(this.handleError);
  // }
}
