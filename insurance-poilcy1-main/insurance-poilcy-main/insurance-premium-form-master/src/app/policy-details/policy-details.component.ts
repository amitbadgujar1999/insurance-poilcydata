import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
import { DataService } from '../data.service'; // Adjust path as per your service location

@Component({
  selector: 'app-policy-details',
  templateUrl: './policy-details.component.html',
  styleUrls: ['./policy-details.component.css']
})
export class PolicyDetailsComponent implements OnInit {
  policyNumber: string = '';
  policyDetails: any;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Inject Router
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const policyNumberParam = params['policyNumber'];
      if (policyNumberParam) {
        this.policyNumber = policyNumberParam;
        this.loadPolicyDetails();
      } else {
        console.error('Policy number not provided');
        this.loading = false;
      }
    });
  }

  loadPolicyDetails(): void {
    if (this.policyNumber) {
      this.dataService.getPolicyDetails(this.policyNumber).subscribe(
        data => {
          this.policyDetails = data;
          this.loading = false;
        },
        error => {
          console.error('Error fetching policy details:', error);
          this.loading = false;
        }
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/data-table']); // Adjust the route as needed
  }
}
