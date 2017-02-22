import {TestBed, async, inject, getTestBed, fakeAsync, tick} from "@angular/core/testing";
import {PermissionService} from "./Permission.service";
import {
  HttpModule, Response, ResponseOptions, XHRBackend, ConnectionBackend, RequestOptions, BaseRequestOptions, Http
} from "@angular/http";
import {MockBackend, MockConnection} from "@angular/http/testing";
import {Permission} from "../model/permission.model";
import {Injector, ReflectiveInjector} from "@angular/core";

describe('PermissionService', () => {
  let mockBackend: MockBackend;
  let service: PermissionService;
  let injector: Injector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        {provide: XHRBackend, useClass: MockBackend},
        PermissionService
      ]
    });
    injector = getTestBed();
  });

  beforeEach(inject([XHRBackend, PermissionService], (_mockBackend, _service) => {
    mockBackend = _mockBackend;
    service = _service;
  }));

  it('getPermissions() should return an Promise', async(() => {
    let mockPermission = {name: 'Permission 0'};
    mockBackend.connections.subscribe((connection: MockConnection) => {
      let responseOpts = new ResponseOptions({body: JSON.stringify(mockPermission)});
      connection.mockRespond(new Response(responseOpts));
    });
    let permissions: Permission[];
    permissions = service.getSessionPermissionsArray()
    expect(permissions.length).toBe(9);
    expect(permissions[0].name).toBe('EPP');
    expect(permissions[1].name).toBe('SERVER_SIDE_STATUS');
    expect(permissions[2].name).toBe('CRU_REGISTRY_ADMIN');
    expect(permissions[3].name).toBe('CRU_REGISTRAR_USER');
    expect(permissions[4].name).toBe('CRU_REGISTRAR_ADMIN');
    expect(permissions[5].name).toBe('CRU_REGISTRAR_USER');
    expect(permissions[6].name).toBe('CRU_TLD');
    expect(permissions[7].name).toBe('CRU_REGISTRAR');
    expect(permissions[8].name).toBe('CRU_PRICE_CATEGORIES');
  }));
});

describe('MockBackend PermissonService Example', () => {
  beforeEach(() => {
    this.injector = ReflectiveInjector.resolveAndCreate([
      {provide: ConnectionBackend, useClass: MockBackend},
      {provide: RequestOptions, useClass: BaseRequestOptions},
      Http,
      PermissionService,
    ]);
    this.permissionService = this.injector.get(PermissionService);
    this.backend = this.injector.get(ConnectionBackend) as MockBackend;
    this.backend.connections.subscribe((connection: any) => this.lastConnection = connection);
  });
  it('getHeroes() should query current service url', () => {
    this.permissionService.getPermissions();
    expect(this.lastConnection).toBeDefined('no http service connection at all?');
    expect(this.lastConnection.request.url).toMatch(/api\/permissions$/, 'url invalid');
  });
  it('getPermissions() should return some permissions', fakeAsync(() => {
    let mockPermission1 = {name: 'Permission 1'};
    let mockPermission2 = {name: 'Permission 2'};
    let result: String[];
    this.permissionService.getPermissions().then((perms: String[]) => result = perms);
    this.lastConnection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify({data: [mockPermission1, mockPermission2]}),
    })));
    tick();
    expect(result.length).toEqual(2, 'should contain given amount of permissions');
    expect(result[0]).toEqual(mockPermission1, ' Permission 1 should be the first permission');
    expect(result[1]).toEqual(mockPermission2, ' Permission 2 should be the second permission');
  }));

  it('getPermissions() should return some permissions', fakeAsync(() => {
    let mockPermission1 = {name: 'Permission 0'};
    let result: String[];
    this.permissionService.getPermission('Permission 0').then((perms: String[]) => result = perms);
    this.lastConnection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify({data: [mockPermission1]}),
    })));
    tick();
    expect(result.length).toEqual(1, 'should contain given amount of permissions');
    expect(result[0]).toEqual(mockPermission1, ' Permission 0 should be the first permission');
  }));

  it('getPermissions() while server is down', fakeAsync(() => {
    let result: String[];
    let catchedError: any;
    this.permissionService.getPermissions()
      .then((perms: String[]) => result = perms)
      .catch((error: any) => catchedError = error);
    this.lastConnection.mockRespond(new Response(new ResponseOptions({
      status: 404,
      statusText: 'URL not Found',
    })));
    tick();
    expect(result).toBeUndefined();
    expect(catchedError).toBeDefined();
  }));
});
