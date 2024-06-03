import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private apiUrl = 'http://localhost:8080/translate'; // Cambia esto a tu URL de backend

  constructor(private http: HttpClient) { }

  translate(text: string, from: string, to: string): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { text, from, to };

    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      map(response => response.translatedText) // Asegúrate de que esta clave coincide con la respuesta de tu backend
    );
  }
}
