import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-display-list',
  templateUrl: './display-list.component.html',
  styleUrls: ['./display-list.component.css']
})
export class DisplayListComponent implements OnInit {

  @Output() onListItemClicked = new EventEmitter<any>();
  @Output() onMoreListItemsClicked = new EventEmitter<any>();
  @Input() listItems: Array<any>;
  @Input() separator = '|';
  @Input() maxListSize = 3;

  displayedItems: Array<any> = [];
  moreListItems = 0;

  constructor() { }

  ngOnInit() {
    if (this.listItems == null) {
      return;
    }
    const overflow = this.listItems.length > this.maxListSize;
    for (const listItem of this.listItems) {
      if (overflow && this.displayedItems.length >= this.maxListSize - 1) {
        break;
      }
      this.displayedItems.push(listItem);
    }
    this.moreListItems = this.listItems.length - this.displayedItems.length;
  }

  onClickListItem(listItem: any) {
    this.onListItemClicked.emit(listItem);
  }

  onClickMoreListItems() {
    this.onMoreListItemsClicked.emit(this.listItems);
  }
}
