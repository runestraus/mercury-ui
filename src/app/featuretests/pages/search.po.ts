import { DocQuery } from '../../shared/testutils';
import {
  tick, ComponentFixture
} from '@angular/core/testing';
import { AppComponent } from '../../app.component';
import { DebugElement } from '@angular/core';

export class SearchPage {
  query: DocQuery<AppComponent>;

  constructor(
      private fixture: ComponentFixture<AppComponent>) {
    this.query = new DocQuery(fixture);
  }

  private getElementByCss(selector: string): DebugElement {
    const el = this.query.getElementByCss(selector);
    expect(el).toBeTruthy();
    return el;
  }

  /** Enter text in the search box and click search button */
  searchFor(itemName: string) {
    const searchInput = this.getElementByCss('#searchTermInput').nativeElement;
    searchInput.value = itemName;
    searchInput.dispatchEvent(new Event('input'));
    tick();
    const searchButton = this.getElementByCss('#searchButton').nativeElement;
    searchButton.click();
    tick();
    this.fixture.detectChanges();
    tick();
    this.fixture.detectChanges();
  }

  /** Gets an array of header names from search results table */
  private getSearchHeaderNames(): Array<string> {
    // these <span> elements are nested inside of the <th> elements of the table
    const columns = this.query.getElementsByCss('span.ui-column-title');
    return columns.map(column => column.nativeElement.textContent.trim());
  }

  /** converts html search results into an array of row objects */
  getSearchResultData(): Array<{[key: string]: string}> {
    const headerNames = this.getSearchHeaderNames();
    const rows = this.query.getElementsByCss('tr.ui-widget-content');
    // convert <tr> elements to row objects
    return rows.map(row => {
      // collapse <td> elements into row object
      return row.children.filter(child => child.name === 'td')
        .reduce((result, cell) => {
          // Contents of <td>
          const cellData = cell.nativeElement.textContent.trim();
          // use the current index in the row to look up the header name
          const index = Object.keys(result).length;
          const headerName = headerNames[index];
          // Set the cell value in the row using header name as the key
          result[headerName] = cellData;
          return result;
        }, {});
    });
  }

  /** Clicks on the search result specified by row index */
  clickSearchResult(index: number): void {
    const links = this.query.getElementsByCss('span.ui-cell-data a');
    expect(links.length).toBeGreaterThanOrEqual(index);
    links[index].nativeElement.click();
    tick();
    this.fixture.detectChanges();
  }
}
