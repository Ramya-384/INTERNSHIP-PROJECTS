import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { LandingpageComponent } from './Milestone1/landingpage/landingpage.component';
import { RegisterpageComponent } from './Milestone1/registerpage/registerpage.component';
import { LoginpageComponent } from './Milestone1/loginpage/loginpage.component';
import { ForgotPasswordComponent } from './Milestone1/forgotpassword/forgotpassword.component';
import { AuctioneerdashboardComponent } from './Milestone2/auctioneer/auctioneerdashboard/auctioneerdashboard.component';
import { HomepageComponent } from './Milestone2/bidder/homepage/homepage.component';
import { DetailpageComponent } from './Milestone2/detailpage/detailpage.component';
import { BidpageComponent } from './Milestone2/bidder/bidpage/bidpage.component';
import { AdminDashboardComponent } from './Milestone3/admin-dashboard/admin-dashboard.component';
import { authGuard } from './guards/auth.guard';
import { UsersComponent } from './Milestone3/users/users.component';
import { ListingsComponent } from './Milestone3/listings/listings.component';
import { AuctionsComponent } from './Milestone3/auctions/auctions.component';

export const routes: Routes = [
  { path: '', component: LandingpageComponent },
  { path: 'register', component: RegisterpageComponent },
  { path: 'login', component: LoginpageComponent },
  { path: 'password-recovery', component: ForgotPasswordComponent },
  { path: 'auctioneer-dashboard', component: AuctioneerdashboardComponent, canActivate: [authGuard], data: { role: 'Auctioneer' } },
  { path: 'home', component: HomepageComponent, canActivate: [authGuard], data: { role: 'Bidder' } },
  { path: 'details/:id', component: DetailpageComponent },
  { path: 'bidpage/:id', component: BidpageComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard], data: { role: 'Admin' } },
  { path: 'admin/users', component: UsersComponent, canActivate: [authGuard], data: { role: 'Admin' } },
  { path: 'admin/listings', component: ListingsComponent, canActivate: [authGuard], data: { role: 'Admin' } },
  { path: 'admin/auctions', component: AuctionsComponent, canActivate: [authGuard], data: { role: 'Admin' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}