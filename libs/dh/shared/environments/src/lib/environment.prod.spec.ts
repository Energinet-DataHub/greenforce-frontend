import { environment } from './environment.prod';

describe('Production environment config', () => {
  it('should have production set to true', () => {
    expect(environment.production).toBe(true);
  });

  it('should have authDisabled set to false', () => {
    expect(environment.authDisabled).toBe(false);
  });
});
