import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'eo-announcement-bar',
  encapsulation: ViewEncapsulation.None,
  styles: `
    :root {
      --eo-announcement-bar-animation-duration: 1s;
    }

    eo-announcement-bar {
      align-items: center;
      display: flex;
      min-height: 44px;
      padding: var(--watt-space-s);
      text-align: center;
      justify-content: center;
      animation: highlightAnnouncementBar var(--eo-announcement-bar-animation-duration) forwards;
    }

    eo-announcement-bar a {
      animation: animateLinkColor var(--eo-announcement-bar-animation-duration) forwards;
    }

    eo-announcement-bar p,
    eo-announcement-bar a {
      font-size: 0.75rem !important;
      line-height: 1.375rem !important;
    }

    @keyframes animateLinkColor {
      0%,
      50% {
        color: var(--watt-color-primary-darker-contrast);
      }
      100% {
        color: var(--watt-typography-link-color);
      }
    }

    @keyframes highlightAnnouncementBar {
      0%,
      50% {
        background: var(--watt-color-primary-darker);
        color: var(--watt-color-primary-darker-contrast);
      }
      100% {
        background: var(--watt-color-primary-ultralight);
        color: var(--watt-color-primary-ultralight-contrast);
      }
    }
  `,
  template: `<p role="alert" [innerHTML]="announcement"></p>`,
})
export class EoAnnouncementBarComponent {
  @Input() announcement!: string;
}
