import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, getDocs, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-listings',
  standalone: true,
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css'],
  imports: [CommonModule, FormsModule, SidebarComponent]
})
export class ListingsComponent implements OnInit {
  listings: any[] = [];
  selectedCategory = '';
  searchQuery = '';
  currentPage = 1;
  itemsPerPage = 10;
  filteredListings: any[] = [];
  isLoading = true;
  totalPages: number = 1;
  categories = ['Electronics', 'Fashion', 'Books', 'Art & Handicrafts', 'Furniture'];

  currentEdit: any = {}; // The listing being edited

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    this.fetchListings();
  }

  async fetchListings() {
    const listingsCollection = collection(this.firestore, 'listings');
    const querySnapshot = await getDocs(listingsCollection);

    querySnapshot.docs.forEach((doc) => {
      const listing = { id: doc.id, ...doc.data() };
      this.listings.push(listing);
    });

    this.isLoading = false;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.listings.filter(listing =>
      (listing.name && listing.name.toLowerCase().includes(this.searchQuery.toLowerCase())) &&
      (!this.selectedCategory || listing.category === this.selectedCategory)
    );
    filtered.sort((a, b) => a.name.localeCompare(b.name));
    this.filteredListings = filtered.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFilters();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilters();
    }
  }

  async deleteListing(id: string) {
    const listingDoc = doc(this.firestore, 'listings', id);
    await deleteDoc(listingDoc);
    this.listings = this.listings.filter(listing => listing.id !== id);
    this.applyFilters();
  }

  // Triggered when the Edit button is clicked
  editListing(listing: any) {
    this.currentEdit = { ...listing }; // Clone the listing to avoid direct mutations
  }

  async saveChanges() {
    const listingDoc = doc(this.firestore, 'listings', this.currentEdit.id);
    await updateDoc(listingDoc, this.currentEdit);
    const index = this.listings.findIndex(listing => listing.id === this.currentEdit.id);
    if (index !== -1) {
      this.listings[index] = { ...this.currentEdit }; // Update the local list
    }
    this.currentEdit = {}; // Reset the editing state
    this.applyFilters();
  }

  cancelEdit() {
    this.currentEdit = {}; // Reset the editing state without saving
  }
}
