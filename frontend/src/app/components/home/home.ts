import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { News } from '../../models/news.model';
import { RouterModule } from '@angular/router';
import { ShortenTextPipe } from '../../pipes/shorten-text-pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ShortenTextPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  allNews: News[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getAllNews().subscribe({
      next: (data) => {
        this.allNews = data;
      },
      error: (err) => console.error('Greška pri dohvatu vijesti', err)
    });
  }
}