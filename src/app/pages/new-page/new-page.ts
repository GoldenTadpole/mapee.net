import { Component } from '@angular/core';

import { PageShellComponent } from '../../components/page-shell/page-shell';
import { ROADMAP_ITEMS } from '../../site-content';

@Component({
  selector: 'app-new-page',
  imports: [PageShellComponent],
  templateUrl: './new-page.html',
  styleUrl: './new-page.css'
})
export class NewPage {
  protected readonly roadmapItems = ROADMAP_ITEMS;
}