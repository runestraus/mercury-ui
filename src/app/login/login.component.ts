import { Component, OnInit } from '@angular/core';
import { SessionService } from '../service/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFailed = false;
  constructor(private sessionService: SessionService) {
  }

  ngOnInit() {
    this.sessionService.loginObservable().subscribe(
      error => this.loginFailed = true
    );
  }

  login() {
    this.sessionService.initOauthFlow();
  }
}
