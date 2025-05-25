import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
  standalone: true,
})
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(text: string, searchTerm: string = ''): SafeHtml {
    if (!searchTerm || !text) {
      return this.sanitizer.bypassSecurityTrustHtml(text);
    }
    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');
    const highlightedText = text.replace(
      regex,
      '<span class="highlight">$&</span>',
    );
    return this.sanitizer.bypassSecurityTrustHtml(highlightedText);
  }
}
