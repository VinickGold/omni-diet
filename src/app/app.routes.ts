import { RouterModule, Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule

import { AppComponent } from './app.component';
import { WaterIntakeComponent } from './components/water-intake/water-intake.component';
import { MealPlanComponent } from './components/meal-plan/meal-plan.component';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';
import { ExercicesComponent } from './components/workout-log/exercices.component';
import { HomeComponent } from './components/home/home.component';
import { ImportFoodComponent } from './components/import-food/import-food.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ExerciseTrackerComponent } from './components/exercice-tracker/exercice-tracker.component';
import { FoodSubstitutionComponent } from './components/food-substitution/food-substitution.component';
import { LoginPage } from './components/login/login.component';
import { LoginRedirectGuard } from './guards/login-redirect.guard';
import { AuthGuard } from './guards/auth.guard';
import { MainLayoutComponent } from './components/frame/frame.component';
import { RecordViewerComponent } from './components/record-viewer/record-viewer.component';
import { RecordMealEditorComponent } from './components/record-meal-editor/record-meal-editor.component';



export const routes: Routes = [
  { path: 'login', component: LoginPage, canActivate: [LoginRedirectGuard] },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'meal-plan',
        component: MealPlanComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Plano Alimentar',
          description: 'Acompanhe o plano alimentar criado pelo seu Nutri.'
        }
      },
      {
        path: 'record-meal-editor',
        component: RecordMealEditorComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Registrar refeição',
          description: ''
        }
      },
      {
        path: 'shopping-list',
        component: ShoppingListComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Lista de Compras',
          description: 'Organize suas compras com base no plano alimentar.'
        }
      },
      {
        path: 'water-intake',
        component: WaterIntakeComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Ingestão de Água',
          description: 'Monitore sua ingestão diária de água.'
        }
      },
      {
        path: 'exercices',
        component: ExercicesComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Ficha de treino',
          description: 'Registre seu treino e aumente as cargas'
        }
      },
      {
        path: 'import-food',
        component: ImportFoodComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Importar Alimentos',
          description: 'Busque alimentos para o aplicativo.'
        }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Perfil',
          description: 'Preencha seus dados e confira suas necessidades diárias'
        }
      },
      {
        path: 'tracker',
        component: ExerciseTrackerComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Exercicios',
          description: 'Registre seus exercicios e gasto calórico'
        }
      },
      {
        path: 'record-viewer',
        component: RecordViewerComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Recordatório',
          description: 'Veja seu histórico de refeições registradas'
        }
      },
      {
        path: 'food-substitution',
        component: FoodSubstitutionComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Substituições Alimentares',
          description: 'Encontre alternativas para os alimentos da sua dieta'
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

      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  // catch-all (opcional)
  { path: '**', redirectTo: '/login' }
];

// bootstrapApplication(AppComponent, {
//   providers: [
//     provideRouter(routes),
//     //RouterModule,
//     importProvidersFrom(FormsModule)  
//   ]
// });