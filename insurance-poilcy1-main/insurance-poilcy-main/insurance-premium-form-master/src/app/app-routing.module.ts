import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { PremiumFormComponent } from './premium-form/premium-form.component';
import { HomeComponent } from './home/home.component';
import { DataTableComponent } from './data-table/data-table.component';
import { PolicyDetailsComponent } from './policy-details/policy-details.component';
import { DoctorComponentComponent } from './doctor-component/doctor-component.component';
import { DataclaimComponent } from './dataclaim/dataclaim.component';
import { ClaimdetailsComponent } from './claimdetails/claimdetails.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'premium-form', component: PremiumFormComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'data-table', component: DataTableComponent },

  { path: 'policy-details/:policyNumber', component: PolicyDetailsComponent },
{path:'doctor',component:DoctorComponentComponent},
{path:'dataclaim',component:DataclaimComponent},
{path:'claim-details/:claimNumber',component:ClaimdetailsComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route to redirect to /home
  { path: '**', redirectTo: '/home', pathMatch: 'full' }, // Redirects all other paths to /home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
