import { Component } from '@angular/core';

import { MinecraftLinkButtonComponent } from '../../components/minecraft-link-button/minecraft-link-button';
import { PageShellComponent } from '../../components/page-shell/page-shell';

@Component({
  selector: 'app-github-page',
  imports: [MinecraftLinkButtonComponent, PageShellComponent],
  templateUrl: './github-page.html',
  styleUrl: './github-page.css'
})
export class GithubPage {}