import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, Chart, registerables } from 'chart.js';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ListingService } from '../../services/listing.service';
import { BaseChartDirective } from 'ng2-charts';

Chart.register(...registerables);
@Component({
  selector: 'app-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [ SidebarComponent, BaseChartDirective],
  standalone:true,
})
export class AdminDashboardComponent implements OnInit {
  
  public pieChartOptions: ChartOptions = { responsive: true };
  public pieChartLabels: string[] = [];
  public pieChartData: any[] = [{ data: [] }];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;

  public lineChartOptions: ChartOptions = { responsive: true };
  public lineChartLabels: string[] = [];
  public lineChartData: any[] = [{ data: [], label: 'Minimum Prices' }];
  public lineChartType: ChartType = 'line';
  public lineChartLegend = true;

  public doughnutChartOptions: ChartOptions = { responsive: true };
  public doughnutChartLabels: string[] = [];
  public doughnutChartData: any[] = [{ data: [] }];
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartLegend = true;

  public activeBarChartOptions: ChartOptions = { responsive: true };
  public activeBarChartLabels: string[] = [];
  public activeBarChartData: any[] = [{ data: [], label: 'Active Listings' }];
  public activeBarChartType: ChartType = 'bar';
  public activeBarChartLegend = true;

  constructor(private listingService: ListingService) {}

  ngOnInit(): void {
    this.loadCategoryDistribution();
    this.loadMinimumPriceTrends();
    this.loadAuctioneerContributions();
    this.loadActiveListings();
  }

  loadCategoryDistribution(): void {
    this.listingService.getAllListings().subscribe((listings) => {
      console.log('Listings:', listings);
      const categories: { [key: string]: number } = {};
      listings.forEach((listing) => {
        categories[listing.category] = (categories[listing.category] || 0) + 1;
      });
      this.pieChartLabels = Object.keys(categories);
      this.pieChartData = [{ data: Object.values(categories) }];
      console.log('Pie Chart Data:', this.pieChartData);
    });
  }

  loadMinimumPriceTrends(): void {
    this.listingService.getAllListings().subscribe((listings) => {
      const categories: { [key: string]: number[] } = {};
      listings.forEach((listing) => {
        if (!categories[listing.category]) {
          categories[listing.category] = [];
        }
        categories[listing.category].push(listing.minimumprice);
      });
      this.lineChartLabels = Object.keys(categories);
      this.lineChartData[0].data = this.lineChartLabels.map((cat) =>
        categories[cat].reduce((sum, price) => sum + price, 0) / categories[cat].length
      );
    });
  }

  loadAuctioneerContributions(): void {
    this.listingService.getAllListings().subscribe((listings) => {
      const auctioneers: { [key: string]: number } = {};
      listings.forEach((listing) => {
        auctioneers[listing.auctioneerId] = (auctioneers[listing.auctioneerId] || 0) + 1;
      });
      this.doughnutChartLabels = Object.keys(auctioneers);
      this.doughnutChartData = [{ data: Object.values(auctioneers) }];
    });
  }

  loadActiveListings(): void {
    this.listingService.getAllListings().subscribe((listings) => {
      const statuses: { [key: string]: number } = {};
      listings.forEach((listing) => {
        const status = listing.isActive ? 'Active' : 'Inactive';
        statuses[status] = (statuses[status] || 0) + 1;
      });
      this.activeBarChartLabels = Object.keys(statuses);
      this.activeBarChartData[0].data = Object.values(statuses);
    });
  }
}