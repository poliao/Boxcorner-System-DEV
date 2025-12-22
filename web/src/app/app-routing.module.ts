import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { AuthGuard } from './guards/auth.guard';
import { MenuGuard } from './guards/menu.guard';
import { Dcsm01DetailResolver } from './demo/forms/pages/dcsm01/dcsm01-detail.resolver'; // 1. Import Resolver
import { Dcsm02DetailResolver } from './demo/forms/pages/dcsm02/dcsm02-detail.resolver';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/default',
        pathMatch: 'full'
      },
      {
        path: 'default',
        loadComponent: () => import('./demo/dashboard/default/default.component').then((c) => c.DefaultComponent)
      },
      {
        path: 'Dcsm01Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm01/dcsm01-detail.component').then((c) => c.Dcsm01DetailComponent),
        resolve: { 
          recipeData: Dcsm01DetailResolver
        }
      },
      {
        path: 'Dcsm01Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm01/dcsm01-detail.component').then((c) => c.Dcsm01DetailComponent)
      },
      {
        path: 'Dcsm01',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm01/dcsm01.component').then((c) => c.Dcsm01Component)
      },
      {
        path: 'Dcsm02Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm02/dcsm02-detail.component').then((c) => c.Dcsm02DetailComponent),
        resolve: { 
          designOrder: Dcsm02DetailResolver
        }
      },
      {
        path: 'Dcsm02Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm02/dcsm02-detail.component').then((c) => c.Dcsm02DetailComponent)
      },
      {
        path: 'Dcsm02',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm02/dcsm02.component').then((c) => c.Dcsm02Component)
      }
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./demo/pages/authentication/login/login.component').then((c) => c.LoginComponent)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}