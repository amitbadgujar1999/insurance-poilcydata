import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import the Router

@Component({
  selector: 'app-premium-form',
  templateUrl: './premium-form.component.html',
  styleUrls: ['./premium-form.component.css']
})
export class PremiumFormComponent {
  basePremium = 8000;
  insuranceCoverageAmount = 100000; // Default insurance coverage amount
  coverageOptions = [100000, 200000, 300000, 400000, 500000];
  durations = [1, 2, 3, 5];
  premiums: { [key: number]: number } = {};
  selectedDuration = this.durations[0]; // Default duration
  age: number | undefined;
  firstName = '';
  lastName = '';
  phoneNumber = '';
  dateOfBirth: string = '';

  hasTobacco = false;
  hasSmoking = false;
  hasAlcohol = false;

  calculatedPremium: number | null = null; // To hold the calculated premium value

  constructor(private router: Router) { // Inject the Router service
    // No need to calculate premiums in the constructor
  }

  onDateOfBirthChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dateOfBirth = input.value;
    this.calculateAge();
  }

  calculateAge() {
    if (this.dateOfBirth) {
      const birthDate = new Date(this.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        this.age = age - 1;
      } else {
        this.age = age;
      }
    }
  }

  getAgeDiscount(age: number): number {
    if (age >= 20 && age <= 30) {
      return 0.10; // 10% discount
    } else if (age >= 31 && age <= 40) {
      return 0.05; // 5% discount
    } else {
      return 0; // No discount for age 41 and above
    }
  }

  applyBadHabitPremium(premium: number): number {
    let adjustedPremium = premium;
    const habitsCount = [this.hasTobacco, this.hasSmoking, this.hasAlcohol].filter(habit => habit).length;

    if (habitsCount === 1) {
      if (this.hasTobacco) {
        adjustedPremium *= 1.05; // Increase by 5% for tobacco
      }
      if (this.hasSmoking) {
        adjustedPremium *= 1.10; // Increase by 10% for smoking
      }
      if (this.hasAlcohol) {
        adjustedPremium *= 1.07; // Increase by 7% for alcohol
      }
    } else if (habitsCount === 2) {
      adjustedPremium *= 1.12; // Increase by 12% for any two bad habits
    } else if (habitsCount === 3) {
      adjustedPremium *= 1.15; // Increase by 15% for all three bad habits
    }

    return adjustedPremium;
  }

  calculatePremiums() {
    if (this.age === undefined) {
      alert('Please set the age.');
      return;
    }
    const ageDiscount = this.getAgeDiscount(this.age);
    const coverageMultiplier = this.insuranceCoverageAmount / 100000; // Adjust based on coverage amount

    // Calculate premium for each duration
    let premium1Year = this.basePremium * coverageMultiplier;
    let premium2Years = this.basePremium * 2 * coverageMultiplier;
    let premium3Years = this.basePremium * 3 * coverageMultiplier;
    let premium5Years = this.basePremium * 5 * coverageMultiplier;

    // Apply bad habit logic
    premium1Year = this.applyBadHabitPremium(premium1Year);
    premium2Years = this.applyBadHabitPremium(premium2Years);
    premium3Years = this.applyBadHabitPremium(premium3Years);
    premium5Years = this.applyBadHabitPremium(premium5Years);

    // Apply age-based discount
    this.premiums[1] = premium1Year * (1 - ageDiscount);
    this.premiums[2] = premium2Years * (1 - ageDiscount);
    this.premiums[3] = premium3Years * (1 - ageDiscount);
    this.premiums[5] = premium5Years * (1 - ageDiscount);

    // Update the calculated premium based on selected duration
    this.calculatedPremium = this.premiums[this.selectedDuration] || 0;
  }

  onCalculatePremium() {
    this.calculatePremiums();
  }

  getSelectedPremium(): number {
    return this.calculatedPremium || 0;
  }

  navigateToPolicyForm() {
    this.router.navigate(['/policy-form']);
  }

  navigateToClaimForm() {
    this.router.navigate(['/claim-form']);
  }
  navigateTopolicystatuscheck() {
    this.router.navigate(['/policystatuscheck']);
  }
}
