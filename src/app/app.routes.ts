import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { FeaturesComponent } from './pages/features/features';
import { AboutComponent } from './pages/about/about';
import { PricingComponent } from './pages/pricing/pricing';
import { SupportComponent } from './pages/support/support';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'features', component: FeaturesComponent },
  { path: 'about', component: AboutComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'support', component: SupportComponent },
  { path: '**', redirectTo: '' }
];