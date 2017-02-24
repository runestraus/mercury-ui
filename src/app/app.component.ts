import { Component, OnInit } from '@angular/core';
import { SessionService } from './service/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private sessionService: SessionService,
              private router: Router) {}

  ngOnInit(): void {
    this.sessionService.initialize();
  }

  isLoggedIn(): boolean {
    return this.sessionService.isLoggedIn();
  }
}
