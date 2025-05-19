import { RouterModule, Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule

import { AppComponent } from './app.component';
import { WaterIntakeComponent } from './components/water-intake/water-intake.component';
import { MealPlanComponent } from './components/meal-plan/meal-plan.component';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';
import { ExercicesComponent } from './components/exercices/exercices.component';
import { HomeComponent } from './components/home/home.component';
import { ImportFoodComponent } from './components/import-food/import-food.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ExerciseTrackerComponent } from './components/exercice-tracker/exercice-tracker.component';
import { FoodSubstitutionComponent } from './components/food-substitution/food-substitution.component';
import { LoginPage } from './components/login/login.component';
import { LoginRedirectGuard } from './guards/login-redirect.guard';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
   {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'meal-plan',
    component: MealPlanComponent,
    data: {
      title: 'Plano Alimentar',
      description: 'Acompanhe o plano alimentar criado pelo seu Nutri.'
    }
  },
  {
    path: 'shopping-list',
    component: ShoppingListComponent,
    data: {
      title: 'Lista de Compras',
      description: 'Organize suas compras com base no plano alimentar.'
    }
  },
  {
    path: 'water-intake',
    component: WaterIntakeComponent,
    data: {
      title: 'Ingestão de Água',
      description: 'Monitore sua ingestão diária de água.'
    }
  },
  {
    path: 'exercices',
    component: ExercicesComponent,
    data: {
      title: 'Ficha de treino',
      description: 'Registre seu treino e aumente as cargas'
    }
  },
  {
    path: 'import-food',
    component: ImportFoodComponent,
    data: {
      title: 'Importar Alimentos',
      description: 'Busque alimentos para o aplicativo.'
    }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: {
      title: 'Perfil',
      description: 'Preencha seus dados e confira suas necessidades diárias'
    }
  },
  {
    path: 'tracker',
    component: ExerciseTrackerComponent,
    data: {
      title: 'Exercicios',
      description: 'Registre seus exercicios e gasto calórico'
    }
  },
  {
    path: 'food-substitution',
    component: FoodSubstitutionComponent,
    data: {
      title: 'Substituições Alimentares',
      description: 'Encontre alternativas para os alimentos da sua dieta'
    }
  },
  {
    path: 'login',
    component: LoginPage,
    canActivate: [LoginRedirectGuard],
    data: {
      title: 'Login',
      description: 'Login'
    }
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Omni Diet',
      description: 'Sua saúde em um só lugar'
    }
  }

    
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    //RouterModule,
    importProvidersFrom(FormsModule),
  ],
});