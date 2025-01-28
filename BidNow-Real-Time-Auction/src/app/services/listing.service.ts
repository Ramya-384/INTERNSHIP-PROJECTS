import { Firestore, collection, addDoc, query, where, getDocs, Timestamp, collectionData, orderBy, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  firestore = inject(Firestore);

  addListing(
    name: string,
    minimumprice: number,
    category: string,
    auctioneerId: string,
    sessionDate: string,
    sessionTime: string,
    image: string
  ) {
    const listingsRef = collection(this.firestore, 'listings');
    return addDoc(listingsRef, {
      name,
      minimumprice,
      category,
      auctioneerId,
      sessionDate,
      sessionTime,
      image,
      createdAt: Timestamp.now(),
    });
  }

  getAllListings(): Observable<any[]> {
    const listingsRef = collection(this.firestore, 'listings');
    const orderedQuery = query(listingsRef, orderBy('createdAt', 'desc'));
    return collectionData(orderedQuery, { idField: 'id' });
  }

  getListingsByAuctioneer(email: string): Promise<any[]> {
    const listingsRef = collection(this.firestore, 'listings');
    const q = query(listingsRef, where('auctioneerId', '==', email), orderBy('createdAt', 'desc'));
    return getDocs(q).then((querySnapshot) => {
      const listings: any[] = [];
      querySnapshot.forEach((doc) => {
        listings.push({ id: doc.id, ...doc.data() });
      });
      return listings;
    });
  }

  getParticipantsForListing(listingId: string): Observable<any[]> {
    const usersRef = collection(this.firestore, 'users');
    const participantsQuery = query(usersRef, where('participatingIn', '==', listingId));
    return collectionData(participantsQuery, { idField: 'id' });
  }
  

updateListing(id: string, updatedData: any) {
    const listingRef = doc(this.firestore, 'listings', id);
    return updateDoc(listingRef, updatedData);
  }

  deleteListing(id: string) {
    const listingRef = doc(this.firestore, 'listings', id);
    return deleteDoc(listingRef);
  }
}