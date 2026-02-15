import { CustomDatePipe } from "./custom-date-pipe";

describe('customDate', () => {
  it('create an instance', () => {
    const pipe = new CustomDatePipe();
    expect(pipe).toBeTruthy();
  });
});
