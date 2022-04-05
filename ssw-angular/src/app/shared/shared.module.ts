import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { HeaderComponent } from './header/header.component';

const declarationsAndExports = [HeaderComponent];
const importsAndExports = [MaterialModule];

@NgModule({
  declarations: [...declarationsAndExports],
  imports: [CommonModule, ...importsAndExports],
  exports: [...declarationsAndExports, ...importsAndExports]
})
export class SharedModule {}
