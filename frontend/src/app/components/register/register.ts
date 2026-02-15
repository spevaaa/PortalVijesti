import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  userData = {
    username: '',
    email: '',
    password: ''
  };
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private api: ApiService, private router: Router) {}

  onRegister(form: NgForm) {
  if (form.invalid) {
    this.errorMessage = 'Molimo ispravno popunite sva polja.';
    return;
  }

  this.api.register(this.userData).subscribe({
    next: (res) => {
      this.successMessage = 'Račun uspješno izrađen! Preusmjeravanje...';
      setTimeout(() => this.router.navigate(['/login']), 2000);
    },
    error: (err) => {
      this.errorMessage = err.error?.message || 'Greška pri registraciji.';
    }
  });
  }
}