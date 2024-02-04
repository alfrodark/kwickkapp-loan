import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, finalize } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css'
})
export class ClientFormComponent implements OnInit {

  clientForm: FormGroup | any = null;
  clientId!: string | any;
  client!: Observable<Client>;

  addClientForm: FormGroup | any = null;
  imageUrl!: string | ArrayBuffer | any;
  uploadPercent!: number;


  constructor(private fb: FormBuilder,
    private clientService: ClientService,
    private storage: AngularFireStorage,
    private router: Router) {
    this.addClientForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: [''],
      city: [''],
      photoUrl: [null],
    });
  }

  ngOnInit(): void {

  }

  onSubmit() {
    if (this.addClientForm.valid) {
      const newClient = this.addClientForm.value;
      this.clientService.addClient(newClient)
        .then(() => {
          this.router.navigate(['/clients']);
        })
        .catch(error => {
          alert(error);
        });
    }
  }

  onFileSelected(event: any) {
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
          this.imageUrl = url;
          this.addClientForm.patchValue({ photoUrl: url });
        });
      })
    ).subscribe();

  }


}
