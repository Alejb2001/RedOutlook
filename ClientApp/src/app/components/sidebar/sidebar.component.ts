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
      <!-- Logo/Header -->
      <div class="sidebar-header">
        <div class="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#0078d4">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
          </svg>
          <span class="logo-text">Outlook</span>
        </div>
      </div>

      <!-- New Mail Button -->
      <button class="new-mail-btn" (click)="onNewMail()">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 1v6H2v2h6v6h2V9h6V7H10V1H8z"/>
        </svg>
        New mail
      </button>

      <!-- Folders Section -->
      <div class="folders-section">
        <div class="section-title">Folders</div>

        <div
          class="folder-item"
          [class.active]="selectedSubreddit === 'all'"
          (click)="selectSubreddit('all')">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M14 4H8.5l-1-1H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z"/>
          </svg>
          <span>Inbox (r/all)</span>
        </div>

        <div
          class="folder-item"
          [class.active]="selectedSubreddit === 'popular'"
          (click)="selectSubreddit('popular')">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5z"/>
          </svg>
          <span>Starred (r/popular)</span>
        </div>
      </div>

      <!-- Subreddits Section -->
      <div class="folders-section">
        <div class="section-title">Subscriptions</div>

        <div
          *ngFor="let sub of subreddits"
          class="folder-item"
          [class.active]="selectedSubreddit === sub.displayName"
          (click)="selectSubreddit(sub.displayName)">
          <div class="subreddit-icon">{{ sub.displayName.charAt(0).toUpperCase() }}</div>
          <span>r/{{ sub.displayName }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 240px;
      height: 100%;
      background-color: #f3f2f1;
      border-right: 1px solid #edebe9;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    .sidebar-header {
      padding: 12px 16px;
      border-bottom: 1px solid #edebe9;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .logo-text {
      font-size: 18px;
      font-weight: 600;
      color: #323130;
    }

    .new-mail-btn {
      margin: 12px 16px;
      padding: 10px 16px;
      background-color: #0078d4;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 500;
      transition: background-color 0.2s;
    }

    .new-mail-btn:hover {
      background-color: #106ebe;
    }

    .folders-section {
      padding: 8px 0;
    }

    .section-title {
      padding: 8px 16px;
      font-size: 12px;
      font-weight: 600;
      color: #605e5c;
      text-transform: uppercase;
    }

    .folder-item {
      padding: 8px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      color: #323130;
      font-size: 14px;
      transition: background-color 0.1s;
    }

    .folder-item:hover {
      background-color: #edebe9;
    }

    .folder-item.active {
      background-color: #deecf9;
      color: #0078d4;
    }

    .folder-item svg {
      flex-shrink: 0;
    }

    .subreddit-icon {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #0078d4;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 600;
    }
  `]
})
export class SidebarComponent implements OnInit {
  @Output() subredditChange = new EventEmitter<string>();

  subreddits: SubredditInfo[] = [];
  selectedSubreddit = 'all';

  constructor(private redditService: RedditService) {}

  ngOnInit(): void {
    this.loadSubreddits();
  }

  loadSubreddits(): void {
    this.redditService.getPopularSubreddits(15).subscribe({
      next: (subs) => this.subreddits = subs,
      error: (err) => console.error('Error loading subreddits', err)
    });
  }

  selectSubreddit(name: string): void {
    this.selectedSubreddit = name;
    this.subredditChange.emit(name);
  }

  onNewMail(): void {
    // Placeholder for compose functionality
    console.log('New mail clicked');
  }
}
