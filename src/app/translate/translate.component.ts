import { Component } from '@angular/core';
import { TranslateService } from '../translate.service';

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.css']
})
export class TranslateComponent {
  text: string = '';
  from: string = '';
  to: string = '';
  translatedText: string = '';

  constructor(private translateService: TranslateService) { }

  onSubmit() {
    this.translateService.translate(this.text, this.from, this.to).subscribe(
      response => {
        this.translatedText = response;
      },
      error => {
        console.error('Error translating text:', error);
      }
    );
  }
}
