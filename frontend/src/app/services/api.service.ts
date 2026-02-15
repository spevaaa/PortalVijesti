import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, userData);
  }

  getAllNews(): Observable<any> {
    return this.http.get(`${this.baseUrl}/news`);
  }

  getNewsById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/news/${id}`);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categories`);
  }

  createNews(newsData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/news`, newsData);
  }

  deleteNews(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/news/${id}`);
  }

  updateNews(id: number, newsData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/news/${id}`, newsData);
  }
  
  getCommentsByNews(newsId: number): Observable<any> {
    return this.http.get<Comment[]>(`${this.baseUrl}/comments/${newsId}`);
  }

  postComment(commentData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/comments`, commentData);
  }

  deleteComment(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/comments/${id}`);
  }
}