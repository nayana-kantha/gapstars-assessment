import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = 'https://fs-industry-card.onrender.com/api';

  getCompanies() {
    return this.httpClient.get(`${this.apiUrl}/companies`);
  }
}
