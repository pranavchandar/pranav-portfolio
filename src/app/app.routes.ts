import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { TestComponent } from './test/test.component';
import { HomeComponent } from './home/home.component'; 

export const routes: Routes = [
{ path: '', component: HomeComponent }, 
{ path: 'secret', component: LandingPageComponent }, 
{ path: 'test', component: TestComponent }
];