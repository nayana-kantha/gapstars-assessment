import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CardComponent } from '@platform/ui';
import { ApiService } from '@platform/api';
import { catchError, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface Industry {
  name: string;
}

interface Company {
  name: string;
  uuid: string;
  tagline: string;
  total_jobs_available: number;
  industries: Industry[];
  images?: string;
}

@Component({
  selector: 'app-home',
  imports: [CardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  readonly apiService = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);

  companies = signal<Record<string, Omit<Company, 'industries'>[]>>({});

  ngOnInit() {
    this.getCompanies();
  }

  private getCompanies() {
    this.apiService
      .getCompanies()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          console.error('Error fetching companies:', err);
          return of([]);
        })
      )
      .subscribe((data) => {
        const groupedCompanies = this.groupCompaniesByIndustry(
          data as Company[]
        );
        this.companies.set(groupedCompanies);
      });
  }

  private groupCompaniesByIndustry(
    companies: Company[]
  ): Record<string, Omit<Company, 'industries'>[]> {
    return companies.reduce((acc, company) => {
      company.industries.forEach((industry) => {
        if (!acc[industry.name]) {
          acc[industry.name] = [];
        }
        acc[industry.name].push({
          name: company.name,
          uuid: company.uuid,
          tagline: company.tagline,
          total_jobs_available: company.total_jobs_available,
          images:
            (company.images as unknown as Record<string, string>)?.['32x32'] ||
            '',
        });
      });
      return acc;
    }, {} as Record<string, Omit<Company, 'industries'>[]>);
  }
}
