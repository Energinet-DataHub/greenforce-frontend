import { EoGenitivePipe } from "./genitive.pipe";


describe('EoGenitivePipe', () => {
  let pipe: EoGenitivePipe;

  beforeEach(() => {
    pipe = new EoGenitivePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string if value is null or empty', () => {
    expect(pipe.transform(null, 'da')).toBe('');
    expect(pipe.transform('', 'da')).toBe('');
    expect(pipe.transform(null, 'en')).toBe('');
    expect(pipe.transform('', 'en')).toBe('');
  });

  // Danish tests
  it("should correctly add 's' in Danish if the name does not end with 's'", () => {
    expect(pipe.transform('Ranularg', 'da')).toBe('Ranulargs');
    expect(pipe.transform('Apple', 'da')).toBe('Apples');
  });

  it("should correctly add only an apostrophe in Danish if the name ends with 's'", () => {
    expect(pipe.transform('Ranulars', 'da')).toBe('Ranulars\'');
    expect(pipe.transform('SAS', 'da')).toBe('SAS\'');
  });

  // English tests
  it("should correctly add 's' in English if the name does not end with 's'", () => {
    expect(pipe.transform('Ranularg', 'en')).toBe('Ranularg\'s');
    expect(pipe.transform('Google', 'en')).toBe('Google\'s');
  });

  it("should correctly add only an apostrophe in English if the name ends with 's'", () => {
    expect(pipe.transform('Mars', 'en')).toBe('Mars\'');
    expect(pipe.transform('Reuters', 'en')).toBe('Reuters\'');
  });

  // Edge cases
  it('should handle names ending with uppercase S correctly', () => {
    expect(pipe.transform('SAS', 'en')).toBe('SAS\'');
    expect(pipe.transform('SAS', 'da')).toBe('SAS\'');
  });

  it('should return the original value if language is not recognized', () => {
    expect(pipe.transform('Google', 'fr')).toBe('Google'); // assuming 'fr' is not handled
  });
});
