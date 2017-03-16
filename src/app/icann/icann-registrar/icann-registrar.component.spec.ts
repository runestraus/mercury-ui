import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IcannRegistrarComponent } from './icann-registrar.component';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { IcannService } from '../../service/icann.service';
import { HttpClient } from '../../shared/http.client';
import { MeService } from '../../service/me.service';
import { By } from '@angular/platform-browser';

describe('IcannRegistrarComponent', () => {
  let component: IcannRegistrarComponent;
  let fixture: ComponentFixture<IcannRegistrarComponent>;
  let meService;

  const deTldInput = DebugElement;
  const deDate = DebugElement;
  const deRampUpCount = DebugElement;
  const dePreRampUpCount = DebugElement;
  const deZfaPasswordsCount = DebugElement;
  const elTldInput = HTMLElement;
  const elDate = HTMLElement;
  const elRampUpCount = HTMLElement;
  const elPreRampUpCount = HTMLElement;
  const elZfaPasswordsCount = HTMLElement;

  const mockMeService = {
    get: jasmine.createSpy('meService.get')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcannRegistrarComponent ],
      imports:      [ FormsModule, HttpModule, CalendarModule ],
      providers: [
        IcannService, HttpClient,
        { provide: MeService, useValue: mockMeService }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    meService = TestBed.get(MeService);
    meService.get.and.returnValue(Promise.resolve({ clientId: 'brodaddy' }));

    fixture = TestBed.createComponent(IcannRegistrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    this.deTldInput2 = fixture.debugElement.query(By.css('#tld'));
    this.deDate = fixture.debugElement.query(By.css('#date'));
    this.deRampUpCount = fixture.debugElement.query(By.css('#date'));
    this.dePreRampUpCount = fixture.debugElement.query(By.css('#date'));
    this.deZfaPasswordsCount = fixture.debugElement.query(By.css('#date'));

    this.elTldInput = this.deTldInput2.nativeElement;
    this.elDate = this.deDate.nativeElement;
    this.elRampUpCount = this.deRampUpCount.nativeElement;
    this.elPreRampUpCount = this.dePreRampUpCount.nativeElement;
    this.elZfaPasswordsCount = this.deZfaPasswordsCount.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate form has five fields, tld, date, rampUpCount, preRampUpCount, zfaPasswordsCount', () => {
    expect(this.elTldInput).toBeTruthy();
    expect(this.elDate).toBeTruthy();
    expect(this.elRampUpCount).toBeTruthy();
    expect(this.elPreRampUpCount).toBeTruthy();
    expect(this.elZfaPasswordsCount).toBeTruthy();
  });
});
