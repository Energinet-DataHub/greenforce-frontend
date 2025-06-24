import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { dayjs } from '@energinet-datahub/watt/date';
import { FormGroup, FormControl } from '@angular/forms';
import {
  getWeekDropDownOptions,
  getMonthDropDownOptions,
  getYearDropDownOptions,
  startDateCannotBeAfterEndDate,
  getMonthFromName,
  getWeekRange,
  getMonthRange,
  getYearRange,
  months,
  thisYear,
} from './report-dates.helper';

describe('Report Dates Helper', () => {
  let translocoService: jest.Mocked<TranslocoService>;

  beforeEach(() => {
    translocoService = {
      translate: jest.fn((key: string) => key),
    } as unknown as jest.Mocked<TranslocoService>;

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
      const options = getMonthDropDownOptions(thisYear - 1, translocoService);
      expect(translocoService.translate).toHaveBeenCalledWith('months.january');
    });
  });

  describe('getYearDropDownOptions', () => {
    it('should return last 6 years', () => {
      const options = getYearDropDownOptions();
      expect(options.length).toBe(6);
      expect(options[0].value).toBe(thisYear.toString());
      expect(options[5].value).toBe((thisYear - 5).toString());
    });
  });

  describe('startDateCannotBeAfterEndDate', () => {
    it('should return null when dates are valid', () => {
      const form = new FormGroup({
        startDate: new FormControl(dayjs().subtract(1, 'day').toDate()),
        endDate: new FormControl(dayjs().toDate()),
      });
      expect(startDateCannotBeAfterEndDate()(form)).toBeNull();
    });

    it('should return null when dates are missing', () => {
      const form = new FormGroup({
        startDate: new FormControl(null),
        endDate: new FormControl(null),
      });
      expect(startDateCannotBeAfterEndDate()(form)).toBeNull();
    });

    it('should return error when start date is after end date', () => {
      const form = new FormGroup({
        startDate: new FormControl(dayjs().add(1, 'day').toDate()),
        endDate: new FormControl(dayjs().toDate()),
      });
      expect(startDateCannotBeAfterEndDate()(form)).toEqual({ dateRange: true });
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
      const currentWeek = dayjs().week().toString();
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
      expect(dayjs(result.endDate).year()).toBe(2020);
    });
  });
});
