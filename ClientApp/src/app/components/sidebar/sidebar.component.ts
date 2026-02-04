import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RedditService } from '../../services/reddit.service';
import { SubredditInfo } from '../../models/reddit.models';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sidebar">
      <!-- New Mail Button -->
      <div class="new-mail-container">
        <button class="new-mail-btn">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3zm6.5 1.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
          </svg>
          <span>New mail</span>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="nav-section">
        <!-- Favorites -->
        <div class="nav-group">
          <button class="nav-group-header" (click)="toggleFavorites()">
            <svg class="chevron" [class.expanded]="favoritesExpanded" width="12" height="12" viewBox="0 0 12 12">
              <path d="M4.5 2L9 6l-4.5 4" fill="none" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <span>Favorites</span>
          </button>

          <div class="nav-items" *ngIf="favoritesExpanded">
            <button
              class="nav-item"
              [class.active]="selectedSubreddit === 'all'"
              (click)="selectSubreddit('all')">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17 4H9.72l-.94-1.88A.5.5 0 0 0 8.33 2H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zm0 11H3V5h5.05l.94 1.88a.5.5 0 0 0 .45.28H17v7.84z"/>
              </svg>
              <span class="nav-label">Inbox</span>
              <span class="nav-count" *ngIf="unreadCount > 0">{{ unreadCount }}</span>
            </button>

            <button
              class="nav-item"
              [class.active]="selectedSubreddit === 'popular'"
              (click)="selectSubreddit('popular')">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.1 2.9a1 1 0 0 1 1.8 0l1.93 3.91 4.31.63a1 1 0 0 1 .56 1.7l-3.12 3.05.74 4.3a1 1 0 0 1-1.45 1.05L10 15.51l-3.87 2.03a1 1 0 0 1-1.45-1.05l.74-4.3L2.3 9.14a1 1 0 0 1 .56-1.7l4.31-.63L9.1 2.9z"/>
              </svg>
              <span class="nav-label">Popular</span>
            </button>
          </div>
        </div>

        <!-- Folders -->
        <div class="nav-group">
          <button class="nav-group-header" (click)="toggleFolders()">
            <svg class="chevron" [class.expanded]="foldersExpanded" width="12" height="12" viewBox="0 0 12 12">
              <path d="M4.5 2L9 6l-4.5 4" fill="none" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <span>Folders</span>
          </button>

          <div class="nav-items" *ngIf="foldersExpanded">
            <button class="nav-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 4a1 1 0 0 1 1-1h4.59a1 1 0 0 1 .7.3l.71.7H16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z"/>
              </svg>
              <span class="nav-label">Drafts</span>
            </button>

            <button class="nav-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M16 4H4a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zm-.2 2L10 9.7 4.2 6h11.6z"/>
              </svg>
              <span class="nav-label">Sent Items</span>
            </button>

            <button class="nav-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.5 4h3a.5.5 0 0 1 .5.5V6h3.5a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5H8v-1.5a.5.5 0 0 1 .5-.5zm.5 2h2V5H9v1z"/>
              </svg>
              <span class="nav-label">Deleted Items</span>
            </button>

            <button class="nav-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM4 10a6 6 0 1 1 12 0 6 6 0 0 1-12 0zm5-3a1 1 0 1 1 2 0v3.59l2.2 2.2a1 1 0 0 1-1.4 1.42l-2.5-2.5A1 1 0 0 1 9 11V7z"/>
              </svg>
              <span class="nav-label">Archive</span>
            </button>

            <button class="nav-item junk">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM4 10a6 6 0 0 1 9.47-4.89L5.11 13.47A5.98 5.98 0 0 1 4 10zm6 6a5.98 5.98 0 0 1-3.47-1.11l8.36-8.36A6 6 0 0 1 10 16z"/>
              </svg>
              <span class="nav-label">Junk Email</span>
            </button>
          </div>
        </div>

        <!-- Subreddits (Groups) -->
        <div class="nav-group">
          <button class="nav-group-header" (click)="toggleGroups()">
            <svg class="chevron" [class.expanded]="groupsExpanded" width="12" height="12" viewBox="0 0 12 12">
              <path d="M4.5 2L9 6l-4.5 4" fill="none" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <span>Groups</span>
          </button>

          <div class="nav-items" *ngIf="groupsExpanded">
            <button
              *ngFor="let sub of subreddits"
              class="nav-item"
              [class.active]="selectedSubreddit === sub.displayName"
              (click)="selectSubreddit(sub.displayName)">
              <div class="group-avatar" [style.backgroundColor]="getColor(sub.displayName)">
                {{ sub.displayName.charAt(0).toUpperCase() }}
              </div>
              <span class="nav-label">r/{{ sub.displayName }}</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 220px;
      height: 100%;
      background-color: #faf9f8;
      display: flex;
      flex-direction: column;
      font-family: 'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif;
      font-size: 14px;
      overflow: hidden;
    }

    .new-mail-container {
      padding: 12px;
    }

    .new-mail-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 8px 12px;
      background-color: #0f6cbd;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
    }

    .new-mail-btn:hover {
      background-color: #115ea3;
    }

    .nav-section {
      flex: 1;
      overflow-y: auto;
      padding: 4px 0;
    }

    .nav-group {
      margin-bottom: 4px;
    }

    .nav-group-header {
      display: flex;
      align-items: center;
      gap: 4px;
      width: 100%;
      padding: 6px 12px;
      background: none;
      border: none;
      font-size: 12px;
      font-weight: 600;
      color: #242424;
      cursor: pointer;
      font-family: inherit;
      text-align: left;
    }

    .nav-group-header:hover {
      background-color: #f5f5f5;
    }

    .chevron {
      color: #616161;
      transition: transform 0.1s;
      transform: rotate(0deg);
    }

    .chevron.expanded {
      transform: rotate(90deg);
    }

    .nav-items {
      padding-left: 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 6px 12px 6px 28px;
      background: none;
      border: none;
      font-size: 14px;
      color: #242424;
      cursor: pointer;
      font-family: inherit;
      text-align: left;
    }

    .nav-item:hover {
      background-color: #f5f5f5;
    }

    .nav-item.active {
      background-color: #e8f4fc;
    }

    .nav-item.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background-color: #0f6cbd;
    }

    .nav-item {
      position: relative;
    }

    .nav-item svg {
      flex-shrink: 0;
      color: #616161;
    }

    .nav-item.active svg {
      color: #0f6cbd;
    }

    .nav-label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .nav-count {
      font-size: 12px;
      font-weight: 600;
      color: #0f6cbd;
    }

    .group-avatar {
      width: 20px;
      height: 20px;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 600;
      color: white;
      flex-shrink: 0;
    }

    .nav-item.junk svg {
      color: #a4262c;
    }
  `]
})
export class SidebarComponent implements OnInit {
  @Output() subredditChange = new EventEmitter<string>();

  subreddits: SubredditInfo[] = [];
  selectedSubreddit = 'all';
  unreadCount = 0;

  favoritesExpanded = true;
  foldersExpanded = true;
  groupsExpanded = true;

  private colors = ['#0f6cbd', '#107c10', '#5c2d91', '#c239b3', '#00b7c3', '#038387', '#8764b8', '#ca5010'];

  constructor(private redditService: RedditService) {}

  ngOnInit(): void {
    this.loadSubreddits();
  }

  loadSubreddits(): void {
    this.redditService.getPopularSubreddits(12).subscribe({
      next: (subs) => this.subreddits = subs,
      error: (err) => console.error('Error loading subreddits', err)
    });
  }

  selectSubreddit(name: string): void {
    this.selectedSubreddit = name;
    this.subredditChange.emit(name);
  }

  toggleFavorites(): void {
    this.favoritesExpanded = !this.favoritesExpanded;
  }

  toggleFolders(): void {
    this.foldersExpanded = !this.foldersExpanded;
  }

  toggleGroups(): void {
    this.groupsExpanded = !this.groupsExpanded;
  }

  getColor(name: string): string {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return this.colors[hash % this.colors.length];
  }
}
