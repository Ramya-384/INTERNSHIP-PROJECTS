import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Firestore, collection, doc, getDoc, setDoc, onSnapshot } from '@angular/fire/firestore';
import { DetailpageComponent } from '../../detailpage/detailpage.component';

@Component({
  selector: 'app-bidpage',
  standalone: true,
  templateUrl: './bidpage.component.html',
  styleUrls: ['./bidpage.component.css'],
  imports: [CommonModule, FormsModule, DetailpageComponent],
})
export class BidpageComponent implements OnInit, OnDestroy {
  listingId: string = '';
  listingDetails: any = null;
  currentUser: any = null;
  bidAmount: number | null = null;
  currentBids: any[] = [];
  timer: string = '01:00:00';
  private timerInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.listingId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Bidding for Listing ID:', this.listingId);

    if (!this.listingId) {
      alert('Invalid listing.');
      this.router.navigate(['/homepage']);
      return;
    }

    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        console.log('Current User:', user);
        if (!user) {
          alert('You must be logged in to participate in bidding.');
          this.router.navigate(['/login']);
          return;
        }
        this.currentUser = user;
        this.loadListingDetails();
        this.listenToBids();
      },
      error: (err) => console.error('Error fetching user:', err),
    });
  }

  isSessionOngoing(): boolean {
    return this.timer !== 'Session has not started yet.' && this.timer !== 'Session has ended.';
  }  

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private loadListingDetails(): void {
    const listingDoc = doc(this.firestore, `listings/${this.listingId}`);
    getDoc(listingDoc)
      .then((snapshot) => {
        if (snapshot.exists()) {
          this.listingDetails = snapshot.data();
          console.log('Listing Details:', this.listingDetails);
  
          const { sessionDate, sessionTime } = this.listingDetails;
          this.startTimer(sessionTime, sessionDate);
        } else {
          alert('Listing not found.');
          this.router.navigate(['/homepage']);
        }
      })
      .catch((err) => console.error('Error fetching listing:', err));
  }  

  private startTimer(sessionTime: string, sessionDate: string): void {
    if (!sessionTime || !sessionDate) {
      console.error('Session date or time is not provided.');
      this.timer = '00:00:00';
      return;
    }
  
    const [year, month, day] = sessionDate.split('-').map(Number);
    const [hour, minute] = sessionTime.split(':').map(Number);
  
    if (
      isNaN(year) || isNaN(month) || isNaN(day) ||
      isNaN(hour) || isNaN(minute)
    ) {
      console.error('Invalid session date or time format:', sessionDate, sessionTime);
      this.timer = '00:00:00';
      return;
    }
  
    const sessionStartTime = new Date(year, month - 1, day, hour, minute).getTime();
    const sessionEndTime = sessionStartTime + 60 * 60 * 1000;
  
    if (isNaN(sessionStartTime)) {
      console.error('Failed to calculate session start time.');
      this.timer = '00:00:00';
      return;
    }
  
    this.timerInterval = setInterval(() => {
      const currentTime = Date.now();
  
      if (currentTime < sessionStartTime) {
        this.timer = 'Session has not started yet.';
        return;
      }
  
      if (currentTime > sessionEndTime) {
        this.timer = 'Session has ended.';
        clearInterval(this.timerInterval);
        return;
      }
  
      const timeRemaining = sessionEndTime - currentTime;
  
      const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
      const seconds = Math.floor((timeRemaining / 1000) % 60);
  
      this.timer = `${this.formatTime(hours)}:${this.formatTime(minutes)}:${this.formatTime(seconds)}`;
    }, 1000);
  }  
  
  

  private formatTime(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  private listenToBids(): void {
    const bidsCollection = collection(this.firestore, `listings/${this.listingId}/bids`);
    onSnapshot(bidsCollection, (snapshot) => {
      this.currentBids = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log('Real-Time Bids:', this.currentBids);
    });
  }

  submitBid(): void {
    if (!this.currentUser) {
      alert('You must be logged in to place a bid.');
      return;
    }

    if (!this.bidAmount || this.bidAmount <= 0) {
      alert('Please enter a valid bid amount.');
      return;
    }

    const bidRef = doc(this.firestore, `listings/${this.listingId}/bids/${this.currentUser.email}`);
    setDoc(bidRef, {
      bidder: this.currentUser.username,
      email: this.currentUser.email,
      amount: this.bidAmount,
      timestamp: new Date(),
    })
      .then(() => {
        console.log('Bid submitted successfully.');
        alert('Your bid has been submitted!');
      })
      .catch((err) => console.error('Error submitting bid:', err));
  }
}