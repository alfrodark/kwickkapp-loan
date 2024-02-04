import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, finalize, switchMap } from 'rxjs';
import { ClientService } from '../../services/client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { PhotoUploadService } from '../../services/photo-upload.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-update',
  templateUrl: './client-update.component.html',
  styleUrl: './client-update.component.css'
})
export class ClientUpdateComponent implements OnInit {

 updateClientForm: FormGroup | any = null;
  clientId!: string | any;
  client!: Observable<Client> | any;
  selectedFile: File | any = null;
  currentUser: any;
  imageUrl!: string | ArrayBuffer | any;
  photoUrl!: string;

  uploadPercent!: number;
  downloadURL!: string;


  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private storage: AngularFireStorage,
    private photoUploadService: PhotoUploadService,
    private snackBar: MatSnackBar
  )
  {
    this.updateClientForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: [''],
      city: [''],
      photoUrl: [''],
    });
  }

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('clientId');
    this.createForm();
    this.loadClientData();

    this.clientId = this.route.snapshot.paramMap.get('clientId');
    this.clientService.getClientById(this.clientId).subscribe((client: any) => {
      if (client) {
        this.client = client;
        this.updateClientForm.patchValue(client);
      }
    });

    this.authService.getCurrentUser().subscribe((user: any) => {
      this.currentUser = user;
    });

    this.client = this.route.paramMap.pipe(
      switchMap(params => {
        this.clientId = params.get('clientId');
        return this.clientService.getClientById(this.clientId);
      })
    );

    this.client.subscribe((client: any) => {
      this.updateClientForm.patchValue(client);
    });


  }

  createForm(): void {
    this.updateClientForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: [''],
      city: [''],
      photoUrl: [''],
    });
  }

  loadClientData(): void {
    if (this.clientId) {
      this.clientService.getClients().subscribe(clients => {
        const client = clients.find(c => c.clientId === this.clientId);
        this.updateClientForm.patchValue(client);
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    const filePath = `client-photos/${this.clientId}/${Date.now()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.percentageChanges().subscribe((percent: number| any) => {
      this.uploadPercent = percent;
    });

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url: string) => {
          this.downloadURL = url;
          this.updateClientForm.patchValue({ photoUrl: url });
        });
      })
    ).subscribe();
  }

  uploadPhoto(clientId: string): void {

    const file = this.updateClientForm.get('photo').value;
    const path = `client-photos/${this.clientId}/${Date.now()}_${this.selectedFile.name}`;
    const ref = this.storage.ref(path);
    const task = ref.put(file);


    task.then((snapshot) => {
      snapshot.ref.getDownloadURL().then((downloadURL) => {
        this.clientService.updateClientPhoto(clientId, downloadURL);
      });
    });

  }

  onSubmit(): void {

    const formData = this.updateClientForm.value;
    if (this.clientId) {
      this.clientService.updateClient(this.clientId, formData);
      console.log('Client updated successfully!');
      this.router.navigate(['/clients']);
    } else {
      this.clientService.addClient(formData);
      console.log('Client created successfully!');
      this.router.navigate(['/clients']);
    }
  }

}
