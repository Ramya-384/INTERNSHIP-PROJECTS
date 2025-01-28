import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListProductComponent } from '../list-product/list-product.component';
import { AuthService } from '../../../services/auth.service';
import { ListingService } from '../../../services/listing.service';

@Component({
  selector: 'app-auctioneerdashboard',
  standalone: true,
  templateUrl: './auctioneerdashboard.component.html',
  styleUrls: ['./auctioneerdashboard.component.css'],
  imports: [CommonModule, FormsModule, ListProductComponent],
})
export class AuctioneerdashboardComponent implements OnInit {
  isEditListingModalOpen = false;
  editData: any = null;
  isAddListingModalOpen = false;
  isPreviewListingModalOpen = false;
  previewData: any = null;
  searchQuery: string = '';
  username: string = '';
  email: string = '';
  role: string = '';
  allProducts: any[] = [];
  products: any[] = [];
  categories = ['Electronics', 'Fashion', 'Books', 'Art & Handicrafts', 'Furniture'];

  constructor(
    private router: Router,
    private authService: AuthService,
    private listingService: ListingService
  ) {}

  ngOnInit() {
  this.authService.getCurrentUser().subscribe((user) => {
    if (user && user.role === 'Auctioneer') {
      this.username = user.username || 'User';
      this.email = user.email || 'No Email';
      this.role = user.role || 'No Role';

      this.listingService
        .getListingsByAuctioneer(this.email)
        .then((listings) => {
          this.allProducts = listings;
          this.products = [...this.allProducts];
        })
        .catch((error) => console.error('Error fetching auctioneer listings:', error));
    }
  });
}

  activeCategory: string = 'all';

  filterProducts(category: string) {
    this.activeCategory = category;
    if (category === 'all') {
      this.products = [...this.allProducts];
    } else {
      this.products = this.allProducts.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
    }
  }  
  
  openAddListingModal() {
    this.isAddListingModalOpen = true;
    this.isPreviewListingModalOpen = false;
  }

  closeAddListingModal() {
    this.isAddListingModalOpen = false;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed', error);
      },
    });
  }

  getAuctioneerId(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.submitListing(user);
      } else {
        console.error('No auctioneer logged in or role mismatch');
      }
    });
  }

  searchProducts() {
    if (!this.searchQuery.trim()) return this.products;
    return this.products.filter((product) =>
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  submitListing(listingData: any) {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user && user.email) {
        const auctioneerId = user.email;
        const {
          productName,
          minimumPrice,
          productCategory,
          sessionDate,
          sessionTime,
          productImage,
        } = listingData;
        this.listingService
          .addListing(
            productName,
            minimumPrice,
            productCategory,
            auctioneerId,
            sessionDate,
            sessionTime,
            productImage
          )
          .then(() => {
            console.log('Listing added successfully');
            this.closeAddListingModal();
            location.reload();
          })
          .catch((error) => {
            console.error('Error adding listing:', error);
          });
      } else {
        console.error('Auctioneer not logged in or missing email in user data');
      }
    });
  }

  navigateToDetails(productId: string): void {
    this.router.navigate(['/details', productId]);
  }
  

  openEditListingModal(product: any) {
    this.isEditListingModalOpen = true;
    this.editData = { ...product };
  }
  
  onEditImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
  
      reader.onload = () => {
        if (reader.result) {
          this.editData.productImage = reader.result.toString();
        }
      };
  
      reader.readAsDataURL(file);
    }
  }
  
  submitEditListing(updatedData: any) {
    if (!this.editData.id) {
      console.error('Cannot update listing: Missing id');
      return;
    }
  
    const formattedData = {
      name: updatedData.productName,
      minimumprice: updatedData.minimumPrice,
      category: updatedData.productCategory,
      sessionDate: updatedData.sessionDate,
      sessionTime: updatedData.sessionTime,
      image: this.editData.productImage,
    };
  
    this.listingService.updateListing(this.editData.id, formattedData).then(() => {
      console.log('Listing updated successfully');
      this.closeEditListingModal();
      location.reload();
  
      this.allProducts = this.allProducts.map((product) =>
        product.id === this.editData.id ? { ...formattedData, id: product.id } : product
      );
      this.products = [...this.allProducts];
    }).catch((error) => {
      console.error('Error updating listing:', error);
    });
  }
  
  
  closeEditListingModal() {
    this.isEditListingModalOpen = false;
    this.editData = null;
  }
  
  deleteListing(listingId: string) {
    if (confirm('Are you sure you want to delete this listing?')) {
      this.listingService.deleteListing(listingId).then(() => {
        console.log('Listing deleted successfully');
        this.allProducts = this.allProducts.filter(product => product.id !== listingId);
        this.products = this.products.filter(product => product.id !== listingId);
      }).catch(error => {
        console.error('Error deleting listing:', error);
      });
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('Selected file:', file);
    }
  }
}