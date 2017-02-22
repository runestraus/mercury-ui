import {Component, Inject} from '@angular/core';
import {Permission} from "./model/permission.model";
import {PermissionService} from "./service/Permission.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  constructor(private permissionService: PermissionService) {}

  permissions = this.permissionService.getSessionPermissionsArray();

  selectedPermission: Permission;

  onSelect(permission: Permission): void {
    this.selectedPermission = permission;
  }
}
