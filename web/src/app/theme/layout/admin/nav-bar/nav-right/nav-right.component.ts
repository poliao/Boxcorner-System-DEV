// Angular import
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

// third party import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav-right',
  imports: [RouterModule, SharedModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent implements OnInit {
  userName: string = 'User';
  userRole: string = 'Project Admin';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getUserFromToken();
    if (user) {
      this.userName = user.sub ;
    }
  }

  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
