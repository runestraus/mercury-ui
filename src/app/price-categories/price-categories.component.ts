// Copyright 2017 Donuts Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PriceCategoriesService } from '../service/price-categories.service';
import 'rxjs/add/operator/toPromise';
import { PriceCategory } from '../model/price-category.model';

@Component({
  selector: 'app-price-categories',
  templateUrl: './price-categories.component.html',
  styleUrls: ['./price-categories.component.css']
})
export class PriceCategoriesComponent implements OnInit {
  priceCategoryForm: FormGroup;
  displayDialog: boolean;
  deletePriceCategory: boolean;
  disableDelete: boolean;
  priceCategory: PriceCategory = new PriceCategory();
  selectedPriceCategory: PriceCategory;
  createPriceCategory: boolean;
  pricecategories: PriceCategory[];
  error: string;
  formErrors = {
    'name': '',
    'price': ''
  };

  constructor(private fb: FormBuilder, private priceCategoriesService: PriceCategoriesService) { }

  ngOnInit() {
    this.createForm();
    this.priceCategoriesService.get()
      .then(pricecategories => {
        this.pricecategories = pricecategories;
      });
    this.disableDelete = true;
  }

  createForm() {
    this.priceCategoryForm = this.fb.group({
      name: [''],
      price: [''],
      comment: ['']
    });
  }

  /**
   * Returns a contact created from the current form model.
   */
  prepareSavePriceCategory() {
    const formModel = this.priceCategoryForm.value;
    if (formModel.name === undefined) {
      formModel.name = this.selectedPriceCategory.name;
    }
    return {
      name: formModel.name,
      price: { value: formModel.price, currency: 'USD' },
      comment: formModel.comment
    };
  }

  delete() {
    this.deletePriceCategory = true;
  }

  onRowSelect(event) {
    this.createPriceCategory = false;
    this.priceCategory = this.clonePriceCategory(event.data);
    this.disableDelete = true;
    if (this.selectedPriceCategory.activationDate === null || this.selectedPriceCategory.activationDate === undefined) {
      this.displayDialog = true;
      const price = this.priceCategory.price.value;
      const name = this.priceCategory.name;
      const comment = this.priceCategory.comment;
      this.priceCategoryForm.patchValue({
        name: name,
        price: price,
        comment: comment
      });
      const activateDeleteButton = setTimeout(() => {
        this.disableDelete = false;
      }, 3000);
    } else {
      this.priceCategory = new PriceCategory();
    }
  }

  clonePriceCategory(p: PriceCategory): PriceCategory {
    const priceCategory = this.selectedPriceCategory;
    for (const prop in p) {
      if (p.hasOwnProperty(prop)) {
        priceCategory[prop] = p[prop];
      }
    }
    return priceCategory;
  }

  showDialogToAdd() {
    this.priceCategory = new PriceCategory();
    this.createPriceCategory = true;
    this.deletePriceCategory = false;
    this.displayDialog = true;
    this.priceCategoryForm.patchValue({
      name: null,
      price: null,
      comment: null
    });
  }

  cancelDialog() {
    this.priceCategory = new PriceCategory();
    this.displayDialog = false;
    this.error = null;
  }

  onSubmit() {
    const priceCategoryCreated = this.prepareSavePriceCategory();
    if (this.createPriceCategory) {
      this.priceCategoriesService.post(priceCategoryCreated)
        .then(() => {
          this.pricecategories.push(priceCategoryCreated);
        })
        .catch(error => {
          this.displayDialog = true;
          this.error = error;
        });
    } else if (this.deletePriceCategory) {
      this.priceCategoriesService.delete(priceCategoryCreated.name)
        .then(() => {
          this.pricecategories.splice(this.findSelectedPriceCategoryIndex(), 1);
        });
    } else {
      this.priceCategoriesService.put(this.priceCategory.name, priceCategoryCreated)
        .then(() => {
          this.pricecategories[this.findSelectedPriceCategoryIndex()] = priceCategoryCreated;
        })
        .catch(error => {
          this.displayDialog = true;
          this.error = error;
        });
    }
    this.displayDialog = false;
  }

  findSelectedPriceCategoryIndex(): number {
    return this.pricecategories.indexOf(this.selectedPriceCategory);
  }
}
