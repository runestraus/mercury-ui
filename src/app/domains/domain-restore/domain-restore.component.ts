import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DomainEppService} from '../../service/domain-epp.service';

@Component({
  selector: 'app-domain-restore',
  templateUrl: './domain-restore.component.html',
  styleUrls: ['./domain-restore.component.css']
})
export class DomainRestoreComponent implements OnInit {

  domainName: string;
  showDialog: boolean;
  error: any;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private domainEppServive: DomainEppService) { }

  ngOnInit() {
    this.showDialog = true;
    this.domainName = this.route.snapshot.params['domainName'];
  }

  goBack() {
    this.router.navigate(['..'], {relativeTo: this.route});
  }

  onSubmit() {
      this.domainEppServive.restore(this.domainName)
      .then(result => {
        this.goBack();
      })
      .catch(err => {
        this.error = err.message;
      });
  }

  onCloseClicked() {
    this.goBack();
  }

}
