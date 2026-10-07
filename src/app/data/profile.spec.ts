import { elapsedSince } from './profile';

describe('elapsedSince', () => {
  it('counts whole calendar units', () => {
    const e = elapsedSince(new Date(2019, 7, 19, 0, 0, 0), new Date(2026, 9, 7, 11, 30, 15));
    expect(e).toEqual({ years: 7, months: 1, days: 18, hours: 11, minutes: 30, seconds: 15 });
  });

  it('borrows days from the previous month', () => {
    const e = elapsedSince(new Date(2024, 0, 31), new Date(2024, 2, 1));
    expect(e.months).toBe(1);
    expect(e.days).toBe(1);
  });
});
