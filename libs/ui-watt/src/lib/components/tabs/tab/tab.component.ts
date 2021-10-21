import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatTab } from '@angular/material/tabs';

@Component({
  selector: 'watt-tab',
  styleUrls: ['./tab.component.scss'],
  templateUrl: './tab.component.html',
})
export class WattTabComponent implements OnInit {
  @Input() label!: string;

  @ViewChild(MatTab, { static: true, read: ElementRef })
  private matTabElement!: ElementRef<MatTab>;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.removeWrapper();
  }

  private removeWrapper() {
    const parent = this.elementRef.nativeElement.parentNode;
    this.renderer.removeChild(parent, this.elementRef.nativeElement);
    this.renderer.appendChild(parent, this.matTabElement.nativeElement);
  }
}
