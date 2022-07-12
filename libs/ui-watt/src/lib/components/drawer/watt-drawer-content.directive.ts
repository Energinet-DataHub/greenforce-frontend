import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[wattDrawerContent]',
})
export class WattDrawerContentDirective {
  constructor(public tpl: TemplateRef<unknown>) {}
}
