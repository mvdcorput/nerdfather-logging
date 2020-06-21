import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  declarations: [
  ],
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule
  ],
  providers: [
  ],
  exports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule
  ]
})
export class SharedModule { }
