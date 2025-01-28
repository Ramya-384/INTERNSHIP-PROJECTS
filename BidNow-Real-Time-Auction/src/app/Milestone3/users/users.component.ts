import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, getDocs, doc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  imports: [CommonModule, FormsModule, SidebarComponent]
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  searchQuery = '';
  selectedRole = '';
  currentPage = 1;
  itemsPerPage = 15;
  filteredUsers: any[] = [];
  isLoading = true;
  totalPages: number = 1;

  constructor(@Inject(DOCUMENT) private doc: Document, private firestore: Firestore) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  async fetchUsers() {
    const usersCollection = collection(this.firestore, 'users');
    const q = query(usersCollection, where('role', '!=', 'Admin'));
    const querySnapshot = await getDocs(q);
    this.users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      username: doc.data()?.['username'] || '',
      email: doc.data()?.['email'] || '',
      role: doc.data()?.['role'] || ''
    }));
    this.isLoading = false;
    this.applyFilters();
  }
  
  applyFilters() {
    let filtered = this.users.filter(user => 
      ((user.username?.toLowerCase() || '').includes(this.searchQuery.toLowerCase()) || 
      (user.email?.toLowerCase() || '').includes(this.searchQuery.toLowerCase())) &&
      (!this.selectedRole || user.role === this.selectedRole)
    );
    filtered.sort((a, b) => (a.username || '').localeCompare(b.username || ''));
  
    this.filteredUsers = filtered.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
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

  editUser(user: any) {
    user.isEditing = true;
    user.originalData = { ...user };
  }

  async saveUser(user: any) {
    const userDoc = doc(this.firestore, 'users', user.id);
    await updateDoc(userDoc, {
      username: user.username,
      email: user.email,
      role: user.role
    });
    user.isEditing = false;
  }

  cancelEdit(user: any) {
    user.isEditing = false;
    user.username = user.originalData.username;
    user.email = user.originalData.email;
    user.role = user.originalData.role;
  }

  async deleteUser(userId: string) {
    const userDoc = doc(this.firestore, 'users', userId);
    await deleteDoc(userDoc);
    this.users = this.users.filter(user => user.id !== userId);
    this.applyFilters();
  }
}