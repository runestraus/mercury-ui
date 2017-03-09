import { Component, OnInit, Input } from '@angular/core';
import { IcannService } from '../../service/icann.service';
import { IcannRegistrar } from '../../model/icannRegistrar.counter.model';
import { Tld } from '../../model/tld.model';
import { MeService } from '../../service/me.service';

@Component({
  selector: 'app-icann-registrar',
  templateUrl: './icann-registrar.component.html',
  styleUrls: ['./icann-registrar.component.css']
})
export class IcannRegistrarComponent implements OnInit {
  errorMessage: string;
  allTlds: Tld[];
  @Input() icannRegistrar: IcannRegistrar;
  constructor(private service: IcannService, private meService: MeService) { }

  ngOnInit() {
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
    this.icannRegistrar.month = this.icannRegistrar.date.getMonth() + 1;
    this.icannRegistrar.year  = this.icannRegistrar.date.getFullYear();
    delete this.icannRegistrar.date;
    this.service.submitIcannRegistrar(this.icannRegistrar)
      .then(results => this.icannRegistrar = results)
      .catch(error => {
        this.errorMessage = error;
      });
  }
}
