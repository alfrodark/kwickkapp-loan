import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AuthService } from '../auth/auth.service';
import { Observable, finalize, map } from 'rxjs';
import { Client } from '../models/client.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private clientsCollection: AngularFirestoreCollection<Client>;

  user$!: Observable<any>;
  currentUserUid!: string;
  clients: Observable<{ id: string; userId?: string | undefined; name: string; email: string;
    phone?: string | undefined; address?: string | undefined; city?: string | undefined;
    photoUrl?: string | undefined;}[]>;

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage,
    private authService: AuthService
    ) {
       this.clientsCollection = this.firestore.collection('clients');
       this.clients = this.clientsCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Client;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );

      // Subscribe to authentication changes to get the current user's UID
      this.afAuth.authState.subscribe((user) => {
        if (user) {
          this.currentUserUid = user.uid;
        }
      });
  }

  getClient(clientId: string): Observable<Client> {
    return this.firestore
      .doc<Client>(`clients/${clientId}`)
      .valueChanges()
      .pipe(
        map((client) => {
          return client as Client;
        })
      );
  }

  getClientById(clientId: string): Observable<Client | undefined> {
    return this.clients.pipe(
      map(clients => clients.find(client => client.id === clientId))
    );
  }

  getClients(): Observable<Client[]> {
    return this.clients.pipe(
      map(clients => clients.filter(client => client.userId === this.currentUserUid))
    );
  }

  addClient(client: Client): Promise<void> {
    // Add the current user's UID to the client data
    const clientWithUserId: Client = { ...client, userId: this.currentUserUid };

    return this.clientsCollection.add(clientWithUserId)
      .then(() => alert('Client added successfully'))
      .catch(error => alert(error));
  }

  updateClient(clientId: string, newData: Client): Promise<void> {
    return this.clientsCollection.doc(clientId).update(newData)
      .then(() => alert('Client updated successfully'))
      .catch(error => alert(error));
  }

  updateClientPhoto(clientId: string, photoUrl: string): Promise<void> {
    return this.clientsCollection.doc(clientId).update({ photoUrl });
  }

  deleteClient(clientId: string): Promise<void> {
    return this.clientsCollection.doc(clientId).delete()
      .then(() => alert('Client deleted successfully'))
      .catch(error => alert(error));
  }

  uploadPhoto(file: File): Observable<any> {
    const filePath = `client-photos/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);

    return uploadTask.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {

          alert(`File available at: ${url}`);
        });
      })
    );
  }

}
