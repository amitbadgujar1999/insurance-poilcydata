import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-policy-form',
  templateUrl: './policy-form.component.html',
  styleUrls: ['./policy-form.component.css']
})
export class PolicyFormComponent {
  policyModel = {
    policyNumber: '',
    firstName: '',
    lastName: '',
    insuranceCoverage: '',
    insurancePremium: 0,
    policyStartDate: '',
    policyEndDate: ''
  };
  isPolicySubmitted = false;
  submittedPolicyNumber = '';

  constructor(private dataService: DataService, private router: Router) {}

  onSubmit(): void {
    const generatedId = this.generatePolicyNumber();
    const policyData = { ...this.policyModel, id: generatedId, policyNumber: generatedId };

    this.dataService.savePolicy(policyData).subscribe(response => {
      console.log('Policy saved successfully', response);
      this.submittedPolicyNumber = policyData.policyNumber; // Set the submitted policy number
      this.isPolicySubmitted = true; // Show success message
    }, error => {
      console.error('Error saving policy', error);
    });
  }

  generatePolicyNumber(): string {
    // Generate and return policy number
    return `POL${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  }
}
