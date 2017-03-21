import { Component, OnInit } from '@angular/core';
import { SessionService } from './service/session.service';
import { Router } from '@angular/router';
import { UserData } from './model/profile.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  theUser: UserData;
  constructor(private sessionService: SessionService, private router: Router) {}

  ngOnInit(): void {
    const currentUser = this.sessionService.tryGetCurrentUser();
    if (currentUser) {
      this.theUser = currentUser;
    }
    this.sessionService.initialize();
    this.sessionService.onSignIn(user => {
      this.theUser = user;
    });
    this.sessionService.onSignedOut(() => {
      this.theUser = null;
      this.router.navigate(['/']);
    });
  }
}
