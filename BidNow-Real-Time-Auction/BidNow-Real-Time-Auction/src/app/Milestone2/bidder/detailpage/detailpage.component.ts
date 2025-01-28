import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DetailsService } from '../../services/details.service';

@Component({
  selector: 'app-detailpage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detailpage.component.html',
  styleUrls: ['./detailpage.component.css'],
})
export class DetailpageComponent implements OnInit {
  product: any = null;

  constructor(
    private route: ActivatedRoute,
    private detailsService: DetailsService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.detailsService.getProductById(productId).subscribe((product) => {
        this.product = product;
      });
    }
  }
}