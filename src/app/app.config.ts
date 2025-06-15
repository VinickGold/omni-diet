import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { createClient , SupabaseClient } from '@supabase/supabase-js';
import { routes } from './app.routes';
import { provideIndexedDb } from 'ngx-indexed-db';
import { dbConfig } from './models/db-config'
import { environment } from './../env/environment'
import { FormsModule } from '@angular/forms';
import { provideServiceWorker } from '@angular/service-worker';

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);



export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    importProvidersFrom(FormsModule),
    provideIndexedDb(dbConfig),
    { provide: SupabaseClient, useValue: supabase }, 
    provideServiceWorker('ngsw-worker.js', {enabled: !isDevMode(), registrationStrategy: 'registerWhenStable:30000'})
  ]
};
