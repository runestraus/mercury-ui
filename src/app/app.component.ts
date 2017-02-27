import { Component, OnInit } from '@angular/core';
import { SessionService } from './service/session.service';
import { Router } from '@angular/router';
import {Component, Inject} from '@angular/core';
import {Permission} from "./model/permission.model";
import {PermissionService} from "./service/Permission.service";

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
