import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';

import { SampleRender } from '../../site-content';

@Component({
  selector: 'app-image-slideshow',
  templateUrl: './image-slideshow.html',
  styleUrl: './image-slideshow.css'
})
export class ImageSlideshowComponent {
  @Input({ required: true }) samples: SampleRender[] = [];

  @ViewChild('expandedDialog') private readonly expandedDialog?: ElementRef<HTMLDialogElement>;

  protected currentSampleIndex = 0;

  protected get currentSample(): SampleRender | undefined {
    return this.samples[this.currentSampleIndex];
  }

  protected showPreviousSample(): void {
    this.currentSampleIndex = this.getWrappedSampleIndex(this.currentSampleIndex - 1);
  }

  protected showNextSample(): void {
    this.currentSampleIndex = this.getWrappedSampleIndex(this.currentSampleIndex + 1);
  }

  protected openExpandedImage(): void {
    const dialog = this.expandedDialog?.nativeElement;

    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }

  protected closeExpandedImage(): void {
    const dialog = this.expandedDialog?.nativeElement;

    if (dialog?.open) {
      dialog.close();
    }
  }

  protected closeExpandedImageFromBackdrop(event: MouseEvent): void {
    if (event.target === this.expandedDialog?.nativeElement) {
      this.closeExpandedImage();
    }
  }

  @HostListener('document:keydown.escape')
  protected closeExpandedImageWithKeyboard(): void {
    this.closeExpandedImage();
  }

  private getWrappedSampleIndex(index: number): number {
    if (this.samples.length === 0) {
      return 0;
    }

    return (index + this.samples.length) % this.samples.length;
  }
}
