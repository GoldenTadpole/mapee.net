import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';

export interface InstallerInfo {
  version: string;
  url: string;
  fileSize: number;
  buttonText: string;
  releaseDate: Date;
}

@Injectable({ providedIn: 'root' })
export class InstallerInfoService {
  private readonly http = inject(HttpClient);

  readonly info$: Observable<InstallerInfo> = this.http
    .get('/info/installer-info.xml', { responseType: 'text' })
    .pipe(
      map((xml) => this.parse(xml)),
      shareReplay({ bufferSize: 1, refCount: true })
    );

  readonly version$ = this.info$.pipe(map((info) => info.version));

  private parse(xml: string): InstallerInfo {
    const document = new DOMParser().parseFromString(xml, 'text/xml');
    const releaseDate = this.getText(document, 'release-date').split('-').map(Number);

    return {
      version: this.getText(document, 'version'),
      url: this.getText(document, 'url'),
      fileSize: Number(this.getText(document, 'file-size')),
      buttonText: this.getText(document, 'download-button-upper-text'),
      releaseDate: new Date(releaseDate[0], releaseDate[1] - 1, releaseDate[2])
    };
  }

  private getText(document: Document, tagName: string): string {
    return document.getElementsByTagName(tagName)[0]?.textContent?.trim() ?? '';
  }
}