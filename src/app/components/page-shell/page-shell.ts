import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-shell',
  templateUrl: './page-shell.html',
  styleUrl: './page-shell.css'
})
export class PageShellComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) intro = '';
  @Input() tall = false;
  @Input() homeTitle = false;
}
