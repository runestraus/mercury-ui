import { DocQuery } from '../../shared/testutils';
import {
  tick, ComponentFixture
} from '@angular/core/testing';
import { AppComponent } from '../../app.component';
import { GoogleOauthService } from '../../service/google-oauth.service';
import { GoogleProfile } from '../../model/profile.model';

/** Reusable page object for login and logout functions */
export class LoginLogoutPage {
  query: DocQuery<AppComponent>;

  constructor(
      private fixture: ComponentFixture<AppComponent>,
      private googleService: any) {
    this.query = new DocQuery(fixture);
  }

  isLoginButtonPresent(): boolean {
    const el = this.query.getElementByCss('#google-login');
    return el != null;
  }

  login(): void {
    const el = this.query.getElementByCss('#google-login');
    expect(el).toBeTruthy();
    el.nativeElement.click();
    tick();
    this.fixture.detectChanges();
  }

  logout(): void {
    const el = this.query.getElementByCss('#logout');
    expect(el).toBeTruthy();
    el.nativeElement.click();
    tick();
    this.fixture.detectChanges();
  }

  invokeSignin(): void {
    const onSignedIn: jasmine.Spy = this.googleService.onSignedIn;
    const callback = onSignedIn.calls.argsFor(0)[0];
    const googleProfile: GoogleProfile = {
      getId: () => 'foobar',
      getEmail: () => 'foo@bar.com',
      getName: () => 'Foo Bar',
      getFamilyName: () => 'Bar',
      getGivenName: () => 'Foo',
      getImageUrl: () => '',
    };
    callback(googleProfile);
    tick();
    this.fixture.detectChanges();
  }
}
