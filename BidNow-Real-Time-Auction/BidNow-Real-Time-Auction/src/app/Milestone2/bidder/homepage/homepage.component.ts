import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ListingService } from '../../../services/listing.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  imports: [CommonModule, FormsModule],
})
export class HomepageComponent implements OnInit {
  username: string = '';
  email: string = '';
  role: string = '';
  searchQuery: string = '';
  activeCategory: string = 'all';
  products: any[] = [];
  allProducts: any[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private listingService: ListingService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.username = user?.username || 'User';
        this.email = user?.email || 'No Email';
        this.role = user?.role || 'No Role';
  
        this.listingService.getAllListings().subscribe({
          next: (listings) => {
            this.allProducts = listings || [];
            this.products = [...this.allProducts];
          },
          error: (err) => {
            console.error('Error fetching listings:', err);
          },
        });
      },
      error: (err) => {
        console.error('Error fetching user:', err);
      },
    });
  }  

  filterProducts(category: string): void {
    this.activeCategory = category;
    this.products = category === 'all'
      ? [...this.allProducts]
      : this.allProducts.filter(
          (product) => product.category.toLowerCase() === category.toLowerCase()
        );
  }

  searchProducts(): void {
    const query = this.searchQuery.toLowerCase();
    this.products = this.allProducts.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
  }

  navigateToDetails(productId: string): void {
    this.router.navigate(['/details', productId]);
  }

  navigateToBidSession(productId: string): void {
    this.router.navigate(['/bidpage', productId]);
  }

  logout(): void {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }
}