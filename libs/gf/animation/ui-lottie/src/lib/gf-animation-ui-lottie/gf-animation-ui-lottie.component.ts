import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import lottie, { AnimationItem } from 'lottie-web';

@Component({
  selector: 'gf-animation-ui-lottie',
  standalone: true,
  template: '<div #lottieContainer [style.width]="width" [style.height]="height"></div>',
})
export class GfAnimationUiLottieComponent implements OnInit, OnDestroy {
  @ViewChild('lottieContainer', { static: true }) lottieContainer!: ElementRef;
  @Input() animationData!: unknown;
  @Input() width: string = '100%';
  @Input() height: string = '100%';

  private animationInstance!: AnimationItem;

  ngOnInit(): void {
    this.animationInstance = lottie.loadAnimation({
      container: this.lottieContainer.nativeElement,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: this.animationData,
    });
  }

  ngOnDestroy(): void {
    if (this.animationInstance) {
      this.animationInstance.destroy();
    }
  }
}
