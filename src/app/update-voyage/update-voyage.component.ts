import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { voyage } from '../model/voyage.model'; 
import { voyageService } from '../services/voyage.service'; 
import { Categorie } from '../model/categorie.model';

@Component({
  selector: 'app-update-voyage',
  templateUrl: './update-voyage.component.html',
})
export class UpdateVoyageComponent implements OnInit {
  currentVoyage = new voyage();
  categories!: Categorie[]; // List of categories
  updatedCatId!: number; // ID of the selected category for update

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private voyageService: voyageService
  ) {}

  ngOnInit(): void {
    // Fetch list of categories from the backend
    this.voyageService.listeCategories().subscribe(
      (cats) => {
        console.log("API Response:", cats);
        // Ensure correct data structure mapping
        this.categories = cats._embedded?.cats || []; 
        console.log("Categories fetched:", this.categories);
      },
      (error) => {
        console.error("Error fetching categories:", error);
      }
    );
  
    // Fetch the voyage details based on the ID passed in the URL
    this.voyageService
      .consultervoyage(this.activatedRoute.snapshot.params['id'])
      .subscribe(
        (voy) => {
          this.currentVoyage = voy; // Bind the fetched voyage to `currentVoyage`
          this.updatedCatId = this.currentVoyage.categorie?.idCat || 0; // Set the current category ID
          console.log('Voyage fetched:', this.currentVoyage);
        },
        (error) => {
          console.error('Error fetching voyage:', error);
        }
      );
  }

  updatevoyage() {
    // Ensure the selected category is assigned to the voyage before updating
    this.currentVoyage.categorie = this.categories.find(cat => cat.idCat === this.updatedCatId)!;

    console.log('Voyage to be updated:', this.currentVoyage);

    // Call the service to update the voyage
    this.voyageService.updatevoyage(this.currentVoyage).subscribe(
      () => {
        console.log('Voyage updated successfully');
        this.router.navigate(['voyages']); // Redirect to the voyages list after update
      },
      (error) => {
        console.error('Error during update:', error);
      }
    );
  }
}
