import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { UploadErrorComponent } from './upload-error/upload-error.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, NavbarComponent, UploadErrorComponent],
  exports: [NavbarComponent, UploadErrorComponent],
})
export class ComponentsModule {}
