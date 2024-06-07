import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateListComponent } from './components/translate/translate-list/translate-list.component';
import { TranslateFormComponent } from './components/translate/translate-form/translate-form.component';

const routes: Routes = [
  {
    path: 'translate',
    component: TranslateListComponent
  },
  {
    path: 'translate/form',
    component: TranslateFormComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
