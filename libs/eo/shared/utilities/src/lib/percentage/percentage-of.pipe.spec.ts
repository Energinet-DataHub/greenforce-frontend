
import { PercentageOfPipe } from './percentage-of.pipe';

describe('PercentageOfPipe', () => {
  let pipe: PercentageOfPipe;

  beforeEach(() => {
    pipe = new PercentageOfPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the correct percentage value', () => {
    const value = 50;
    const total = 200;
    const result = pipe.transform(value, total);
    expect(result).toBe('25%');
  });

  it('should return 0% if the total is 0', () => {
    const value = 50;
    const total = 0;
    const result = pipe.transform(value, total);
    expect(result).toBe('0%');
  });

  it('should return 100% if the value is equal to the total', () => {
    const value = 100;
    const total = 100;
    const result = pipe.transform(value, total);
    expect(result).toBe('100%');
  });

  it('should round the percentage value to 0 decimal places', () => {
    const value = 1;
    const total = 3;
    const result = pipe.transform(value, total);
    expect(result).toBe('33%');
  });
});
