import { CanNotDirective } from './can-not.directive';
import { Component } from '@angular/core';
import { async, ComponentFixtureAutoDetect, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PermissionService } from '../../service/permission.service';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'app-container',
  template: `<div *appCanNot="'THE_PERMISSION'"><div id="some-element"></div></div>`
})
export class ContainerComponent {
}

describe('CanNotDirective', () => {
  const mockPermissionService = {
    can: jasmine.createSpy('permissionService.can')
  };

  let permissionService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{provide: PermissionService, useValue: mockPermissionService},
        { provide: ComponentFixtureAutoDetect, useValue: true }],
      declarations: [CanNotDirective, ContainerComponent]
    });
  }));

  it('should remove the element if permission is allowed', fakeAsync(() => {
    permissionService = TestBed.get(PermissionService);
    permissionService.can.and.returnValue(Promise.resolve(true));
    const fixture = TestBed.createComponent(ContainerComponent);
    tick();
    const el = fixture.debugElement.query(By.css('#some-element'));
    expect(el).toBeFalsy();
  }));

  it('should show the element if permission is allowed', fakeAsync(() => {
    permissionService = TestBed.get(PermissionService);
    permissionService.can.and.returnValue(Promise.resolve(false));
    const fixture = TestBed.createComponent(ContainerComponent);
    tick();
    const el = fixture.debugElement.query(By.css('#some-element'));
    expect(el).toBeTruthy();
  }));
});
