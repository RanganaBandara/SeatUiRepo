import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { InternDashboardComponent } from './intern-dashboard/intern-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminBookingViewComponent } from './admin-booking-view/admin-booking-view.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminHistoryComponent } from './admin-history/admin-history.component';
import { InternBookingComponent } from './intern-booking/intern-booking.component';
import { InternProfileComponent } from './intern-profile/intern-profile.component';
import { AttendanceManagementComponent } from './attendance-management/attendance-management.component';
//import { ForgetPasswordComponent } from './forgot-password/forgot-password.component';
//import { VerifyCodeComponent } from './verify-code/verify-code.component';
import { PendingChangesComponent } from './pending-changes/pending-changes.component';
import { MessageComponent } from './message/message.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  
  { path: 'login', component: LoginComponent },  
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'intern-dashboard', component: InternDashboardComponent },
  { path: 'admin-dashboard', component:AdminDashboardComponent },
  { path: 'admin-booking', component:AdminBookingViewComponent },

  {path:'admin-login',component:AdminLoginComponent},   
  {path:'admin-history',component:AdminHistoryComponent},
  {path:'intern-booking',component:InternBookingComponent},
  {path:'intern-profile',component:InternProfileComponent},
  {path:'attendance',component:AttendanceManagementComponent},
  {path:'pending',component:PendingChangesComponent},
  {path:'message',component:MessageComponent}
 // { path: 'forgot-password', component: ForgetPasswordComponent },
  //{ path: 'verify-code', component: VerifyCodeComponent },
 
];
