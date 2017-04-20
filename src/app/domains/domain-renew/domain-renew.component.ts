import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomainEppService } from '../../service/domain-epp.service';
import { DomainDetail } from '../../model/domain.model';

@Component({
  selector: 'app-domain-renew',
  templateUrl: './domain-renew.component.html',
  styleUrls: ['./domain-renew.component.css']
})
export class DomainRenewComponent implements OnInit {
  domainName: string;
  domainDetail: DomainDetail;
  loading = true;
  showDialog: boolean;
  domainRenewForm: FormGroup;
  error: string;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private domainEppService: DomainEppService) {
  }

  ngOnInit() {
    this.domainName = this.route.snapshot.params['domainName'];
    this.createForm();
    this.getDomain();
    this.showDialog = true;
  }

  onSubmit() {
    this.domainEppService.renew(this.domainName,
      this.domainDetail.registrationExpirationTime.substring(0, 10),
      this.domainRenewForm.value.renewalPeriod)
      .then(() => {
        this.router.navigate(['../'], { relativeTo: this.route });
      })
      .catch(err => {
        if (err.message) {
          this.error = err.message;
        } else {
          this.error = 'There was an error processing your renewal';
        }
      });
  }

  getDomain() {
    this.domainEppService.info(this.domainName, null).then(domainDetail => {
      this.loading = false;
      this.domainDetail = domainDetail;
    }).catch(err => {
      this.loading = false;
      // switch these blocks of code to test out the partial domain info display
      if (err.code && err.message) {
        this.error = err.message;
      } else {
        console.error(err);
        this.error = 'There was an error getting domain info';
      }
    });
  };

  createForm() {
    this.domainRenewForm = this.fb.group({
      renewalPeriod: ['1', Validators.required]
    });
  }

  onCloseClicked() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}
