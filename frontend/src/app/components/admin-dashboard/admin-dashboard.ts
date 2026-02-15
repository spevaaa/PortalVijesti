import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { News, Category } from '../../models/news.model';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  allNews: News[] = [];
  categories: Category[] = [];
  newsForm: FormGroup;
  message: string = '';
  editId: number | null = null;

  constructor(private api: ApiService) {
    this.newsForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(5)]),
      content: new FormControl('', [Validators.required, Validators.minLength(20)]),
      image_url: new FormControl(''),
      category_id: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.api.getAllNews().subscribe(data => this.allNews = data);
    this.api.getCategories().subscribe(data =>{
      this.categories = data
    });
  }

onSubmit() {
  if (this.newsForm.valid) {
    const observer = {
      next: (res: any) => {
        this.message = this.editId ? 'Vijest ažurirana!' : 'Vijest dodana!';
        this.resetForm();
      },
      error: (err: any) => {
        console.error('Greška pri slanju:', err);
        this.message = 'Greška na serveru: ' + (err.error?.message || 'Nepoznata greška');
      }
    };

    if (this.editId) {
      this.api.updateNews(this.editId, this.newsForm.value).subscribe(observer);
    } else {
      this.api.createNews(this.newsForm.value).subscribe(observer);
    }
  } else {
    this.message = 'Forma nije ispravno popunjena!';
  }
}

resetForm() {
  this.editId = null;
  this.newsForm.reset({
    title: '',
    content: '',
    image_url: '',
    category_id: ''
  });
  this.loadData();

  setTimeout(() => {
    this.message = '';
  }, 3000);
}

  deleteNews(id: number) {
    if (confirm('Jeste li sigurni da želite obrisati ovu vijest?')) {
      this.api.deleteNews(id).subscribe(() => this.loadData());
    }
  }

  editNews(news: News) {
    this.editId = news.id;
    this.newsForm.patchValue({
      title: news.title,
      content: news.content,
      image_url: news.image_url,
      category_id: news.category_id
    });
  }
}
