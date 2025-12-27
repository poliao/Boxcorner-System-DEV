import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { AuthGuard } from './guards/auth.guard';
import { MenuGuard } from './guards/menu.guard';
import { Dcsm01DetailResolver } from './demo/forms/pages/dcsm01/dcsm01-detail.resolver';
import { Dcsm02DetailResolver } from './demo/forms/pages/dcsm02/dcsm02-detail.resolver';
import { Dcsm04DetailResolver } from './demo/forms/pages/dcsm04/dcsm04-detail.resolver';
import { Dcsm05DetailResolver } from './demo/forms/pages/dcsm05/dcsm05-detail.resolver';
import { Dcsm06DetailResolver } from './demo/forms/pages/dcsm06/dcsm06-detail.resolver';
import { Dcsm07DetailResolver } from './demo/forms/pages/dcsm07/dcsm07-detail.resolver';
import { Dcsm08DetailResolver } from './demo/forms/pages/dcsm08/dcsm08-detail.resolver';
import { Dcsm09DetailResolver } from './demo/forms/pages/dcsm09/dcsm09-detail.resolver';

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
      },
      {
        path: 'Dcsm03Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm03/dcsm03-detail.component').then((c) => c.Dcsm03DetailComponent),
        resolve: { 
          designOrder: Dcsm02DetailResolver
        }
      },
      {
        path: 'Dcsm03Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm03/dcsm03-detail.component').then((c) => c.Dcsm03DetailComponent)
      },
      {
        path: 'Dcsm03',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm03/dcsm03.component').then((c) => c.Dcsm03Component)
      },
      {
        path: 'Dcsm04Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm04/dcsm04-detail.component').then((c) => c.Dcsm04DetailComponent),
        resolve: { 
          designOrder: Dcsm04DetailResolver
        }
      },
      {
        path: 'Dcsm04Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm04/dcsm04-detail.component').then((c) => c.Dcsm04DetailComponent)
      },
      {
        path: 'Dcsm04',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm04/dcsm04.component').then((c) => c.Dcsm04Component)
      },
      {
        path: 'Dcsm05Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm05/dcsm05-detail.component').then((c) => c.Dcsm05DetailComponent),
        resolve: { 
          designOrder: Dcsm05DetailResolver
        }
      },
      {
        path: 'Dcsm05Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm05/dcsm05-detail.component').then((c) => c.Dcsm05DetailComponent)
      },
      {
        path: 'Dcsm05',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm05/dcsm05.component').then((c) => c.Dcsm05Component)
      },
      {
        path: 'Dcsm06Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm06/dcsm06-detail.component').then((c) => c.Dcsm06DetailComponent),
        resolve: { 
          designOrder: Dcsm06DetailResolver
        }
      },
      {
        path: 'Dcsm06Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm06/dcsm06-detail.component').then((c) => c.Dcsm06DetailComponent)
      },
      {
        path: 'Dcsm06',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm06/dcsm06.component').then((c) => c.Dcsm06Component)
      },
      {
        path: 'Dcsm07Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm07/dcsm07-detail.component').then((c) => c.Dcsm07DetailComponent),
        resolve: { 
          designOrder: Dcsm07DetailResolver
        }
      },
      {
        path: 'Dcsm07Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm07/dcsm07-detail.component').then((c) => c.Dcsm07DetailComponent)
      },
      {
        path: 'Dcsm07',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm07/dcsm07.component').then((c) => c.Dcsm07Component)
      },
      {
        path: 'Dcsm08Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm08/dcsm08-detail.component').then((c) => c.Dcsm08DetailComponent),
        resolve: { 
          designOrder: Dcsm08DetailResolver
        }
      },
      {
        path: 'Dcsm08Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm08/dcsm08-detail.component').then((c) => c.Dcsm08DetailComponent)
      },
      {
        path: 'Dcsm08',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm08/dcsm08.component').then((c) => c.Dcsm08Component)
      },
      {
        path: 'Dcsm09Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm09/dcsm09-detail.component').then((c) => c.Dcsm09DetailComponent),
        resolve: { 
          designOrder: Dcsm09DetailResolver
        }
      },
      {
        path: 'Dcsm09Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm09/dcsm09-detail.component').then((c) => c.Dcsm09DetailComponent)
      },
      {
        path: 'Dcsm09',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm09/dcsm09.component').then((c) => c.Dcsm09Component)
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