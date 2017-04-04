import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionService } from '../../service/permission.service';

@Directive({
  selector: '[appCan]'
})
export class CanDirective {
  @Input('appCan')
  set appCan(permission: string) {
    this._updateView(permission);
  }
  private hasView = false;

  constructor(private permissionService: PermissionService,
              private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef) { }

  private _updateView(permission: string) {
    this.permissionService.can(permission)
      .then((hasPermission) => {
        if (!hasPermission && this.hasView) {
          this.viewContainer.clear();
          this.hasView = false;
        } else if (hasPermission && !this.hasView) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.hasView = true;
        }
      });
  }
}
