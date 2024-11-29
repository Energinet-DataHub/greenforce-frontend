import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SharedUtilities {
  scrollToAnchor(element: string): void {
    document.getElementById(element)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  isDateActive(startDate: number | undefined, endDate: number | null): boolean {
    if (!startDate) return false;

    const now = new Date().getTime();
    return startDate <= now && (endDate || now) >= now;
  }

  checkForMidnightInLocalTime(inputDate: number | undefined): number {
    if (!inputDate) return 0;

    const date = new Date(inputDate);
    return date.getHours() === 0 ? date.setDate(date.getDate() - 1) : date.getTime();
  }
}
