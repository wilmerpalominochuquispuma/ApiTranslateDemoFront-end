import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Translation } from 'src/app/interfaces/translation.interface';
import { TranslateService } from 'src/app/services/translate.service';

@Component({
  selector: 'app-translate-form',
  templateUrl: './translate-form.component.html',
  styleUrls: ['./translate-form.component.css']
})
export class TranslateFormComponent implements OnInit {
  @ViewChild('translationForm') translationForm!: NgForm;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() closeForm = new EventEmitter<void>();
  @Output() insertionSuccess = new EventEmitter<void>();

  translation: Translation = {
    originalText: '',
    translatedText: '',
    fromLanguage: '',
    toLanguage: ''
  };

  formErrors: Record<string, string> = {};
  isEditing: boolean = false;

  languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh-Hans', name: 'Chinese Simplified' },
    { code: 'zh-Hant', name: 'Chinese Traditional' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'pt', name: 'Portuguese (Brazil)' },
    { code: 'ru', name: 'Russian' },
    { code: 'it', name: 'Italian' },
    { code: 'nl', name: 'Dutch' }
  ];

  constructor(private translateService: TranslateService) { }

  ngOnInit(): void {
    const editingTranslation = this.translateService.getEditingTranslation();
    if (editingTranslation) {
      this.translation = { ...editingTranslation };
      this.isEditing = true;
    }
  }

  onSubmit(): void {
    this.formErrors = {};
    if (this.isEditing) {
      this.translateService.updateTranslation(this.translation.id!, this.translation).subscribe(
        (response) => {
          console.log('editado con éxito', response);
          this.handleSuccess();
        },
        (error: any) => {
          console.error('Error al editar', error);
          this.handleErrors(error);
        }
      );
    } else {
      this.translateService.createTranslation(this.translation).subscribe(
        (response) => {
          console.log('Estudiante agregado con éxito', response);
          this.handleSuccess();
        },
        (error: any) => {
          console.error('Error al agregar estudiante', error);
          this.handleErrors(error);
        }
      );
    }
  }

  private handleSuccess(): void {
    this.insertionSuccess.emit();
    this.closeForm.emit();
    this.translateService.translationsUpdated.emit();
    this.resetForm();
  }

  private handleErrors(error: any): void {
    if (error.error) {
      for (const [field, errorMessage] of Object.entries(error.error)) {
        this.formErrors[field] = errorMessage as string;
      }
    }
  }

  hasError(fieldName: string): boolean {
    return !!this.formErrors[fieldName];
  }

  getError(fieldName: string): string {
    return this.formErrors[fieldName] || '';
  }

  private resetForm(): void {
    this.translation = {
      originalText: '',
      translatedText: '',
      fromLanguage: '',
      toLanguage: ''
    };
  }

  closeTranslationForm(): void {
    this.closeForm.emit();
    this.translateService.clearEditingTranslation();
    this.resetForm();
  }
}
