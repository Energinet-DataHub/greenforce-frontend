import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { dayjs } from '@energinet-datahub/watt/date';
import { FormGroup, FormControl } from '@angular/forms';
import {
  getWeekDropDownOptions,
  startDateCannotBeAfterEndDate,
  getMonthRange,
} from './report-dates.helper';

describe('Report Dates Helper', () => {
  let translocoService: jest.Mocked<TranslocoService>;

  beforeEach(() => {
    translocoService = {
      translate: jest.fn((key: string) => key),
    } as unknown as jest.Mocked<TranslocoService>;

    TestBed.configureTestingModule({
      providers: [
        {
          provide: TranslocoService,
          useValue: translocoService,
        },
      ],
    });
  });

  describe('getWeekDropDownOptions', () => {
    it('should return correct number of weeks', () => {
      const options = getWeekDropDownOptions();
      const currentWeeksInYear = dayjs().isoWeeksInYear();

      expect(options.length).toBe(currentWeeksInYear);
    });

    it('should format week options correctly', () => {
      const options = getWeekDropDownOptions();
      const currentWeek = dayjs().isoWeek();
      const currentYear = dayjs().year();

      expect(options[0]).toEqual({
        value: currentWeek.toString(),
        displayValue: `${currentWeek} (${currentYear})`,
      });
    });
  });

  describe('startDateCannotBeAfterEndDate', () => {
    it('should return null when dates are valid', () => {
      const form = new FormGroup({
        startDate: new FormControl(dayjs().subtract(1, 'day').toDate()),
        endDate: new FormControl(dayjs().toDate()),
      });

      const result = startDateCannotBeAfterEndDate()(form);
      expect(result).toBeNull();
    });

    it('should return error when start date is after end date', () => {
      const form = new FormGroup({
        startDate: new FormControl(dayjs().toDate()),
        endDate: new FormControl(dayjs().subtract(1, 'day').toDate()),
      });

      const result = startDateCannotBeAfterEndDate()(form);
      expect(result).toEqual({ dateRange: true });
    });
  });

  describe('getMonthRange', () => {
    it('should return correct date range for a past month', () => {
      const result = getMonthRange('january');

      expect(result).toHaveProperty('startDate');
      expect(result).toHaveProperty('endDate');
      expect(result.startDate).toBeLessThan(result.endDate);
    });
  });
});
