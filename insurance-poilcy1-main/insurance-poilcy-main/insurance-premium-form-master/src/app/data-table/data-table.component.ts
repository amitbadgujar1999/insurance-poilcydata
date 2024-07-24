import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DataService } from '../data.service';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  users: any[] = [];
  paginatedUsers: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  loading: boolean = true;

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.dataService.getUsers().subscribe({
      next: (users) => {
        this.users = users || [];
        this.fetchClaimDetails();
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.users = [];
        this.paginatedUsers = [];
        this.loading = false;
      }
    });
  }

  fetchClaimDetails(): void {
    const claimDetailsRequests = this.users.map(user =>
      this.dataService.getClaimDetails1(user.policyNumber)
    );

    forkJoin(claimDetailsRequests).subscribe({
      next: (claimDetailsArray) => {
        claimDetailsArray.forEach((claimDetails, index) => {
          this.users[index].claimDetails = claimDetails.length ? claimDetails[0] : {};
        });
        this.paginateUsers();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching claim details:', err);
        this.users.forEach(user => user.claimDetails = {});
        this.paginateUsers();
        this.loading = false;
      }
    });
  }

  sortBy(key: string, order: 'asc' | 'desc'): void {
    if (this.users && this.users.length > 0) {
      this.users.sort((a, b) => {
        const compareA = a[key];
        const compareB = b[key];
        if (order === 'asc') {
          return compareA > compareB ? 1 : compareA < compareB ? -1 : 0;
        } else {
          return compareA < compareB ? 1 : compareA > compareB ? -1 : 0;
        }
      });
      this.paginateUsers();
    }
  }

  paginateUsers(): void {
    if (this.users) {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      this.paginatedUsers = this.users.slice(start, end);
    } else {
      this.paginatedUsers = [];
    }
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.users.length / this.itemsPerPage);
    return Array(totalPages).fill(0).map((_, i) => i + 1);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.getPageNumbers().length) {
      this.currentPage = page;
      this.paginateUsers();
    }
  }

  viewPolicyDetails(policyNumber: string): void {
    this.router.navigate(['/policy-details', policyNumber]);
  }
}
