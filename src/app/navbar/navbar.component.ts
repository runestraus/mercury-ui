import { Component, OnInit } from '@angular/core';
import { SessionService } from '../service/session.service';
import { Profile } from '../model/profile.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  menuOpen = false;
  profile: Profile;
  constructor(private sessionService: SessionService) { }

  ngOnInit() {
    this.profile = this.sessionService.getUserProfile();
  }

  openMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.sessionService.logOut();
  }

}
