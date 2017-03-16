import { Component, OnInit } from '@angular/core';
import { SessionService } from '../service/session.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFailed = false;
  environment = environment.name;
  constructor(private sessionService: SessionService) {}

  ngOnInit() {
    this.sessionService.onSignInFailure(() => {
      this.loginFailed = true;
    });
  }

  login() {
    this.sessionService.signIn();
  }
}
