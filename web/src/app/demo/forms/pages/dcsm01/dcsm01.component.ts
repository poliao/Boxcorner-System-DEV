import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator'; // Import PageEvent
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { AuthService } from 'src/app/services/auth.service';
import { Dcsm01Service } from 'src/app/demo/forms/pages/dcsm01/dcsm01.service'; // Import Service
import { LoadingService } from '../../../loadingservice/loading';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

interface Recipe {
  recipeid: string;
  jobid: string;
  jobname: string;
  updateby: string;
}

@Component({
  selector: 'app-docsystem',
  imports: [
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatSelectModule,
    MatAutocompleteModule,
  ],
  templateUrl: './dcsm01.component.html',
  styleUrls: ['./dcsm01.component.scss']
})
export class Dcsm01Component implements OnInit, AfterViewInit {
  loginForm: FormGroup;

  displayedColumns: string[] = ['recipeid', 'jobid', 'jobname', 'updateby'];
  dataSource = new MatTableDataSource<Recipe>([]);
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  filterValue = '';
  filterJobName: string = '';
  filterJobId: string = '';
  filterRecipeId: string = '';
  jobIdList: string[] = [];
  recipeIdList: string[] = [];
  private searchRecipeSubject = new Subject<string>();
  private searchJobSubject = new Subject<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dcsm01Service: Dcsm01Service,
    private loadingService: LoadingService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.prepareDropdownData();
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => {
      this.pageIndex = this.paginator.pageIndex;
      this.pageSize = this.paginator.pageSize;
      this.loadData();
    });
  }

  loadData() {
    this.loadingService.show();
    this.dcsm01Service.getAllRecipes(
      this.filterRecipeId,
      this.filterJobId,
      this.filterJobName,
      this.pageIndex,
      this.pageSize,
    )
      .subscribe({
        next: (response: any) => {
          this.dataSource.data = response.content;
          this.totalElements = response.totalElements;
          this.loadingService.hide();
        },
        error: (err) => {
          console.error('Error loading data', err);
          this.loadingService.hide();
        }
      });
  }

  getDisplayedColumns(): string[] {
    if (window.innerWidth <= 900) {
      return ['recipeid', 'jobid', 'jobname'];
    }
    return this.displayedColumns;
  }

  add() {
    this.router.navigate(['/Dcsm01Detail']);
  }

  goToDetail(id: string) {
    this.router.navigate(['/Dcsm01Detail', id]);
  }

  onSearchChange() {
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.loadData();
  }

  prepareDropdownData() {
    this.searchRecipeSubject.pipe(
    ).subscribe(searchValue => {
      this.fetchRecipeIdsFromDB(searchValue);
    });

    this.searchJobSubject.pipe(
    ).subscribe(searchValue => {
      this.fetchJobIdsFromDB(searchValue);
    });
  
    this.fetchRecipeIdsFromDB('');
      this.fetchJobIdsFromDB('');
  }

  fetchRecipeIdsFromDB(query: string) {
    this.dcsm01Service.getUniqueRecipeIds(query).subscribe({
      next: (data: string[]) => {
        this.recipeIdList = data;
      },
      error: (err) => {
        console.error('Error fetching Recipe IDs from DB:', err);
      }
    });
  }

  fetchJobIdsFromDB(query: string) {
    this.dcsm01Service.getUniqueJobIds(query).subscribe({
      next: (data: string[]) => {
        this.jobIdList = [...new Set(data)];
      },
      error: (err) => console.error('Error fetching Job IDs:', err)
    });
  }

  onRecipeSearch(event: any) {
    const value = (event.target as HTMLInputElement).value;
    this.searchRecipeSubject.next(value);
  }

  onJobSearch(event: any) {
    const value = (event.target as HTMLInputElement).value;
    this.searchJobSubject.next(value);
  }
}