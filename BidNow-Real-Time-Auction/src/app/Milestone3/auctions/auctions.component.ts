import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, getDocs, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-auctions',
  standalone: true,
  templateUrl: './auctions.component.html',
  styleUrls: ['./auctions.component.css'],
  imports: [CommonModule, FormsModule, SidebarComponent]
})
export class AuctionsComponent implements OnInit {
  auctions: any[] = [];
  filteredAuctions: any[] = [];
  searchQuery = '';
  selectedCategory = '';
  categories = ['Electronics', 'Fashion', 'Books', 'Art & Handicrafts', 'Furniture'];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  isLoading = true;

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    this.fetchAuctions();
  }

  async fetchAuctions() {
    const auctionsCollection = collection(this.firestore, 'listings');
    const auctionsSnapshot = await getDocs(auctionsCollection);

    auctionsSnapshot.docs.forEach((doc) => {
      const auction = { id: doc.id, ...doc.data() };
      this.auctions.push(auction);
    });

    this.isLoading = false;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.auctions.filter(listing =>
      (listing.name && listing.name.toLowerCase().includes(this.searchQuery.toLowerCase())) && (!this.selectedCategory || listing.category === this.selectedCategory)
    );
    filtered.sort((a, b) => a.name.localeCompare(b.name));
    this.filteredAuctions = filtered.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
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

  async saveAuction(auction: any) {
    const auctionDoc = doc(this.firestore, 'listings', auction.id);
    await updateDoc(auctionDoc, {
      name: auction.name,
      category: auction.category,
      minimumprice: auction.minimumprice,
      sessionDate: auction.sessionDate,
      sessionTime: auction.sessionTime,
      auctioneerId: auction.auctioneerId
    });
    auction.isEditing = false;
  }

  cancelEdit(auction: any) {
    auction.isEditing = false;
    // Revert changes to the original data
    auction.name = auction.originalData.name;
    auction.category = auction.originalData.category;
    auction.minimumprice = auction.originalData.minimumprice;
    auction.sessionDate = auction.originalData.sessionDate;
    auction.sessionTime = auction.originalData.sessionTime;
    auction.auctioneerId = auction.originalData.auctioneerId;
  }

  editAuction(auction: any) {
    auction.isEditing = true;
    auction.originalData = { ...auction }; // Store original data for canceling
  }

  async deleteAuction(auctionId: string) {
    const auctionDoc = doc(this.firestore, 'listings', auctionId);
    await deleteDoc(auctionDoc);
    this.auctions = this.auctions.filter(auction => auction.id !== auctionId);
    this.applyFilters(); // Reapply filters to reflect the updated list
  }
}
