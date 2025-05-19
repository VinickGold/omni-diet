import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OpenFoodFactsService {
  private apiUrl = 'https://world.openfoodfacts.org/cgi/search.pl';

  constructor(private http: HttpClient) {}

  searchFood(query: string) {
    const params = new HttpParams()
      .set('search_terms', query)
      .set('search_simple', '1')
      .set('action', 'process')
      .set('json', 'true')
      .set('page_size', '10')
      .set('fields', 'product_name,nutriments,image_front_url,nutrition_grades_tags');

    return this.http.get(this.apiUrl, { params });
  }

  
}