import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { InstallerInfoService } from './installer-info.service';
import {
  BANNER_IMAGE_PATHS,
  BANNER_SLIDE_POSITIONS,
  BANNER_TAGS,
  BannerSlide,
  NAV_ITEMS,
  buildImageSequence
} from './site-content';
import { TerrainBackgroundRenderer } from './utils/terrain-background-renderer';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit, OnDestroy {
  @ViewChild('terrainBackground') private readonly terrainBackground?: ElementRef<HTMLCanvasElement>;
  @ViewChild('siteScale') private readonly siteScale?: ElementRef<HTMLElement>;
  @ViewChild('siteScaleInner') private readonly siteScaleInner?: ElementRef<HTMLElement>;

  private readonly installerInfoService = inject(InstallerInfoService);
  private readonly router = inject(Router);
  private readonly terrainBackgroundRenderer = new TerrainBackgroundRenderer();
  private siteScaleResizeObserver?: ResizeObserver;
  private readonly routerSubscription = this.router.events
    .pipe(filter((event) => event instanceof NavigationEnd))
    .subscribe(() => requestAnimationFrame(() => this.updateScaledLayoutCompensation()));

  protected readonly bannerSlides = this.buildBannerSlides();
  protected readonly bannerTags = BANNER_TAGS;
  protected readonly navItems = NAV_ITEMS;
  protected readonly version$ = this.installerInfoService.version$;

  ngAfterViewInit(): void {
    this.drawTerrainBackground();
    this.observeScaledLayout();
  }

  ngOnDestroy(): void {
    this.siteScaleResizeObserver?.disconnect();
    this.routerSubscription.unsubscribe();
  }

  @HostListener('window:resize')
  protected onResize(): void {
    this.drawTerrainBackground();
    this.updateScaledLayoutCompensation();
  }

  private buildBannerSlides(): BannerSlide[] {
    return buildImageSequence(BANNER_IMAGE_PATHS, 4).map((image, index) => ({
      imageUrl: `url(${image})`,
      animationDelay: `${-1.44 + index * 4.5}s`,
      position: BANNER_SLIDE_POSITIONS[index]
    }));
  }

  private observeScaledLayout(): void {
    const element = this.siteScaleInner?.nativeElement;

    if (!element) {
      return;
    }

    this.siteScaleResizeObserver = new ResizeObserver(() => this.updateScaledLayoutCompensation());
    this.siteScaleResizeObserver.observe(element);
    requestAnimationFrame(() => this.updateScaledLayoutCompensation());
    setTimeout(() => this.updateScaledLayoutCompensation(), 0);
    setTimeout(() => this.updateScaledLayoutCompensation(), 250);
  }

  private updateScaledLayoutCompensation(): void {
    const outerElement = this.siteScale?.nativeElement;
    const innerElement = this.siteScaleInner?.nativeElement;

    if (!outerElement || !innerElement) {
      return;
    }

    const bodyStyles = getComputedStyle(document.body);
    const outerStyles = getComputedStyle(outerElement);
    const bodyVerticalMargin = parseFloat(bodyStyles.marginTop) + parseFloat(bodyStyles.marginBottom);
    const outerBottomPadding = parseFloat(outerStyles.paddingBottom);
    const availableHeight = Math.max(0, window.innerHeight - bodyVerticalMargin);
    const outerRect = outerElement.getBoundingClientRect();
    const innerRect = innerElement.getBoundingClientRect();
    const legalTextRect = innerElement.querySelector('.bottom-label span')?.getBoundingClientRect();
    const legalTextFits = !legalTextRect || legalTextRect.bottom <= window.innerHeight;
    const visualHeight = Math.ceil(innerRect.bottom - outerRect.top + outerBottomPadding);
    const compensatedHeight = visualHeight <= availableHeight + 8 && legalTextFits ? availableHeight : visualHeight;

    outerElement.style.height = `${Math.max(0, compensatedHeight)}px`;
  }

  private buildImageSequence(images: string[], imageCount: number): string[] {
    const imageSequence: string[] = [];

    while (imageSequence.length < imageCount && images.length > 0) {
      const nextImages = this.shuffleImages(images);
      const previousImage = imageSequence.at(-1);

      if (previousImage && nextImages.length > 1 && nextImages[0] === previousImage) {
        const swapIndex = nextImages.findIndex((image) => image !== previousImage);
        [nextImages[0], nextImages[swapIndex]] = [nextImages[swapIndex], nextImages[0]];
      }

      imageSequence.push(...nextImages.slice(0, imageCount - imageSequence.length));
    }

    return imageSequence;
  }

  private shuffleImages(images: string[]): string[] {
    const shuffledImages = [...images];

    for (let index = shuffledImages.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffledImages[index], shuffledImages[swapIndex]] = [shuffledImages[swapIndex], shuffledImages[index]];
    }

    return shuffledImages;
  }

  private drawTerrainBackground(): void {
    const canvas = this.terrainBackground?.nativeElement;

    if (canvas) {
      this.terrainBackgroundRenderer.draw(canvas);
    }
  }
}
