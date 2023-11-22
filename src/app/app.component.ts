import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {LocalStorageManagerService} from "@local-storage-manager";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="login-form">
        <div class="card">
          <h2 class="card-header">Login</h2>
          <div class="card-body">
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label class="form-label">Username</label>
                <input type="text" formControlName="username" class="form-control" />
              </div>
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" formControlName="password" class="form-control" />
              </div>
              <div>
                <button class="btn btn-primary">
                  <span class=" me-1"></span>
                  Login
                </button>
              </div>
            </form>
            <button class="btn btn-danger" (click)="deleteItem()">
              <span class="me-1"></span>
              Delete User
            </button>
          </div>
        </div>
      </div>
      <div class="card mt-2">
        <h2 class="card-header">USER</h2>
        <h3 class="m-2 p-2 text-primary">{{user.username}}</h3>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class AppComponent implements OnInit {
  title = 'custom-lsm-demo';
  form!: FormGroup;
  user: any;
  constructor(
    private readonly toastr: ToastrService,
    private readonly formBuilder: FormBuilder,
    private readonly storageService: LocalStorageManagerService) {
  }
  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.getUser();
    if(this.user.username === undefined){
      this.toastr.warning("It seems local storage data has changed or is deleted")
    }
  }

  get f() { return this.form.controls; }

  getUser(){
    this.user = this.storageService.getItem('user2', 'sessionStorage');
  }
  onSubmit() {
    let credentials = {username: this.f["username"].value}
    console.log(credentials)
    this.storageService.saveItem(credentials, 'user2', 'sessionStorage');
    this.toastr.success("Record Saved successfully")
    this.getUser();
  }

  deleteItem() {
    this.storageService.deleteAll('sessionStorage');
    this.getUser();
  }

  showSuccess(message?: string) {
    this.toastr.success(message, 'Message');
  }

  showWarning(message?: string) {
    this.toastr.warning(message, 'Message');
  }

  showError(message?: string) {
    this.toastr.error(message, 'Message');
  }
}
