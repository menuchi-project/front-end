import { HighlightPipe } from './highlight.pipe';
import { DomSanitizer } from '@angular/platform-browser';

describe('HighlightPipe', () => {
  let pipe: HighlightPipe;
  let mockSanitizer: DomSanitizer;

  beforeEach(() => {
    mockSanitizer = {
      bypassSecurityTrustHtml: (value: string) => value,
    } as unknown as DomSanitizer;
    pipe = new HighlightPipe(mockSanitizer);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('should return the original text if searchTerm is empty', () => {
    const text = 'Hello world';
    const searchTerm = '';
    expect(pipe.transform(text, searchTerm)).toBe(text);
  });

  it('should return the original text if text is empty', () => {
    const text = '';
    const searchTerm = 'test';
    expect(pipe.transform(text, searchTerm)).toBe(text);
  });

  it('should highlight the searchTerm in the text', () => {
    const text = 'This is a test string for highlighting.';
    const searchTerm = 'test';
    const expected =
      'This is a <span class="highlight">test</span> string for highlighting.';
    expect(pipe.transform(text, searchTerm)).toBe(expected);
  });

  it('should handle multiple occurrences of the searchTerm', () => {
    const text = 'test test test string.';
    const searchTerm = 'test';
    const expected =
      '<span class="highlight">test</span> <span class="highlight">test</span> <span class="highlight">test</span> string.';
    expect(pipe.transform(text, searchTerm)).toBe(expected);
  });

  it('should be case-insensitive', () => {
    const text = 'Hello World';
    const searchTerm = 'world';
    const expected = 'Hello <span class="highlight">World</span>';
    expect(pipe.transform(text, searchTerm)).toBe(expected);
  });

  it('should handle special characters in searchTerm', () => {
    const text = 'What about (parentheses)?';
    const searchTerm = '(parentheses)';
    const expected = 'What about <span class="highlight">(parentheses)</span>?';
    expect(pipe.transform(text, searchTerm)).toBe(expected);
  });
});
