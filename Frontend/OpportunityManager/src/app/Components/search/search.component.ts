import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchTerm: string = '';
  // when toggleSearch==fasle then show clearResults button else show search button
  toggleSearch : boolean = true; 
  @Output() searchEvent = new EventEmitter<string>();

  onSearch() {
    if(this.searchTerm.trim())
    {
      this.searchEvent.emit(this.searchTerm.trim());
      this.toggleSearch = !this.toggleSearch;
    }
  }

  clearResults()
  {
    this.searchTerm="";
    this.searchEvent.emit(this.searchTerm.trim());
    this.toggleSearch = !this.toggleSearch;
  }
}
