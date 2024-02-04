import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotoUploadService {

  constructor(private storage: AngularFireStorage) {}

  uploadPhoto(file: File, userId: string): Observable<any | null> {
    const path = `client-photos/${userId}/${new Date().getTime()}_${file.name}`;
    const storageRef = this.storage.ref(path);
    const uploadTask = this.storage.upload(path, file);

    return uploadTask.percentageChanges();
  }

}
