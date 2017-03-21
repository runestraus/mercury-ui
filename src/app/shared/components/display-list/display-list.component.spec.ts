import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayListComponent } from './display-list.component';
import { DocQuery } from '../../testutils';

class Page {
    query: DocQuery<DisplayListComponent>;
    clickedListItem: any;
    clickedMoreListItems: any;

    constructor(private fixture: ComponentFixture<DisplayListComponent>) {
      this.query = new DocQuery(fixture);
      fixture.componentInstance.onListItemClicked.forEach(item => this.clickedListItem = item);
      fixture.componentInstance.onMoreListItemsClicked.forEach(result => this.clickedMoreListItems = result);
    }

    getListItemContent(num: number): string {
      const el = this.query.getElementByCss('#list-item-' + num);
      return el ? el.nativeElement.textContent : null;
    }

    clickListItem(num: number): void {
      this.query.getElementByCss('#list-item-' + num).nativeElement.click();
    }

    getMoreListItemsContent(): string {
      const el = this.query.getElementByCss('[data-role=more-list-items]');
      return el ? el.nativeElement.textContent : null;
    }

    clickMoreListItems(): void {
      this.query.getElementByCss('[data-role=more-list-items]').nativeElement.click();
    }

    countListItems(): number {
      return this.query.getElementsByCss('[data-role=list-item]').length;
    }

    countSeparators(): number {
      return this.query.getElementsByCss('[data-role=separator]').length;
    }
  }

describe('DisplayListComponent', () => {
  let component: DisplayListComponent;
  let fixture: ComponentFixture<DisplayListComponent>;
  let page: Page;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayListComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
  });

  it('should render a null list', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      // no list items
      expect(page.countListItems()).toBe(0);
      // no separators
      expect(page.countSeparators()).toBe(0);
      // no 'more...' link
      expect(page.getMoreListItemsContent()).toBeFalsy();
    });
  });

  it('should render an empty list', () => {
    component.listItems = [];
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      // no list items
      expect(page.countListItems()).toBe(0);
      // no separators
      expect(page.countSeparators()).toBe(0);
      // no 'more...' link
      expect(page.getMoreListItemsContent()).toBeFalsy();
    });
  });

  it('should render a single item', () => {
    component.listItems = ['foobar'];
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      // Exactly one list item
      expect(page.countListItems()).toBe(1);
      expect(page.getListItemContent(0)).toBe('foobar');
      // no separators
      expect(page.countSeparators()).toBe(0);
      // no 'more...' link
      expect(page.getMoreListItemsContent()).toBeFalsy();
    });
  });

  it('should render two items', () => {
    component.listItems = ['foo', 'bar'];
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      // Exactly two list items
      expect(page.countListItems()).toBe(2);
      expect(page.getListItemContent(0)).toBe('foo');
      expect(page.getListItemContent(1)).toBe('bar');
      // one separator
      expect(page.countSeparators()).toBe(1);
      // no 'more...' link
      expect(page.getMoreListItemsContent()).toBeFalsy();
    });
  });

  it('should render three items', () => {
    component.listItems = ['foo', 'bar', 'bazz'];
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      // Exactly two list items
      expect(page.countListItems()).toBe(3);
      expect(page.getListItemContent(0)).toBe('foo');
      expect(page.getListItemContent(1)).toBe('bar');
      expect(page.getListItemContent(2)).toBe('bazz');
      // two separators
      expect(page.countSeparators()).toBe(2);
      // no 'more...' link
      expect(page.getMoreListItemsContent()).toBeFalsy();
    });
  });

  it('should render two of four items plus more link with default max display length of 3', () => {
    component.listItems = ['foo', 'bar', 'bazz', 'bob'];
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      // Exactly two list items
      expect(page.countListItems()).toBe(2);
      expect(page.getListItemContent(0)).toBe('foo');
      expect(page.getListItemContent(1)).toBe('bar');
      // two separators
      expect(page.countSeparators()).toBe(2);
      // 2 more...
      expect(page.getMoreListItemsContent()).toBe('2 more...');
    });
  });

  it('should render four items with explicit max display length of 4', () => {
    component.listItems = ['foo', 'bar', 'bazz', 'bob'];
    component.maxListSize = 4;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      // Exactly two list items
      expect(page.countListItems()).toBe(4);
      expect(page.getListItemContent(0)).toBe('foo');
      expect(page.getListItemContent(1)).toBe('bar');
      expect(page.getListItemContent(2)).toBe('bazz');
      expect(page.getListItemContent(3)).toBe('bob');
      // three separators
      expect(page.countSeparators()).toBe(3);
      // no 'more...' link
      expect(page.getMoreListItemsContent()).toBeFalsy();
    });
  });

  it('should render two of one hundred items plus more link with default max display length of 3', () => {
    component.listItems = [];
    for (let i = 0; i < 100; i++) {
      component.listItems.push('item-' + i);
    }
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      // Exactly two list items
      expect(page.countListItems()).toBe(2);
      // two separators
      expect(page.countSeparators()).toBe(2);
      // 98 more...
      expect(page.getMoreListItemsContent()).toBe('98 more...');
    });
  });

  it('should emit onListItemClicked event when list items are clicked', async(() => {
    component.listItems = ['foo', 'bar', 'bazz'];
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.clickListItem(1);
      fixture.whenStable().then(() => {
        expect(page.clickedListItem).toBe('bar');
      });
    });
  }));

  it('should emit onMoreListItemsClicked event when more link is clicked', async(() => {
    component.listItems = ['foo', 'bar', 'bazz', 'bob'];
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.clickMoreListItems();
      fixture.whenStable().then(() => {
        expect(page.clickedMoreListItems).toEqual(['foo', 'bar', 'bazz', 'bob']);
      });
    });
  }));
});
