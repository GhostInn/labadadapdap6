// src/app/components/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false
})
export class DashboardComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void { }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
