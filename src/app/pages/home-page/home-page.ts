import { Component } from '@angular/core';

import { ImageSlideshowComponent } from '../../components/image-slideshow/image-slideshow';
import { PageShellComponent } from '../../components/page-shell/page-shell';
import { HOME_SAMPLES } from '../../site-content';

@Component({
  selector: 'app-home-page',
  imports: [ImageSlideshowComponent, PageShellComponent],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {
  protected readonly samples = HOME_SAMPLES;
}