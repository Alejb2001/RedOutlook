import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RedditService } from '../../services/reddit.service';
import { RedditPost } from '../../models/reddit.models';

@Component({
  selector: 'app-mail-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mail-list">
      <!-- Header -->
      <div class="mail-list-header">
        <div class="header-title">
          <span class="inbox-name">{{ currentSubreddit === 'all' ? 'Inbox' : 'r/' + currentSubreddit }}</span>
          <span class="mail-count">{{ posts.length }} messages</span>
        </div>
        <div class="header-actions">
          <button class="icon-btn" title="Refresh" (click)="refresh()">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M13.65 2.35A8 8 0 1 0 16 8h-2a6 6 0 1 1-1.76-4.24L10 6h6V0l-2.35 2.35z"/>
            </svg>
          </button>
          <button class="icon-btn" title="Filter">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 2h14v2H1V2zm2 5h10v2H3V7zm2 5h6v2H5v-2z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mail Items -->
      <div class="mail-items">
        <div
          *ngFor="let post of posts"
          class="mail-item"
          [class.unread]="!isRead(post.id)"
          [class.selected]="selectedPost?.id === post.id"
          (click)="selectPost(post)">

          <div class="mail-indicator" [class.unread]="!isRead(post.id)"></div>

          <div class="mail-content">
            <div class="mail-header">
              <span class="sender">{{ post.author }}</span>
              <span class="date">{{ formatDate(post.createdUtc) }}</span>
            </div>
            <div class="mail-subject">{{ post.title }}</div>
            <div class="mail-preview">
              <span class="subreddit-tag">r/{{ post.subreddit }}</span>
              {{ post.selfText | slice:0:100 }}{{ post.selfText.length > 100 ? '...' : '' }}
            </div>
            <div class="mail-stats">
              <span class="stat">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 1l2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z"/>
                </svg>
                {{ post.score }}
              </span>
              <span class="stat">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M14 1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3v4l4-4h5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
                </svg>
                {{ post.numComments }}
              </span>
            </div>
          </div>
        </div>

        <div *ngIf="loading" class="loading">
          Loading messages...
        </div>

        <div *ngIf="!loading && posts.length === 0" class="empty">
          No messages in this folder
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mail-list {
      width: 360px;
      height: 100%;
      background-color: white;
      border-right: 1px solid #edebe9;
      display: flex;
      flex-direction: column;
    }

    .mail-list-header {
      padding: 12px 16px;
      border-bottom: 1px solid #edebe9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-title {
      display: flex;
      flex-direction: column;
    }

    .inbox-name {
      font-size: 16px;
      font-weight: 600;
      color: #323130;
    }

    .mail-count {
      font-size: 12px;
      color: #605e5c;
    }

    .header-actions {
      display: flex;
      gap: 4px;
    }

    .icon-btn {
      padding: 6px;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: 4px;
      color: #605e5c;
    }

    .icon-btn:hover {
      background-color: #f3f2f1;
    }

    .mail-items {
      flex: 1;
      overflow-y: auto;
    }

    .mail-item {
      padding: 12px 16px;
      border-bottom: 1px solid #edebe9;
      cursor: pointer;
      display: flex;
      gap: 12px;
      transition: background-color 0.1s;
    }

    .mail-item:hover {
      background-color: #f3f2f1;
    }

    .mail-item.selected {
      background-color: #deecf9;
    }

    .mail-indicator {
      width: 4px;
      border-radius: 2px;
      flex-shrink: 0;
      background-color: transparent;
    }

    .mail-indicator.unread {
      background-color: #0078d4;
    }

    .mail-content {
      flex: 1;
      min-width: 0;
    }

    .mail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .sender {
      font-size: 14px;
      font-weight: 600;
      color: #323130;
    }

    .unread .sender {
      color: #0078d4;
    }

    .date {
      font-size: 12px;
      color: #605e5c;
      flex-shrink: 0;
    }

    .mail-subject {
      font-size: 14px;
      color: #323130;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .unread .mail-subject {
      font-weight: 600;
    }

    .mail-preview {
      font-size: 13px;
      color: #605e5c;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .subreddit-tag {
      color: #0078d4;
      font-weight: 500;
    }

    .mail-stats {
      display: flex;
      gap: 12px;
      margin-top: 6px;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #605e5c;
    }

    .loading, .empty {
      padding: 24px;
      text-align: center;
      color: #605e5c;
    }
  `]
})
export class MailListComponent implements OnChanges {
  @Input() currentSubreddit = 'all';

  posts: RedditPost[] = [];
  selectedPost: RedditPost | null = null;
  loading = false;

  constructor(private redditService: RedditService) {
    this.redditService.selectedPost$.subscribe(post => {
      this.selectedPost = post;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentSubreddit']) {
      this.loadPosts();
    }
  }

  loadPosts(): void {
    this.loading = true;
    this.redditService.getPosts(this.currentSubreddit, 25).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading posts', err);
        this.loading = false;
      }
    });
  }

  refresh(): void {
    this.loadPosts();
  }

  selectPost(post: RedditPost): void {
    this.redditService.selectPost(post);
  }

  isRead(postId: string): boolean {
    return this.redditService.isRead(postId);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }
}
