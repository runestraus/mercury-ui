import { Component, OnInit, Input, HostListener } from '@angular/core';
import { SessionService } from '../service/session.service';
import { Profile, UserData } from '../model/profile.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  menuOpen = false;
  @Input() userInfo: UserData;
  constructor(private sessionService: SessionService) { }

  ngOnInit() {}

  openMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  logout() {
    this.sessionService.signOut();
  }

}
