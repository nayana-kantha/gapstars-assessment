import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  selector: 'lib-card',
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  readonly cardData = input<Record<string, Omit<Company, 'industries'>[]>>();
}
