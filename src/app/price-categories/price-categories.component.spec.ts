import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/components/dialog/dialog';
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { By } from '@angular/platform-browser';
import { PriceCategoriesService } from '../service/price-categories.service';
import { PriceCategoriesComponent } from './price-categories.component';
import { PriceCategory } from '../model/price-category.model';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PriceCategoriesComponent', () => {

  let component: PriceCategoriesComponent;
  let fixture: ComponentFixture<PriceCategoriesComponent>;

  function getElementByCss(selector: string): DebugElement {
    return fixture.debugElement.query(By.css(selector));
  }

  const priceCategoriesService = {
    get: jasmine.createSpy('get'),
    put: jasmine.createSpy('put'),
    post: jasmine.createSpy('post'),
    delete: jasmine.createSpy('delete')
  };

  const priceCategory = {
    name: 'AA',
    price: { value: 33.00, currency: 'USD' },
    activationDate: null
  };

  const pricecategories = [{
    name: 'AA',
    price: { value: 33.00, currency: 'USD' },
    activationDate: null
  },
  {
    name: 'ZZZ',
      price: { value: 11.00, currency: 'USD' },
      comment: 'comment'
  }];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PriceCategoriesComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule, DialogModule, DataTableModule, NoopAnimationsModule],
      providers: [
        { provide: PriceCategoriesService, useValue: priceCategoriesService },
        FormBuilder,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceCategoriesComponent);
    component = fixture.componentInstance;
    component.priceCategory = {
      name: 'AA',
      price: { value: 33.00, currency: 'USD' },
      activationDate: null
    } as PriceCategory;
  });

  it('should load a list of price categories', async(() => {
    priceCategoriesService.get.and.returnValue(
      Promise.resolve(priceCategory)
    );
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(priceCategoriesService.get).toHaveBeenCalled();
    });
  }));

  it('should show a list of contacts', () => {
    expect(getElementByCss('.page-header')).toBeTruthy();
    expect(getElementByCss('.page-header').nativeElement.innerText).toEqual('Price Categories');
    expect(getElementByCss('#priceCategoriesTable')).toBeTruthy();
    expect(getElementByCss('#price')).toBeTruthy();
    expect(getElementByCss('#price').nativeElement.getAttribute('placeholder')).toEqual('1.00');
    expect(getElementByCss('button')).toBeTruthy();
    expect(getElementByCss('button').nativeElement.getAttribute('label')).toEqual('Save');
  });

  it('should open edit dialog', () => {
    priceCategoriesService.get.and.returnValue(Promise.resolve(priceCategory));
    fixture = TestBed.createComponent(PriceCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'onRowSelect');
    const selectedPriceCategory = {
      name: 'AA',
      price: { value: 33.00, currency: 'USD' },
      activationDate: null
    };
    component.createPriceCategory = false;


    component.selectedPriceCategory = selectedPriceCategory;
    component.onRowSelect(selectedPriceCategory);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.priceCategoryForm.patchValue({ name: 'AA', price: 33.00, comment: 'comment' });
      const formData = component.priceCategoryForm.value;
      expect(formData.name).toBe(priceCategory.name);
      expect(formData.price).toBe(priceCategory.price.value);
    });
  });

  it('should update a price category', async(() => {
    const updatedPriceCategory = {
      name: 'AA',
      price: { value: 44.00, currency: 'USD' },
      comment: 'comment'
    };
    priceCategoriesService.get.and.returnValue(Promise.resolve(priceCategory));
    priceCategoriesService.put.and.returnValue(Promise.resolve(updatedPriceCategory));
    fixture = TestBed.createComponent(PriceCategoriesComponent);
    component = fixture.componentInstance;
    component.deletePriceCategory = false;
    component.createPriceCategory = false;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.priceCategoryForm.patchValue({ name: 'AA', price: 44.00, comment: 'comment' });
      component.priceCategory.name = 'AA';
      component.onSubmit();
      expect(priceCategoriesService.put).toHaveBeenCalledWith('AA', updatedPriceCategory);
    });
  }));

  it('should create price category', async(() => {
    const newPriceCategory = {
      name: 'ZZZ',
      price: { value: 11.00, currency: 'USD' },
      comment: 'comment'
    };
    priceCategoriesService.get.and.returnValue(Promise.resolve(priceCategory));
    priceCategoriesService.post.and.returnValue(Promise.resolve(newPriceCategory));
    fixture = TestBed.createComponent(PriceCategoriesComponent);
    component = fixture.componentInstance;
    component.deletePriceCategory = false;
    component.createPriceCategory = true;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.priceCategoryForm.patchValue({ name: 'ZZZ', price: 11.00, comment: 'comment' });
      component.onSubmit();
      expect(priceCategoriesService.post).toHaveBeenCalledWith(newPriceCategory);
    });
  }));

  it('should delete price category', async(() => {
    const deletericeCategory = {
      name: 'ZZZ',
      price: { value: 11.00, currency: 'USD' },
      comment: 'comment'
    };
    priceCategoriesService.get.and.returnValue(Promise.resolve(pricecategories));
    priceCategoriesService.delete.and.returnValue(Promise.resolve(deletericeCategory));
    fixture = TestBed.createComponent(PriceCategoriesComponent);
    component = fixture.componentInstance;
    component.deletePriceCategory = true;
    component.createPriceCategory = false;
    component.selectedPriceCategory = deletericeCategory;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.priceCategoryForm.patchValue({ name: 'ZZZ', price: 11.00, comment: 'comment' });
      component.onSubmit();
      component.findSelectedPriceCategoryIndex();
      expect(priceCategoriesService.delete).toHaveBeenCalledWith('ZZZ');
    });
  }));
});
