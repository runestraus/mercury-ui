import {Component} from "@angular/core";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TldService} from "../../service/tld.service";
import {Tld} from "../../model/tld.model";

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
    <button type="button" class="close" (click)="activeModal.close('Cancel Click')" aria-hidden="true">&times;</button>
    <h4 class="modal-title">Create New TLD</h4>
  </div>
  <form  #tldForm="ngForm" (ngSubmit)="onSubmit()">
    <div class="modal-body" data-ng-show="ctrl.showform">
      <div class="form-group">
        <label>TLD Name*:</label>
        <input id="tld-name" type="text" autofocus placeholder="Name" class="form-control" [(ngModel)]="tld.name"
               minlength="2" maxlength="63" name="name" required/>
        <!--<p id="tld-name-error" class="help-block" data-ng-if="ctrl.errors.name">{{ ctrl.errors.name}}</p>-->
      </div>
      <div class="form-group">
        <label>Create*:</label>
        <div class="input-group">
          <span class="input-group-addon">USD</span>
          <input id="tld-create-price" type="number" class="form-control" placeholder="1.00" required
                 [(ngModel)]="tld.createBillingCost" min="1" max="100000000" step="0.01" name="createBillingCost"/>
        </div>
        <!--<p class="help-block" data-ng-if="ctrl.errors.createBillingCost">{{ ctrl.errors.createBillingCost}}</p>-->
      </div>
      <div class="form-group" data-ng-class="{'has-error': ctrl.errors.restoreBillingCost}">
        <label>Restore*:</label>
        <div class="input-group">
          <span class="input-group-addon">USD</span>
          <input id="tld-restore-price" type="number" class="form-control" placeholder="1.00" required
                 [(ngModel)]="tld.restoreBillingCost" min="1" max="100000000" step="0.01" name="restoreBillingCost"/>
        </div>
        <!--<p class="help-block" data-ng-if="ctrl.errors.restoreBillingCost">{{ ctrl.errors.restoreBillingCost}}</p>-->
      </div>
    </div>
    <div id="tld-create-footer" class="modal-footer">
      <button type="button" class="btn btn-default" (click)="activeModal.close('Cancel Click')">Cancel</button>
      <button type="submit" class="btn btn-primary" [disabled]="!tldForm.form.valid">Create</button>
    </div>
  </form>
  `
})
export class TldsCreateContent {
  tld: Tld;

  constructor(public activeModal: NgbActiveModal,
              private tldService: TldService) {
    this.tld = new Tld();
  }

  onSubmit() {
    this.tldService.createTld(this.tld);
    this.activeModal.close()
  }
}

@Component({
  selector: 'app-tlds-create',
  templateUrl: './tlds-create.component.html',
  styleUrls: ['./tlds-create.component.css']
})
export class TldsCreateComponent {
  constructor(private modalService: NgbModal) { }

  openCreateModal() {
    this.modalService.open(TldsCreateContent);
  }
}
