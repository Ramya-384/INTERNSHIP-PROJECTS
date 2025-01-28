import { Injectable } from '@angular/core';
import { Firestore, collectionData, docData, query, where, collection, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  constructor(private firestore: Firestore) {}

  getCurrentProduct(): Observable<any> {
    const productDoc = doc(this.firestore, 'listings/currentProduct');
    return docData(productDoc, { idField: 'id' });
  }

  getParticipants(currentProductId: string): Observable<any[]> {
    const participantsQuery = query(
      collection(this.firestore, 'users'),
      where('participatingIn', '==', currentProductId)
    );
    return collectionData(participantsQuery, { idField: 'id' });
  }

  async submitBid(userId: string, newPrice: number): Promise<void> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    await updateDoc(userDoc, { submittedPrice: newPrice });
  }
}