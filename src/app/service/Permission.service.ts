import {Injectable} from '@angular/core';
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

  constructor(private http: Http) {}

  getPermission(name: string): Promise<Permission> {
    const url = `${this.permissionUrl}/${name}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as Permission)
      .catch(this.handleError);
  }

  getPermissions(): Promise<Permission[]> {
    return this.http.get(this.permissionUrl)
      .toPromise()
      .then(response => response.json().data as Permission[])
      .catch(this.handleError);
  }

  getSessionPermissionsArray():  Permission[]{
    return PERMISSIONS;
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
