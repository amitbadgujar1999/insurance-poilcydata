import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    selectedOption: string = ''; // Initialize selectedOption here

    constructor(private router: Router) {}

    onSubmit() {
        if (this.selectedOption === 'admin') {
            this.router.navigate(['/admin']); // Navigate to AdminComponent
        } else if (this.selectedOption === 'customer') {
            // Handle customer option navigation
            this.router.navigate(['/premium-form']); }
            else if (this.selectedOption === 'doctor') {
                // Handle customer option navigation
                this.router.navigate(['/doctor']); 
        } else {
            console.log('Invalid option');
        }
    }
}
