import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Translation } from '../interfaces/translation.interface';


@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private editingTranslationSubject = new BehaviorSubject<Translation | null>(null);
  editingTranslation$ = this.editingTranslationSubject.asObservable();


  // Nuevo EventEmitter para notificar cambios en la lista
  translationsUpdated = new EventEmitter<void>();

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getTranslationsActive(): Observable<Translation[]> {
    return this.http.get<Translation[]>(this.apiUrl + '/translations');
  }

  getTranslationsInactive(): Observable<Translation[]> {
    return this.http.get<Translation[]>(this.apiUrl + '/translations');
  }


  getTranslation(id: number): Observable<Translation> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Translation>(url).pipe(
      catchError(this.handleError),
      tap(() => this.handleResponse())
    );
  }


  createTranslation(translationData: Translation): Observable<Translation> {
    const createUrl = `${this.apiUrl}/translate`;
    return this.http.post<Translation>(createUrl, translationData).pipe(
      switchMap(() => this.handleResponse()),
      // Emitir el evento de actualización después de la creación exitosa
      tap(() => this.translationsUpdated.emit())
    );
  }

  updateTranslation(translationId: number, updatedData: Translation): Observable<Translation> {
    const url = `${this.apiUrl}/translations/${translationId}`;
    return this.http.put<Translation>(url, updatedData).pipe(
      switchMap(() => this.handleResponse()),
      // Emitir el evento de actualización después de la actualización exitosa
      tap(() => this.translationsUpdated.emit())
    );
  }

  deleteTranslation(id: number): Observable<void> {
    const url = `${this.apiUrl}/translations/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError),
      tap(() => this.translationsUpdated.emit())
    );
  }

  private handleResponse(): Promise<any> {
    return Swal.fire({
      title: 'Éxito',
      text: 'Deseas realizar esta acción?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Realizar lógica adicional si el usuario hace clic en "Aceptar"
        console.log('Usuario hizo clic en Aceptar');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Rechazar la promesa si el usuario hace clic en "Cancelar"
        console.log('Usuario hizo clic en Cancelar');
        return Promise.reject('Operación cancelada por el usuario');
      }
      // Puedes omitir esto si no necesitas la respuesta del usuario
      return result;
    });
  }

  private handleError(error: any) {
    console.error('Error:', error);
    return throwError('Ocurrió un error. Por favor, inténtelo de nuevo.');
  }

  private editingTranslation: Translation | null = null;

  setEditingTranslation(translation: Translation): void {
    this.editingTranslationSubject.next(translation);
  }

  clearEditingTranslation(): void {
    this.editingTranslationSubject.next(null);
  }

  getEditingTranslation(): Translation | null {
    return this.editingTranslationSubject.value;
  }

}
