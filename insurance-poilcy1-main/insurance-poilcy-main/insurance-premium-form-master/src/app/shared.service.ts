// src/app/shared.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private premium: number = 0;
  private coverage: number = 0;

  setPremium(premium: number) {
    this.premium = premium;
  }

  getPremium(): number {
    return this.premium;
  }

  setCoverage(coverage: number) {
    this.coverage = coverage;
  }

  getCoverage(): number {
    return this.coverage;
  }
}
