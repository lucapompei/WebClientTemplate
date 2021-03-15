import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Pipe used to sanitize the dom
 */
@Pipe({
  name: 'safeContent'
})
export class SafeContentPipe implements PipeTransform {

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  /**
   * Secures the unsafe content
   *
   * @param value
   * @param args
   */
  transform(value: any, args?: any): any {
    return this.sanitizer.bypassSecurityTrustUrl(value);
  }

}
