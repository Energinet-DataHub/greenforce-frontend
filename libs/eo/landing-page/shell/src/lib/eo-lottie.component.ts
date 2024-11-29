import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import lottie, { AnimationItem } from 'lottie-web';

@Component({
  selector: 'eo-lottie',
  standalone: true,
  template: '<div #lottieContainer [style.width]="width" [style.height]="height"></div>',
})
export class EoLottieComponent implements OnInit, OnDestroy {
  @ViewChild('lottieContainer', { static: true }) lottieContainer!: ElementRef;
  @Input() animationData!: unknown;
  @Input() width = '100%';
  @Input() height = '100%';
  @Input() autoPlay = true;

  private animationInstance!: AnimationItem;

  ngOnInit(): void {
    this.animationInstance = lottie.loadAnimation({
      container: this.lottieContainer.nativeElement,
      renderer: 'svg',
      loop: false,
      autoplay: this.autoPlay,
      animationData: this.animationData,
    });
  }

  ngOnDestroy(): void {
    if (this.animationInstance) {
      this.animationInstance.destroy();
    }
  }

  play(): void {
    this.animationInstance.play();
  }
}
