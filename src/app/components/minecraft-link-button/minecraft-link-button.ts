import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-minecraft-link-button',
  templateUrl: './minecraft-link-button.html',
  styleUrl: './minecraft-link-button.css'
})
export class MinecraftLinkButtonComponent {
  @Input({ required: true }) href = '';
  @Input() download = false;
  @Input() target: string | null = null;
  @Input() rel: string | null = null;
}