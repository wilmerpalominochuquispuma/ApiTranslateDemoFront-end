import { EMPTY, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Translation } from 'src/app/interfaces/translation.interface';
import { TranslateService } from 'src/app/services/translate.service';

@Component({
  selector: 'app-translate-list',
  templateUrl: './translate-list.component.html',
  styleUrls: ['./translate-list.component.css']
})
export class TranslateListComponent implements OnInit {
  translations: Translation[] = [];
  showInactive = false;
  showTranslationForm = false;
  searchTerm = '';
  translationsFiltered: Translation[] = [];
  currentPage = 1;
  itemsPerPage = 5;

  constructor(private translationService: TranslateService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadTranslations();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    const maxPage = Math.ceil(this.translationsFiltered.length / this.itemsPerPage);
    if (this.currentPage < maxPage) {
      this.currentPage++;
    }
  }

  loadTranslations(): void {
    this.getTranslationsObservable().subscribe(
      (data: Translation[]) => {
        this.translations = data;
        this.filterTranslations();
      },
      error => {
        console.error('Error al cargar los Datos:', error);
        this.showErrorMessage('Error al cargar los Datos. Por favor, inténtelo de nuevo.');
      }
    );
  }

  // translate-list.component.ts

  deleteTranslation(translation: Translation): void {
    if (translation.id !== undefined) {
      this.translationService.deleteTranslation(translation.id).subscribe(
        () => {
          this.showErrorMessage('Traducción eliminada con éxito.');
          this.loadTranslations(); // Recargar las traducciones después de eliminar
        },
        error => {
          console.error('Error al eliminar la traducción:', error);
          this.showErrorMessage('Error al eliminar la traducción. Por favor, inténtelo de nuevo.');
        }
      );
    } else {
      console.error('Error: ID de la traducción no definido.');
      this.showErrorMessage('Error: ID de la traducción no definido.');
    }
  }

  private getTranslationsObservable(): Observable<Translation[]> {
    return this.showInactive
      ? this.translationService.getTranslationsInactive()
      : this.translationService.getTranslationsActive();
  }

  filterTranslations(): void {
    this.translationsFiltered = this.translations
      .filter(translation =>
        translation.originalText.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        translation.translatedText.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        translation.fromLanguage.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        translation.toLanguage.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    this.currentPage = 1;
  }

  openTranslationForm(): void {
    this.showTranslationForm = true;
  }

  closeTranslationForm(): void {
    this.showTranslationForm = false;
  }

  openEditForm(translation: Translation): void {
    console.log('Editing Translation:', translation);
    // Establecer el estudiante en el servicio antes de abrir el formulario
    this.translationService.setEditingTranslation(translation);
    this.showTranslationForm = true;
  }

  onSearchInput(): void {
    this.filterTranslations();
  }

  toggleShowInactive = (): void => {
    this.showInactive = !this.showInactive;
    this.loadTranslations();
  }

  getToggleButtonText = (): string => {
    return this.showInactive ? 'Mostrar Activos' : 'Mostrar Inactivos';
  }

  getToggleButtonColor = (): string => {
    return this.showInactive ? 'btn-success' : 'btn-danger';
  }


  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }



}