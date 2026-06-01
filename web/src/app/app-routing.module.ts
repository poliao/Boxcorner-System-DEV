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
import { Dcsm10DetailResolver } from './demo/forms/pages/dcsm10/dcsm10-detail.resolver';
import { Dcsm11DetailResolver } from './demo/forms/pages/dcsm11/dcsm11-detail.resolver';
import { Dcsm12DetailResolver } from './demo/forms/pages/dcsm12/dcsm12-detail.resolver';
import { Dcsm13DetailResolver } from './demo/forms/pages/dcsm13/dcsm13-detail.resolver';
import { Dcsm14DetailResolver } from './demo/forms/pages/dcsm14/dcsm14-detail.resolver';
import { Dcsm15DetailResolver } from './demo/forms/pages/dcsm15/dcsm15-detail.resolver';
import { Dcsm16DetailResolver } from './demo/forms/pages/dcsm16/dcsm16-detail.resolver';
import { Dcsm17DetailResolver } from './demo/forms/pages/dcsm17/dcsm17-detail.resolver';
import { Dcsm18DetailResolver } from './demo/forms/pages/dcsm18/dcsm18-detail.resolver';
import { Dcsm19DetailResolver } from './demo/forms/pages/dcsm19/dcsm19-detail.resolver';
import { Dcsm27DetailResolver } from './demo/forms/pages/dcsm27/dcsm27-detail.resolver';
import { Dcsm20DetailResolver } from './demo/forms/pages/dcsm20/dcsm20-detail.resolver';
import { Dcsm21DetailResolver } from './demo/forms/pages/dcsm21/dcsm21-detail.resolver';
import { Dcsm22DetailResolver } from './demo/forms/pages/dcsm22/dcsm22-detail.resolver';
import { Dcsm23DetailResolver } from './demo/forms/pages/dcsm23/dcsm23-detail.resolver';
import { Dcsm24DetailResolver } from './demo/forms/pages/dcsm24/dcsm24-detail.resolver';
import { Dcsm25DetailResolver } from './demo/forms/pages/dcsm25/dcsm25-detail.resolver';
import { Dcsm26DetailResolver } from './demo/forms/pages/dcsm26/dcsm26-detail.resolver';
import { Dcsm28DetailResolver } from './demo/forms/pages/dcsm28/dcsm28-detail.resolver';
import { Dcsm29DetailResolver } from './demo/forms/pages/dcsm29/dcsm29-detail.resolver';
import { Dcsm33DetailResolver } from './demo/forms/pages/dcsm33/dcsm33-detail.resolver';

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
      ,
      {
        path: 'Dcsm10Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm10/dcsm10-detail.component').then((c) => c.Dcsm10DetailComponent),
        resolve: {
          designOrder: Dcsm10DetailResolver
        }
      },
      {
        path: 'Dcsm10Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm10/dcsm10-detail.component').then((c) => c.Dcsm10DetailComponent)
      },
      {
        path: 'Dcsm10',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm10/dcsm10.component').then((c) => c.Dcsm10Component)
      },
      {
        path: 'Dcsm11Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm11/dcsm11-detail.component').then((c) => c.Dcsm11DetailComponent),
        resolve: {
          designOrder: Dcsm11DetailResolver
        }
      },
      {
        path: 'Dcsm11Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm11/dcsm11-detail.component').then((c) => c.Dcsm11DetailComponent)
      },
      {
        path: 'Dcsm11',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm11/dcsm11.component').then((c) => c.Dcsm11Component)
      },
      {
        path: 'Dcsm12Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm12/dcsm12-detail.component').then((c) => c.Dcsm12DetailComponent),
        resolve: {
          designOrder: Dcsm12DetailResolver
        }
      },
      {
        path: 'Dcsm12Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm12/dcsm12-detail.component').then((c) => c.Dcsm12DetailComponent)
      },
      {
        path: 'Dcsm12',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm12/dcsm12.component').then((c) => c.Dcsm12Component)
      },
      {
        path: 'Dcsm13Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm13/dcsm13-detail.component').then((c) => c.Dcsm13DetailComponent),
        resolve: {
          designOrder: Dcsm13DetailResolver
        }
      },
      {
        path: 'Dcsm13Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm13/dcsm13-detail.component').then((c) => c.Dcsm13DetailComponent)
      },
      {
        path: 'Dcsm13',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm13/dcsm13.component').then((c) => c.Dcsm13Component)
      },
      {
        path: 'Dcsm14Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm14/dcsm14-detail.component').then((c) => c.Dcsm14DetailComponent),
        resolve: {
          designOrder: Dcsm14DetailResolver
        }
      },
      {
        path: 'Dcsm14Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm14/dcsm14-detail.component').then((c) => c.Dcsm14DetailComponent)
      },
      {
        path: 'Dcsm14',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm14/dcsm14.component').then((c) => c.Dcsm14Component)
      },
      {
        path: 'Dcsm15Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm15/dcsm15-detail.component').then((c) => c.Dcsm15DetailComponent),
        resolve: {
          designOrder: Dcsm15DetailResolver
        }
      },
      {
        path: 'Dcsm15Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm15/dcsm15-detail.component').then((c) => c.Dcsm15DetailComponent)
      },
      {
        path: 'Dcsm15',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm15/dcsm15.component').then((c) => c.Dcsm15Component)
      },
      {
        path: 'Dcsm16Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm16/dcsm16-detail.component').then((c) => c.Dcsm16DetailComponent),
        resolve: {
          designOrder: Dcsm16DetailResolver
        }
      },
      {
        path: 'Dcsm16Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm16/dcsm16-detail.component').then((c) => c.Dcsm16DetailComponent)
      },
      {
        path: 'Dcsm16',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm16/dcsm16.component').then((c) => c.Dcsm16Component)
      },
      {
        path: 'Dcsm17Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm17/dcsm17-detail.component').then((c) => c.Dcsm17DetailComponent),
        resolve: {
          designOrder: Dcsm17DetailResolver
        }
      },
      {
        path: 'Dcsm17Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm17/dcsm17-detail.component').then((c) => c.Dcsm17DetailComponent)
      },
      {
        path: 'Dcsm17',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm17/dcsm17.component').then((c) => c.Dcsm17Component)
      },
      {
        path: 'Dcsm18Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm18/dcsm18-detail.component').then((c) => c.Dcsm18DetailComponent),
        resolve: {
          designOrder: Dcsm18DetailResolver
        }
      },
      {
        path: 'Dcsm18Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm18/dcsm18-detail.component').then((c) => c.Dcsm18DetailComponent)
      },
      {
        path: 'Dcsm18',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm18/dcsm18.component').then((c) => c.Dcsm18Component)
      },
      {
        path: 'Dcsm19Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm19/dcsm19-detail.component').then((c) => c.Dcsm19DetailComponent),
        resolve: {
          designOrder: Dcsm19DetailResolver
        }
      },
      {
        path: 'Dcsm19Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm19/dcsm19-detail.component').then((c) => c.Dcsm19DetailComponent)
      },
      {
        path: 'Dcsm19',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm19/dcsm19.component').then((c) => c.Dcsm19Component)
      },
      {
        path: 'Dcsm20DetailStatus/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm20/dcsm20-detail-status.component').then((c) => c.Dcsm20DetailStatusComponent),
      },
      {
        path: 'Dcsm20Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm20/dcsm20-detail.component').then((c) => c.Dcsm20DetailComponent),
        resolve: {
          productionOrder: Dcsm20DetailResolver
        }
      },
      {
        path: 'Dcsm20Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm20/dcsm20-detail.component').then((c) => c.Dcsm20DetailComponent)
      },
      {
        path: 'Dcsm20',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm20/dcsm20.component').then((c) => c.Dcsm20Component)
      }, {
        path: 'Dcsm21Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm21/dcsm21-detail.component').then((c) => c.Dcsm21DetailComponent),
        resolve: {
          designInside: Dcsm21DetailResolver
        }
      },
      {
        path: 'Dcsm21Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm21/dcsm21-detail.component').then((c) => c.Dcsm21DetailComponent)
      },
      {
        path: 'Dcsm21',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm21/dcsm21.component').then((c) => c.Dcsm21Component)
      },
      {
        path: 'Dcsm22Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm22/dcsm22-detail.component').then((c) => c.Dcsm22DetailComponent),
        resolve: {
          designInside: Dcsm22DetailResolver
        }
      },
      {
        path: 'Dcsm22Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm22/dcsm22-detail.component').then((c) => c.Dcsm22DetailComponent)
      },
      {
        path: 'Dcsm22',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm22/dcsm22.component').then((c) => c.Dcsm22Component)
      },
      {
        path: 'Dcsm23Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm23/dcsm23-detail.component').then((c) => c.Dcsm23DetailComponent),
        resolve: {
          designDiecut: Dcsm23DetailResolver
        }
      },
      {
        path: 'Dcsm23Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm23/dcsm23-detail.component').then((c) => c.Dcsm23DetailComponent)
      },
      {
        path: 'Dcsm23',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm23/dcsm23.component').then((c) => c.Dcsm23Component)
      },
      {
        path: 'Dcsm24Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm24/dcsm24-detail.component').then((c) => c.Dcsm24DetailComponent),
        resolve: {
          designDiecut: Dcsm24DetailResolver
        }
      },
      {
        path: 'Dcsm24Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm24/dcsm24-detail.component').then((c) => c.Dcsm24DetailComponent)
      },
      {
        path: 'Dcsm24',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm24/dcsm24.component').then((c) => c.Dcsm24Component)
      },
      {
        path: 'Dcsm25Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm25/dcsm25-detail.component').then((c) => c.Dcsm25DetailComponent),
        resolve: {
          designDiecut: Dcsm25DetailResolver
        }
      },
      {
        path: 'Dcsm25Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm25/dcsm25-detail.component').then((c) => c.Dcsm25DetailComponent)
      },
      {
        path: 'Dcsm25',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm25/dcsm25.component').then((c) => c.Dcsm25Component)
      }
      , {
        path: 'Dcsm26Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm26/dcsm26-detail.component').then((c) => c.Dcsm26DetailComponent),
        resolve: {
          designDiecut: Dcsm26DetailResolver
        }
      },
      {
        path: 'Dcsm26Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm26/dcsm26-detail.component').then((c) => c.Dcsm26DetailComponent)
      },
      {
        path: 'Dcsm26',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm26/dcsm26.component').then((c) => c.Dcsm26Component)
      },
      {
        path: 'Dcsm27Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm27/dcsm27-detail.component').then((c) => c.Dcsm27DetailComponent),
        resolve: {
          designDiecut: Dcsm27DetailResolver
        }
      },
      {
        path: 'Dcsm27Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm27/dcsm27-detail.component').then((c) => c.Dcsm27DetailComponent)
      },
      {
        path: 'Dcsm27',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm27/dcsm27.component').then((c) => c.Dcsm27Component)
      },
      {
        path: 'Dcsm28Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm28/dcsm28-detail.component').then((c) => c.Dcsm28DetailComponent),
        resolve: {
          salesActivity: Dcsm28DetailResolver
        }
      },
      {
        path: 'Dcsm28Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm28/dcsm28-detail.component').then((c) => c.Dcsm28DetailComponent)
      },
      {
        path: 'Dcsm28Map',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm28/dcsm28-map.component').then((c) => c.Dcsm28MapComponent)
      },
      {
        path: 'Dcsm28',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm28/dcsm28.component').then((c) => c.Dcsm28Component)
      },
      {
        path: 'Dcsm29Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm29/dcsm29-detail.component').then((c) => c.Dcsm29DetailComponent),
        resolve: {
          printJob: Dcsm29DetailResolver
        }
      },
      {
        path: 'Dcsm29Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm29/dcsm29-detail.component').then((c) => c.Dcsm29DetailComponent)
      },
      {
        path: 'Dcsm29',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm29/dcsm29.component').then((c) => c.Dcsm29Component)
      },
      {
        path: 'Dcsm33Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm33/dcsm33-detail.component').then((c) => c.Dcsm33DetailComponent),
        resolve: {
          printJob: Dcsm33DetailResolver
        }
      },
      {
        path: 'Dcsm33Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm33/dcsm33-detail.component').then((c) => c.Dcsm33DetailComponent)
      },
      {
        path: 'Dcsm33',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm33/dcsm33.component').then((c) => c.Dcsm33Component)
      },
      {
        path: 'Dcsm34',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm34/dcsm34.component').then((c) => c.Dcsm34Component)
      },
      {
        path: 'Dcsm35',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm35/dcsm35.component').then((c) => c.Dcsm35Component)
      },
      {
        path: 'Dcsm36',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm36/dcsm36.component').then((c) => c.Dcsm36Component)
      },
      {
        path: 'Dcsm36Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm36/dcsm36-detail.component').then((c) => c.Dcsm36DetailComponent)
      },
      {
        path: 'Dcsm37',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm37/dcsm37.component').then((c) => c.Dcsm37Component)
      },
      {
        path: 'Dcsm37Detail/:id',
        loadComponent: () => import('./demo/forms/pages/dcsm37/dcsm37-detail.component').then((c) => c.Dcsm37DetailComponent)
      },
      {
        path: 'Dcsm38',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm38/dcsm38.component').then((c) => c.Dcsm38Component)
      },
      {
        path: 'Dcsm38Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm38/dcsm38-detail.component').then((c) => c.Dcsm38DetailComponent)
      },
      {
        path: 'Dcsm38Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm38/dcsm38-detail.component').then((c) => c.Dcsm38DetailComponent)
      },
      {
        path: 'Dcsm39',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm39/dcsm39.component').then((c) => c.Dcsm39Component)
      },
      {
        path: 'Dcsm39Detail/:type/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm39/dcsm39-detail.component').then((c) => c.Dcsm39DetailComponent)
      },
      {
        path: 'Dcsm39Detail/:type',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm39/dcsm39-detail.component').then((c) => c.Dcsm39DetailComponent)
      },
      {
        path: 'Dcsm40',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm40/dcsm40.component').then((c) => c.Dcsm40Component)
      },
      {
        path: 'Dcsm40Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm40/dcsm40-detail.component').then((c) => c.Dcsm40DetailComponent)
      },
      {
        path: 'Dcsm40Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm40/dcsm40-detail.component').then((c) => c.Dcsm40DetailComponent)
      },
      {
        path: 'Dcsm41',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm41/dcsm41.component').then((c) => c.Dcsm41Component)
      },
      {
        path: 'Dcsm41Detail/:id',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm41/dcsm41-detail.component').then((c) => c.Dcsm41DetailComponent)
      },
      {
        path: 'Dcsm41Detail',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm41/dcsm41-detail.component').then((c) => c.Dcsm41DetailComponent)
      },
      {
        path: 'Dcsm42',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm42/dcsm42.component').then((c) => c.Dcsm42Component)
      },
      {
        path: 'Dcsm43',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm43/dcsm43.component').then((c) => c.Dcsm43Component)
      },
      {
        path: 'Dcsm44',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm44/dcsm44.component').then((c) => c.Dcsm44Component)
      },
      {
        path: 'leave-request',
        loadComponent: () => import('./demo/forms/pages/leave-request/leave-request.component').then((c) => c.LeaveRequestComponent)
      },
      {
        path: 'Dcsm45',
        canActivate: [MenuGuard],
        loadComponent: () => import('./demo/forms/pages/dcsm45/dcsm45.component').then((c) => c.Dcsm45Component)
      },
      {
        path: 'food-order',
        loadComponent: () => import('./demo/forms/pages/food-order/food-order.component').then((c) => c.FoodOrderComponent)
      },
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
export class AppRoutingModule { }