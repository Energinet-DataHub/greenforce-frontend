import { trigger, style, animate, transition } from '@angular/animations';

export const dhValueChangeAnimationTrigger = [
  trigger('valueChange', [
    transition('* => *', [style({ transform: 'translateX(30px)', opacity: 0 }), animate(250)]),
  ]),
];
