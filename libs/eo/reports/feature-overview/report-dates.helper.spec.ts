import { vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { dayjs } from '@energinet-datahub/watt/date';
import {
  getMonthDropDownOptions,
  getMonthFromName,
  getMonthRange,
  getWeekDropDownOptions,
  getWeekRange,
  getYearRange,
  months,
  thisYear,
} from './report-dates.helper';

describe('Report Dates Helper', () => {
  let translocoService: TranslocoService;

  beforeEach(() => {
    translocoService = {
      translate: vi.fn((key: string) => key),
    } as unknown as TranslocoService;

    TestBed.configureTestingModule({
      providers: [{ provide: TranslocoService, useValue: translocoService }],
    });
  });

  describe('getWeekDropDownOptions', () => {
    it('should return all weeks when year is less than current year', () => {
      const options = getWeekDropDownOptions(thisYear - 1);
      expect(options.length).toBe(52);
    });

    it('should return only past weeks when year is current year', () => {
      const options = getWeekDropDownOptions(thisYear);
      expect(options.length).toBeLessThanOrEqual(52);
      expect(options.length).toBeGreaterThan(0);
    });

    it('should format week options correctly', () => {
      const options = getWeekDropDownOptions(thisYear - 1);
      expect(options[0]).toEqual({
        value: '1',
        displayValue: '1',
      });
    });
  });

  describe('getMonthDropDownOptions', () => {
    it('should return all months when year is less than current year', () => {
      const options = getMonthDropDownOptions(thisYear - 1, translocoService);
      expect(options.length).toBe(12);
    });

    it('should return only past months when year is current year', () => {
      const options = getMonthDropDownOptions(thisYear, translocoService);
      expect(options.length).toBeLessThanOrEqual(12);
      expect(options.length).toBeGreaterThan(0);
    });

    it('should translate month names', () => {
      getMonthDropDownOptions(thisYear - 1, translocoService);
      expect(translocoService.translate).toHaveBeenCalledWith('months.january');
    });
  });


  describe('getMonthFromName', () => {
    it('should return correct month index for lowercase input', () => {
      expect(getMonthFromName('january')).toBe(0);
      expect(getMonthFromName('december')).toBe(11);
    });

    it('should return correct month index for uppercase input', () => {
      expect(getMonthFromName('JANUARY')).toBe(0);
      expect(getMonthFromName('DECEMBER')).toBe(11);
    });

    it('should return -1 for invalid month', () => {
      expect(getMonthFromName('invalid')).toBe(-1);
    });
  });

  describe('getWeekRange', () => {
    it('should return correct range for past week', () => {
      const result = getWeekRange('1', (thisYear - 1).toString());
      expect(result.startDate).toBeLessThan(result.endDate);
    });

    it('should limit end date to today for current week', () => {
      const currentWeek = dayjs().isoWeek().toString();
      const result = getWeekRange(currentWeek, thisYear.toString());
      expect(result.endDate).toBeLessThanOrEqual(dayjs().valueOf());
    });
  });

  describe('getMonthRange', () => {
    it('should return correct range for past month', () => {
      const result = getMonthRange('january', (thisYear - 1).toString());
      expect(result.startDate).toBeLessThan(result.endDate);
    });

    it('should handle current month', () => {
      const currentMonth = months[dayjs().month()];
      const result = getMonthRange(currentMonth, thisYear.toString());
      expect(result.endDate).toBeLessThanOrEqual(dayjs().valueOf());
    });

    it('should adjust year for future months', () => {
      const futureMonth = months[(dayjs().month() + 2) % 12];
      const result = getMonthRange(futureMonth, thisYear.toString());
      expect(result.startDate).toBeLessThan(dayjs().valueOf());
    });
  });

  describe('getYearRange', () => {
    it('should return correct range for past year', () => {
      const result = getYearRange((thisYear - 1).toString());
      expect(result.startDate).toBeLessThan(result.endDate);
    });

    it('should limit end date to today for current year', () => {
      const result = getYearRange(thisYear.toString());
      expect(result.endDate).toBeLessThanOrEqual(dayjs().valueOf());
    });

    it('should handle year as string input', () => {
      const result = getYearRange('2020');
      expect(dayjs(result.startDate).year()).toBe(2020);
      // End date should be the minimum of start of 2021 or current date
      // So it could be in 2020 or 2021 depending on when the test runs
      expect(dayjs(result.endDate).year()).toBeGreaterThanOrEqual(2020);
      expect(dayjs(result.endDate).year()).toBeLessThanOrEqual(2021);
    });
  });
});
