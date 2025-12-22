import { NgModule } from '@angular/core';

interface Recipe {
  recipeid: string;
  jobid: string;
  jobname: string;
  updateby: string;
}
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Material Modules
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

// Components
import { Dcsm01Component } from './demo/forms/pages/dcsm01/dcsm01.component';

// Services
import { AuthService } from './services/auth.service';
import { Dcsm01Service } from './demo/forms/pages/dcsm01/dcsm01.service';
import { Dcsm02Service } from './demo/forms/pages/dcsm02/dcsm02.service';
import { LoadingService } from './demo/loadingservice/loading';
import { Dcsm03Service } from './demo/forms/pages/dcsm03/dcsm03.service';
import { Dcsm02Component } from './demo/forms/pages/dcsm02/dcsm02.component';
import { Dcsm03Component } from './demo/forms/pages/dcsm03/dcsm03.component';

@NgModule({
  declarations: [
    AppComponent,
    Dcsm01Component,
    Dcsm02Component,
    Dcsm03Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatAutocompleteModule
  ],
  providers: [
    AuthService,
    Dcsm01Service,
    Dcsm02Service,
    Dcsm03Service,
    LoadingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }