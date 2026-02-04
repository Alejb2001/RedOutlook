import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="app-launcher">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="#323130">
            <rect x="1" y="1" width="5" height="5" rx="1"/>
            <rect x="8" y="1" width="5" height="5" rx="1"/>
            <rect x="15" y="1" width="5" height="5" rx="1"/>
            <rect x="1" y="8" width="5" height="5" rx="1"/>
            <rect x="8" y="8" width="5" height="5" rx="1"/>
            <rect x="15" y="8" width="5" height="5" rx="1"/>
            <rect x="1" y="15" width="5" height="5" rx="1"/>
            <rect x="8" y="15" width="5" height="5" rx="1"/>
            <rect x="15" y="15" width="5" height="5" rx="1"/>
          </svg>
        </div>
        <span class="app-name">Outlook</span>
      </div>

      <div class="toolbar-center">
        <div class="search-box">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="#605e5c">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
          <input type="text" placeholder="Search" />
        </div>
      </div>

      <div class="toolbar-right">
        <button class="toolbar-btn" title="Settings">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="#323130">
            <path d="M17 10.5a6.979 6.979 0 0 1-.64 2.867l1.405 1.405a.5.5 0 0 1-.02.727l-1.414 1.414a.5.5 0 0 1-.727.021l-1.405-1.405A6.979 6.979 0 0 1 11.5 16.5v2a.5.5 0 0 1-.5.5H9a.5.5 0 0 1-.5-.5v-2a6.979 6.979 0 0 1-2.867-.64l-1.405 1.405a.5.5 0 0 1-.727-.021l-1.414-1.414a.5.5 0 0 1 .021-.727l1.405-1.405A6.979 6.979 0 0 1 3 10.5h-2a.5.5 0 0 1-.5-.5V8a.5.5 0 0 1 .5-.5h2a6.979 6.979 0 0 1 .64-2.867L2.235 3.228a.5.5 0 0 1 .021-.727l1.414-1.414a.5.5 0 0 1 .727.021l1.405 1.405A6.979 6.979 0 0 1 8.5 2.003v-2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a6.979 6.979 0 0 1 2.867.64l1.405-1.405a.5.5 0 0 1 .727.021l1.414 1.414a.5.5 0 0 1-.021.727l-1.405 1.405A6.979 6.979 0 0 1 17 8.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2zM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
          </svg>
        </button>
        <button class="toolbar-btn" title="Help">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="#323130">
            <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-5h2v2H9v-2zm1-10a3 3 0 0 0-3 3h2a1 1 0 1 1 2 0c0 .816-.446 1.199-1.047 1.706C9.229 8.32 8.5 9.094 8.5 10.5h2c0-.65.252-.955.786-1.405C12.015 8.473 13 7.576 13 6a3 3 0 0 0-3-3z"/>
          </svg>
        </button>
        <div class="user-avatar">
          <span>U</span>
        </div>
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
      padding: 0 16px;
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .app-launcher {
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
    }

    .app-launcher:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .app-launcher svg {
      fill: white;
    }

    .app-name {
      color: white;
      font-size: 16px;
      font-weight: 600;
    }

    .toolbar-center {
      flex: 1;
      max-width: 600px;
      margin: 0 24px;
    }

    .search-box {
      display: flex;
      align-items: center;
      background-color: white;
      border-radius: 4px;
      padding: 0 12px;
      height: 32px;
    }

    .search-box svg {
      flex-shrink: 0;
    }

    .search-box input {
      flex: 1;
      border: none;
      outline: none;
      padding: 0 12px;
      font-size: 14px;
      font-family: inherit;
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .toolbar-btn {
      background: transparent;
      border: none;
      padding: 6px;
      cursor: pointer;
      border-radius: 4px;
    }

    .toolbar-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .toolbar-btn svg {
      fill: white;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #106ebe;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
  `]
})
export class ToolbarComponent {}
