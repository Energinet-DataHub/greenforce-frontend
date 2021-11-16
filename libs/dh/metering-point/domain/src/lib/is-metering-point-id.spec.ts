import { isMeteringPointId } from './is-metering-point-id';

describe(isMeteringPointId.prototype.name, () => {
  it('is valid', () => {
    const _18Digits = '123456789000000000';

    expect(isMeteringPointId(_18Digits)).toBeTruthy();
  });

  describe('NOT valid', () => {
    it('empty string', () => {
      const emptyString = '';

      expect(isMeteringPointId(emptyString)).toBeFalsy();
    });

    it('one digit below valid metering point id length', () => {
      const _17Digits = '12345678900000000';

      expect(isMeteringPointId(_17Digits)).toBeFalsy();
    });

    it('one digit above valid metering point id length', () => {
      const _19Digits = '1234567890000000001';

      expect(isMeteringPointId(_19Digits)).toBeFalsy();
    });

    it('mixed value with letters and digits', () => {
      const lettersAndDigits = 'abc1234567890';

      expect(isMeteringPointId(lettersAndDigits)).toBeFalsy();
    });
  });
});
