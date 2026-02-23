import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripHtml',
  standalone: true 
})
export class StripHtmlPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    // Removes HTML tags and replaces common entities like &nbsp;
    return value.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  }
}