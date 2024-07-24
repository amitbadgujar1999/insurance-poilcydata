import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-policy-form',
  templateUrl: './policy-form.component.html',
  styleUrls: ['./policy-form.component.css']
})
export class PolicyFormComponent implements OnInit {
  policyModel = {
    policyNumber: '', // Will be set dynamically
    firstName: '',
    lastName: '',
    insuranceAmount: 0,
    Premium: 0,
    policyStartDate: '',
    policyEndDate: ''
  };

  private policyCount: number = 0; // Counter for policy number generation
  isPolicySubmitted: boolean = false; // Flag to track if policy has been submitted

  constructor(private sharedService: SharedService, private dataService: DataService) {}

  ngOnInit() {
    // Initialize insuranceAmount and Premium from SharedService
    this.policyModel.insuranceAmount = this.sharedService.getCoverage();
    this.policyModel.Premium = this.sharedService.getPremium();

    // Generate and set a unique policy number
    this.policyModel.policyNumber = this.generatePolicyNumber();
  }

  generatePolicyNumber(): string {
    this.policyCount++; // Increment policy count
    return `POL${String(this.policyCount).padStart(2, '0')}`; // Format policy number as POL01, POL02, etc.
  }

  onSubmit() {
    // Use policyNumber as ID
    const policyWithId = { ...this.policyModel, id: this.policyModel.policyNumber };

    // Save policy data using DataService
    this.dataService.savePolicy(policyWithId).subscribe(response => {
      console.log('Policy saved successfully', response);
      // Set flag to hide policy number after submission
      this.isPolicySubmitted = true;
      
      // Reset the form after successful submission
      this.resetForm();
    }, error => {
      console.error('Error saving policy', error);
      // Optionally, handle the error (e.g., show an error message)
    });
  }

  resetForm() {
    // Clear form fields and generate a new policy number
    this.policyModel = {
      policyNumber: this.generatePolicyNumber(), // Generate a new policy number
      firstName: '',
      lastName: '',
      insuranceAmount: this.sharedService.getCoverage(), // Reinitialize values
      Premium: this.sharedService.getPremium(),
      policyStartDate: '',
      policyEndDate: ''
    };

    // Reset the submission flag
    this.isPolicySubmitted = false;
  }
}
