import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-list-product',
  standalone: true,
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class ListProductComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitListing = new EventEmitter<any>();

  productForm: FormGroup;
  categories = ['Electronics', 'Fashion', 'Books', 'Art & Handicrafts', 'Furniture'];
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      minimumPrice: ['', [Validators.required, Validators.min(0)]],
      productCategory: ['', Validators.required],
      sessionDate: ['', Validators.required],
      sessionTime: ['', Validators.required],
    });
  }

  onImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.submitListing.emit({
        ...this.productForm.value,
        productImage: this.imagePreview,
      });
    }
  }

  onCancel() {
    this.closeModal.emit();
  }
}