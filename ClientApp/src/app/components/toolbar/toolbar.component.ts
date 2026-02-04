import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toolbar">
      <div class="toolbar-left">
        <!-- App Launcher (9 dots) -->
        <button class="toolbar-btn app-launcher" title="App launcher">
          <svg width="20" height="20" viewBox="0 0 20 20">
            <circle cx="4" cy="4" r="1.5"/>
            <circle cx="10" cy="4" r="1.5"/>
            <circle cx="16" cy="4" r="1.5"/>
            <circle cx="4" cy="10" r="1.5"/>
            <circle cx="10" cy="10" r="1.5"/>
            <circle cx="16" cy="10" r="1.5"/>
            <circle cx="4" cy="16" r="1.5"/>
            <circle cx="10" cy="16" r="1.5"/>
            <circle cx="16" cy="16" r="1.5"/>
          </svg>
        </button>

        <!-- Outlook Logo -->
        <div class="app-brand">
          <svg class="outlook-icon" width="20" height="20" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <ellipse cx="12" cy="12" rx="5" ry="3"/>
          </svg>
          <span class="app-name">Outlook</span>
        </div>
      </div>

      <div class="toolbar-center">
        <div class="search-box">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="#605e5c">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
          <input type="text" placeholder="Search" />
          <span class="search-shortcut">Alt+Q</span>
        </div>
      </div>

      <div class="toolbar-right">
        <!-- Microsoft 365 -->
        <button class="toolbar-btn" title="Microsoft 365">
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path d="M2 2h7v7H2V2zm9 0h7v7h-7V2zM2 11h7v7H2v-7zm9 0h7v7h-7v-7z"/>
          </svg>
        </button>

        <!-- Teams Chat -->
        <button class="toolbar-btn" title="Teams Chat">
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path d="M16 6h-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zM4 12V4h8v2H8a2 2 0 0 0-2 2v4H4zm12 4H8V8h8v8z"/>
          </svg>
        </button>

        <!-- Notifications -->
        <button class="toolbar-btn notification-btn" title="Notifications">
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path d="M10 18a2 2 0 0 0 2-2H8a2 2 0 0 0 2 2zm6-4V9a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
          <span class="notification-dot"></span>
        </button>

        <!-- Settings -->
        <button class="toolbar-btn" title="Settings">
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path d="M10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
            <path d="M17.4 11l1.6-1.2V8.2L17.4 7l-.6-1.4.9-1.8-1.4-1.4-1.8.9L13 2.6 11.8 1H8.2L7 2.6l-1.4-.6-1.8-.9L2.4 2.5l.9 1.8L2.6 5.7 1 7v2.6L2.6 11l.6 1.4-.9 1.8 1.4 1.4 1.8-.9 1.4.6L8.2 17h2.6l1.2-1.6 1.4.6 1.8.9 1.4-1.4-.9-1.8.6-1.4zM10 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
          </svg>
        </button>

        <!-- Help -->
        <button class="toolbar-btn" title="Help">
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path d="M10 0C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/>
            <path d="M10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
            <path d="M10 4a3 3 0 0 0-3 3h2a1 1 0 1 1 2 0c0 1-1 1.5-1 3h2c0-1.5 1-2 1-3a3 3 0 0 0-3-3z"/>
          </svg>
        </button>

        <!-- User Avatar -->
        <button class="user-avatar" title="Account">
          <span>JD</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toolbar {
      height: 48px;
      background-color: #0078d4;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 8px 0 12px;
      user-select: none;
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .toolbar-btn {
      background: transparent;
      border: none;
      padding: 8px;
      cursor: pointer;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .toolbar-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .toolbar-btn svg {
      fill: white;
    }

    .app-launcher svg {
      fill: white;
      opacity: 0.9;
    }

    .app-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 8px;
    }

    .outlook-icon {
      fill: white;
    }

    .app-name {
      color: white;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: -0.2px;
    }

    .toolbar-center {
      flex: 1;
      max-width: 468px;
      margin: 0 16px;
    }

    .search-box {
      display: flex;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.95);
      border-radius: 4px;
      padding: 0 12px;
      height: 32px;
      gap: 8px;
    }

    .search-box:focus-within {
      background-color: white;
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
    }

    .search-box svg {
      flex-shrink: 0;
      opacity: 0.7;
    }

    .search-box input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 14px;
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: transparent;
      min-width: 0;
    }

    .search-box input::placeholder {
      color: #605e5c;
    }

    .search-shortcut {
      font-size: 11px;
      color: #605e5c;
      background: #f3f2f1;
      padding: 2px 6px;
      border-radius: 3px;
      white-space: nowrap;
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .notification-btn {
      position: relative;
    }

    .notification-dot {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 8px;
      height: 8px;
      background-color: #d13438;
      border-radius: 50%;
      border: 2px solid #0078d4;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #8764b8 0%, #5c2d91 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      margin-left: 4px;
    }

    .user-avatar:hover {
      opacity: 0.9;
    }
  `]
})
export class ToolbarComponent {}
