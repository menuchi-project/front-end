import { JoinNonEmptyPipe } from './join-non-empty.pipe';

describe('JoinNonEmptyPipe', () => {
  it('create an instance', () => {
    const pipe = new JoinNonEmptyPipe();
    expect(pipe).toBeTruthy();
  });
});
