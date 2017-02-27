import { Injectable, EventEmitter } from '@angular/core';
import { Tld } from '../model/tld.model';

@Injectable()
export class TldService {

  public itemAdded$: EventEmitter<Tld>;

  constructor() {
    this.itemAdded$ = new EventEmitter();
  }
  getTlds(): Tld[] {
    return [];
  }

  createTld(tld: Tld) {
    this.itemAdded$.emit(tld);
  }
}
