import { Component, OnInit } from '@angular/core';
import { SessionService } from './service/session.service';
import { Router } from '@angular/router';
import { userInfo } from 'os';
import { isNullOrUndefined } from 'util';
import { UserData } from './model/profile.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  theUser: UserData;
  private _isLoggedIn = false;
  constructor(private sessionService: SessionService, private router: Router) {}

  ngOnInit(): void {
    this.sessionService.initialize();
    this.sessionService.onSignIn(user => {
      this.theUser = user;
      this._isLoggedIn = true;
    });
    this.sessionService.onSignedOut(() => {
      this.theUser = null;
      this.router.navigate(['/']);
    });
  }

  isLoggedIn(): boolean {
    return this._isLoggedIn;
  }
}
