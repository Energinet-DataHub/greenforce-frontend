import { environment } from './environment.mocked';

describe('Mocked environment config', () => {
  it('should have production set to false', () => {
    expect(environment.production).toBe(false);
  });

  it('should have authDisabled set to false', () => {
    expect(environment.authDisabled).toBe(false);
  });
});
