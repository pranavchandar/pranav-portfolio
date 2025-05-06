import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { TestComponent } from './test/test.component';
import { HomeComponent } from './home/home.component'; 
import { AboutComponent } from './about/about.component';
import { ResumeComponent } from './resume/resume.component'; // Import the ResumeComponent

export const routes: Routes = [
{ path: '', component: HomeComponent }, 
{ path: 'secret', component: LandingPageComponent }, 
{ path: 'test', component: TestComponent },
{ path: 'about', component: AboutComponent },
{ path: 'resume', component: ResumeComponent }
];