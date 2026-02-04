import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService, AppSettings } from '../../services/settings.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toolbar">
      <div class="toolbar-left">
        <!-- Toggle Sidebar Button -->
        <button class="toolbar-btn toggle-sidebar-btn" title="Toggle sidebar" (click)="toggleSidebar()">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
            <path d="M2 4.5A.5.5 0 0 1 2.5 4h15a.5.5 0 0 1 0 1h-15a.5.5 0 0 1-.5-.5zm0 5A.5.5 0 0 1 2.5 9h15a.5.5 0 0 1 0 1h-15a.5.5 0 0 1-.5-.5zm.5 4.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-15z"/>
          </svg>
        </button>

        <!-- Outlook Brand -->
        <a class="app-brand" href="/">
          <svg class="outlook-logo" viewBox="0 0 16 16" width="18" height="18">
            <path fill="#0078d4" d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0z"/>
            <path fill="#fff" d="M8 3.5c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5S10.49 3.5 8 3.5zm0 7.5c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
          </svg>
          <span class="app-name">Outlook</span>
        </a>
      </div>

      <div class="toolbar-center">
        <button class="search-box" (click)="focusSearch()">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="#616161">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
          <span class="search-placeholder">Search</span>
        </button>
      </div>

      <div class="toolbar-right">
        <!-- Settings (Gear) -->
        <div class="settings-container">
          <button class="toolbar-btn" title="Settings" (click)="toggleSettingsMenu($event)">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="white">
              <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
              <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
            </svg>
          </button>

          <!-- Settings Dropdown Menu -->
          <div class="settings-menu" *ngIf="showSettingsMenu">
            <div class="settings-menu-header">Settings</div>
            <label class="settings-option">
              <input type="checkbox" [checked]="settings.showSortTabs" (change)="toggleShowSortTabs()">
              <span>Show sort filters (Hot, New, Top, Rising)</span>
            </label>
            <label class="settings-option">
              <input type="checkbox" [checked]="settings.hideImages" (change)="toggleHideImages()">
              <span>Hide images and GIFs</span>
            </label>
            <label class="settings-option nsfw-option">
              <input type="checkbox" [checked]="settings.showNsfw" (change)="toggleShowNsfw()">
              <span>Show NSFW content</span>
            </label>
          </div>
        </div>

        <!-- Help (Question mark) -->
        <button class="toolbar-btn" title="Help">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
            <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 14.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13zM10 11a.75.75 0 0 1-.75-.75v-.38c0-.78.64-1.06 1.12-1.28.37-.17.63-.3.63-.59 0-.42-.34-.75-.75-.75a.74.74 0 0 0-.72.53.75.75 0 1 1-1.45-.38A2.24 2.24 0 0 1 10 6a2.25 2.25 0 0 1 2.25 2.25c0 1.1-.79 1.47-1.35 1.72-.26.12-.4.2-.4.28v.25c0 .41-.34.75-.75.75h.25zm-.75 2a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0z"/>
          </svg>
        </button>

        <!-- User Account -->
        <button class="user-btn" title="Account manager">
          <div class="user-avatar">
            <span>ME</span>
          </div>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toolbar {
      height: 48px;
      background-color: #0f6cbd;
      display: flex;
      align-items: center;
      padding: 0 4px;
      font-family: 'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif;
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .toolbar-btn {
      width: 48px;
      height: 48px;
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toolbar-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .waffle-btn {
      width: 48px;
    }

    .app-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 12px 0 4px;
      text-decoration: none;
      height: 48px;
    }

    .app-brand:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .outlook-logo {
      flex-shrink: 0;
    }

    .app-name {
      color: white;
      font-size: 16px;
      font-weight: 600;
    }

    .toolbar-center {
      flex: 1;
      display: flex;
      justify-content: center;
      padding: 0 8px;
      max-width: 468px;
      margin: 0 auto;
    }

    .search-box {
      width: 100%;
      max-width: 468px;
      height: 32px;
      background-color: rgba(255, 255, 255, 0.7);
      border: none;
      border-radius: 4px;
      display: flex;
      align-items: center;
      padding: 0 10px;
      gap: 8px;
      cursor: text;
      transition: background-color 0.1s;
    }

    .search-box:hover {
      background-color: rgba(255, 255, 255, 0.8);
    }

    .search-box:focus {
      background-color: white;
      outline: none;
    }

    .search-placeholder {
      color: #616161;
      font-size: 14px;
      font-family: inherit;
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      margin-left: auto;
    }

    .user-btn {
      width: 48px;
      height: 48px;
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }

    .user-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #8764b8;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 400;
    }

    .settings-container {
      position: relative;
    }

    .settings-menu {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 4px;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      min-width: 280px;
      z-index: 1000;
      overflow: hidden;
    }

    .settings-menu-header {
      padding: 12px 16px;
      font-size: 14px;
      font-weight: 600;
      color: #242424;
      border-bottom: 1px solid #edebe9;
    }

    .settings-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      cursor: pointer;
      transition: background-color 0.1s;
    }

    .settings-option:hover {
      background-color: #f5f5f5;
    }

    .settings-option input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: #0f6cbd;
      flex-shrink: 0;
    }

    .settings-option span {
      font-size: 14px;
      color: #242424;
    }
  `]
})
export class ToolbarComponent {
  @Output() sidebarToggle = new EventEmitter<void>();

  showSettingsMenu = false;
  settings: AppSettings;

  constructor(private settingsService: SettingsService) {
    this.settings = this.settingsService.settings;
    this.settingsService.settings$.subscribe(s => this.settings = s);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.settings-container')) {
      this.showSettingsMenu = false;
    }
  }

  focusSearch(): void {
    // Placeholder for search functionality
  }

  toggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  toggleSettingsMenu(event: Event): void {
    event.stopPropagation();
    this.showSettingsMenu = !this.showSettingsMenu;
  }

  toggleShowSortTabs(): void {
    this.settingsService.toggleShowSortTabs();
  }

  toggleHideImages(): void {
    this.settingsService.toggleHideImages();
  }

  toggleShowNsfw(): void {
    this.settingsService.toggleShowNsfw();
  }
}
