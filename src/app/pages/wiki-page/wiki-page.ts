import { Component } from '@angular/core';

import { PageShellComponent } from '../../components/page-shell/page-shell';

@Component({
  selector: 'app-wiki-page',
  imports: [PageShellComponent],
  templateUrl: './wiki-page.html',
  styleUrl: './wiki-page.css'
})
export class WikiPage {}