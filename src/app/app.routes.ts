import { Routes } from '@angular/router';

import { DownloadPage } from './pages/download-page/download-page';
import { GithubPage } from './pages/github-page/github-page';
import { HomePage } from './pages/home-page/home-page';
import { NewPage } from './pages/new-page/new-page';
import { WikiPage } from './pages/wiki-page/wiki-page';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'home' },
	{ path: 'home', component: HomePage, title: 'Mapee - Minecraft mapper' },
	{ path: 'download', component: DownloadPage, title: 'Download - Mapee' },
	{ path: 'wiki', component: WikiPage, title: 'Wiki - Mapee' },
	{ path: 'new', component: NewPage, title: "What's new? - Mapee" },
	{ path: 'github', component: GithubPage, title: 'GitHub - Mapee' },
	{ path: '**', redirectTo: 'home' }
];
