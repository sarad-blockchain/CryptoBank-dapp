// ============================================================
// AppComponent — root shell
// Composes the sticky Navbar + routed page content.
// All feature pages are lazy-loaded via app.routes.ts.
// ============================================================
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <!-- Global sticky navigation bar -->
    <app-navbar />

    <!-- Routed feature pages render here -->
    <main class="main-content">
      <router-outlet />
    </main>
  `
})
export class AppComponent {}
