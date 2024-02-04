import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(
    private storage: AngularFireStorage
    ) {}

  uploadFile(file: File, path: string): Promise<string> {
    const randomId = Math.random().toString(36).substring(2);
    const filePath = `${path}/${randomId}_${file.name}`;
    const ref = this.storage.ref(filePath);
    const task = ref.put(file);

    return new Promise((resolve, reject) => {
      task.then(() => ref.getDownloadURL().subscribe(url => resolve(url)))
        .catch(error => reject(error));
    });
  }
}
