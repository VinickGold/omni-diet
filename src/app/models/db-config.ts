import { importProvidersFrom } from '@angular/core';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';

export const dbConfig: DBConfig = {
  name: 'NutriAppDB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'profile',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [],
    },
    // {
    //   store: 'water',
    //   storeConfig: { keyPath: 'id', autoIncrement: true },
    //   storeSchema: [
    //     { name: 'date', keypath: 'date', options: { unique: false } },
    //     { name: 'time', keypath: 'time', options: { unique: false } },
    //   ],
    // },
    // {
    //   store: 'exerciseHistory',
    //   storeConfig: { keyPath: 'id', autoIncrement: true },
    //   storeSchema: [
    //     { name: 'date', keypath: 'date', options: { unique: false } },
    //     { name: 'name', keypath: 'name', options: { unique: false } },
    //   ],
    // },
    // {
    //   store: 'workouts',
    //   storeConfig: { keyPath: 'id', autoIncrement: true },
    //   storeSchema: [{ name: 'name', keypath: 'name', options: { unique: false } }],
    // },
    // {
    //   store: 'nutritionPlan',
    //   storeConfig: { keyPath: 'id', autoIncrement: true },
    //   storeSchema: [{ name: 'day', keypath: 'day', options: { unique: false } }],
    // },
    {
      store: 'foods',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'description', keypath: 'description', options: { unique: false } },
        { name: 'calories', keypath: 'calories', options: { unique: false } },
        { name: 'updatedAt', keypath: 'updatedAt', options: { unique: false } },
      ],
    }
  ],
};
