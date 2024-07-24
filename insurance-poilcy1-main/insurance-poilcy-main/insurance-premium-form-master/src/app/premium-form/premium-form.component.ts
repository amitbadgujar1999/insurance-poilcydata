import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-premium-form',
  templateUrl: './premium-form.component.html',
  styleUrls: ['./premium-form.component.css']
})
export class PremiumFormComponent {

  adminIdValue: string = '';
  formModel = {
    firstName: '',
    lastName: '',
    birthday: '',
    gender: '',
    phoneNumber: '',
    smoking: false,
    alcohol: false,
    tobacco: false,
    plan: {
      tobacco: false,
      smoking: false,
      alcohol: false
    },
    age: 0,
    basePremium: 8000, // Example base premium amount
    calculatedPremium: {
      '1years': 0,
      '2years': 0,
      '3years': 0,
      '5years': 0
    } as { [key: string]: number },
    policyDuration: 1,
    insuranceAmount: 100000 // Example insurance amount
  };
  calculatedPremiumForSelectedDuration: number | null = null;

  constructor(private router: Router, private sharedService: SharedService) {}

  onSubmit() {
    this.calculateAge();
    this.calculatePremium();
    this.displaySelectedDurationPremium();
    this.sharedService.setPremium(this.calculatedPremiumForSelectedDuration || 0);
    this.sharedService.setCoverage(this.formModel.insuranceAmount);
    // No need to call displayPremium here; it's handled in the template
  }

  calculateAge() {
    const today = new Date();
    const birthDate = new Date(this.formModel.birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    this.formModel.age = age;
  }

  calculatePremium() {
    const basePremium = this.formModel.basePremium;
    const insuranceAmount = this.formModel.insuranceAmount;

    if (insuranceAmount < 100000) {
      alert('Insurance amount must be at least $100,000.');
      return;
    }

    // Calculate premiums for different durations
    this.formModel.calculatedPremium['1years'] = this.calculatePremiumForDuration(1);
    this.formModel.calculatedPremium['2years'] = this.calculatePremiumForDuration(2);
    this.formModel.calculatedPremium['3years'] = this.calculatePremiumForDuration(3);
    this.formModel.calculatedPremium['5years'] = this.calculatePremiumForDuration(5);

    // Apply habit-based adjustments for specified durations
    const selectedDuration = this.formModel.policyDuration.toString() + 'years'; // Convert selected duration to string

    if (this.formModel.plan.tobacco && selectedDuration !== '1years') {
      this.applyHabitPremium(1.18, ['2years', '3years', '5years']);
    }
    if (this.formModel.plan.smoking && selectedDuration !== '1years') {
      this.applyHabitPremium(1.23, ['2years', '3years', '5years']);
    }
    if (this.formModel.plan.alcohol && selectedDuration !== '1years') {
      this.applyHabitPremium(1.12, ['2years', '3years', '5years']);
    }

    // Apply age-based adjustments
    this.applyAgeDiscount(this.getAgeFactor(this.formModel.age));

    // Apply insurance amount-based adjustments
    this.applyInsuranceAmountPremium(insuranceAmount);
  }

  calculatePremiumForDuration(years: number): number {
    const basePremium = this.formModel.basePremium;
    const factor = this.getPremiumFactor(years);
    return basePremium * factor;
  }

  getPremiumFactor(years: number): number {
    switch (years) {
      case 1:
        return 1.0;
      case 2:
        return 0.95;
      case 3:
        return 0.90;
      case 5:
        return 0.85;
      default:
        return 1.0;
    }
  }

  getAgeFactor(age: number): number {
    if (age < 25) return 1.2;
    if (age >= 25 && age <= 35) return 1.0;
    if (age >= 36 && age <= 45) return 1.1;
    return 1.3;
  }

  applyAgeDiscount(factor: number) {
    for (const duration in this.formModel.calculatedPremium) {
      if (Object.prototype.hasOwnProperty.call(this.formModel.calculatedPremium, duration)) {
        this.formModel.calculatedPremium[duration] *= factor;
      }
    }
  }

  applyHabitPremium(factor: number, durations: string[]) {
    durations.forEach(duration => {
      if (this.formModel.calculatedPremium[duration]) {
        this.formModel.calculatedPremium[duration] *= factor;
      }
    });
  }

  applyInsuranceAmountPremium(amount: number) {
    const baseAmount = 100000; // Minimum insurance amount
    const factor = amount / baseAmount; // Calculate premium adjustment factor based on insurance amount

    for (const duration in this.formModel.calculatedPremium) {
      if (Object.prototype.hasOwnProperty.call(this.formModel.calculatedPremium, duration)) {
        this.formModel.calculatedPremium[duration] *= factor;
      }
    }
  }

  displaySelectedDurationPremium() {
    const selectedDuration = this.formModel.policyDuration.toString() + 'years';
    this.calculatedPremiumForSelectedDuration = this.formModel.calculatedPremium[selectedDuration];
  }

  proceedForPolicyForm() {
    this.router.navigate(['/policy-form']);
  }
  proceedForclaimForm() {
    this.router.navigate(['/claim-form']);
  }
}
