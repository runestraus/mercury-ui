import { Component, OnInit, Input } from '@angular/core';
import { IcannService } from '../../service/icann.service';
import { IcannRegistrar } from '../../model/icannRegistrar.counter.model';
import { Tld } from '../../model/tld.model';
import { MeService } from '../../service/me.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-icann-registrar',
  templateUrl: './icann-registrar.component.html',
  styleUrls: ['./icann-registrar.component.css']
})
export class IcannRegistrarComponent implements OnInit {
  errorMessage: string;
  allTlds: Tld[];
  years: string[] = [];
  @Input() icannRegistrar: IcannRegistrar;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private service: IcannService,
              private meService: MeService) { }

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i < currentYear + 10; i++) {
      this.years.push(i.toString());
    }
    this.icannRegistrar = new IcannRegistrar();
    this.meService.get().then(user => {
      this.icannRegistrar.clientId = user.clientId;
    });
    this.icannRegistrar.preRampUpRegistrarsCount = 0;
    this.icannRegistrar.rampUpRegistrarsCount = 0;
    this.icannRegistrar.zfaPasswordsCount = 0;
    this.service.getAllTlds()
      .then( results => this.allTlds = results)
      .catch(error => this.errorMessage = error);
  }

  submit() {
    this.service.submitIcannRegistrar(this.icannRegistrar)
      .then(results => {
        this.errorMessage = null;
        this.icannRegistrar = results;
      })
      .catch(error => {
        this.errorMessage = this.extractErrorMessage(error);
      });
  }

  extractErrorMessage(error: string): string {
    return error.substring(error.indexOf(':') + 1);
  }

  onCancel() {
    this.router.navigate(['../..'], { relativeTo: this.route });
  }
}
