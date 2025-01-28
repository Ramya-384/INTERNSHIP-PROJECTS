import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DetailsService {
  constructor(private firestore: Firestore) {}

  getProductById(id: string): Observable<any> {
    const docRef = doc(this.firestore, 'listings', id);
    return from(getDoc(docRef).then((docSnap) => docSnap.data()));
  }
}