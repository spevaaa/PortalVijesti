import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { News, Comment } from '../../models/news.model';
import { FormsModule } from '@angular/forms';
import { CustomDatePipe } from '../../pipes/custom-date-pipe';

@Component({
  selector: 'app-news-details',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomDatePipe],
  templateUrl: './news-details.html',
  styleUrl: './news-details.css'
})
export class NewsDetails implements OnInit {
  news?: News;
  comments: Comment[] = [];
  newCommentText: string = '';
  isLoggedIn: boolean = !!localStorage.getItem('token');
  currentUserId: number | null = null;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
  const rawId = this.route.snapshot.paramMap.get('id');
  this.currentUserId = this.getLoggedInUserId();

  const id = Number(rawId);
  if (!id) {
    console.error("ID nije valjan broj!");
    return;
  }

  this.loadComments(id);
  
  this.api.getNewsById(id).subscribe({
    next: (data) => {
      this.news = data;
    }
  });
}

fetchNewsData(id: number) {
  this.api.getNewsById(id).subscribe({
    next: (data) => {
      this.news = data;
    },
    error: (err) => console.error('Greška vijest:', err)
  });

  this.loadComments(id);
}

  loadComments(newsId: number) {
  this.api.getCommentsByNews(newsId).subscribe({
    next: (data) => {
      this.comments = data;
    },
    error: (err) => console.error("Greška u pozivu:", err)
  });
}

addComment() {
  if (!this.newCommentText.trim()) return;

  const commentData = {
    text: this.newCommentText,
    news_id: this.news?.id
  };

  this.api.postComment(commentData).subscribe({
    next: (response) => {
      this.newCommentText = '';
      this.loadComments(this.news!.id);
    },
    error: (err) => {
      console.error('Greška:', err);
      alert('Došlo je do greške pri objavi.');
    }
  });
}

deleteComment(commentId: number) {
  if (confirm('Želite li obrisati ovaj komentar?')) {
    this.api.deleteComment(commentId).subscribe({
      next: () => {
        this.loadComments(this.news!.id); 
      },
      error: (err) => console.error('Greška pri brisanju:', err)
    });
  }
}

getLoggedInUserId(): number | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;
  } catch (e) {
    return null;
  }
}
}