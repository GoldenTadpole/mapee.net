import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { MinecraftLinkButtonComponent } from '../../components/minecraft-link-button/minecraft-link-button';
import { PageShellComponent } from '../../components/page-shell/page-shell';
import { InstallerInfoService } from '../../installer-info.service';
import { formatDate, formatSize } from '../../utils/formatters';

@Component({
  selector: 'app-download-page',
  imports: [AsyncPipe, MinecraftLinkButtonComponent, PageShellComponent],
  templateUrl: './download-page.html',
  styleUrl: './download-page.css'
})
export class DownloadPage {
  private readonly installerInfoService = inject(InstallerInfoService);

  protected readonly info$ = this.installerInfoService.info$;

  protected readonly formatDate = formatDate;
  protected readonly formatSize = formatSize;
}