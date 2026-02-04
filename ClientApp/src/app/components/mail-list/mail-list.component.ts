import { Component, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { RedditService } from '../../services/reddit.service';
import { SettingsService, AppSettings } from '../../services/settings.service';
import { RedditPost, PostType } from '../../models/reddit.models';

@Component({
  selector: 'app-mail-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mail-list">
      <!-- Header -->
      <div class="mail-list-header">
        <div class="header-title">
          <span class="inbox-name">{{ getFolderName() }}</span>
          <span class="mail-count">{{ posts.length }} messages</span>
        </div>
        <div class="header-actions">
          <button class="icon-btn" title="Refresh" (click)="refresh()" [disabled]="loading">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" [class.spin]="loading">
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

      <!-- Sort Tabs -->
      <div class="mail-tabs" *ngIf="settings.showSortTabs">
        <button
          *ngFor="let sort of sortOptions"
          class="tab"
          [class.active]="currentSort === sort.value"
          (click)="changeSort(sort.value)">
          {{ sort.label }}
        </button>
      </div>

      <!-- Mail Items -->
      <div class="mail-items" #mailContainer (scroll)="onScroll($event)">
        <div
          *ngFor="let post of posts; trackBy: trackByPostId"
          class="mail-item"
          [class.unread]="!isRead(post.id)"
          [class.selected]="selectedPost?.id === post.id"
          [class.important]="post.isImportant"
          (click)="selectPost(post)">

          <!-- Selection checkbox (hidden by default, shown on hover) -->
          <div class="mail-checkbox">
            <input type="checkbox" (click)="$event.stopPropagation()">
          </div>

          <!-- Unread indicator -->
          <div class="mail-indicator" [class.unread]="!isRead(post.id)"></div>

          <div class="mail-content">
            <div class="mail-row-1">
              <span class="sender" [class.unread]="!isRead(post.id)">{{ post.author }}</span>
              <div class="mail-icons">
                <!-- Attachment icon -->
                <svg *ngIf="post.hasAttachment" class="attachment-icon" width="14" height="14" viewBox="0 0 16 16" title="Has attachment">
                  <path d="M4.5 3A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h5a.5.5 0 0 1 0 1h-5A2.5 2.5 0 0 1 2 11.5v-7A2.5 2.5 0 0 1 4.5 2h7A2.5 2.5 0 0 1 14 4.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 0 11.5 3h-7z"/>
                  <path d="M10 10a1 1 0 1 1 2 0v4.5a2.5 2.5 0 0 1-5 0v-5a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 0 3 0V10z"/>
                </svg>
                <!-- Important icon -->
                <svg *ngIf="post.isImportant" class="important-icon" width="14" height="14" viewBox="0 0 16 16" title="Important">
                  <path d="M8 1l2 4.5 5 .5-3.5 3.5 1 5L8 12l-4.5 2.5 1-5L1 6l5-.5L8 1z"/>
                </svg>
              </div>
              <span class="date">{{ formatDate(post.createdUtc) }}</span>
            </div>

            <div class="mail-row-2">
              <span class="subject" [class.unread]="!isRead(post.id)">{{ post.title }}</span>
            </div>

            <div class="mail-row-3">
              <span class="folder-tag">r/{{ post.subreddit }}</span>
              <span class="preview">{{ getPreviewText(post) }}</span>
            </div>

            <!-- Type indicator -->
            <div class="mail-meta" *ngIf="post.type !== PostType.Text || post.flair">
              <span class="type-badge" *ngIf="post.type !== PostType.Text">
                <svg *ngIf="post.type === PostType.Image" width="12" height="12" viewBox="0 0 16 16">
                  <path d="M1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4zm1 0v6l3-3 2 2 4-4 3 3V4H2z"/>
                </svg>
                <svg *ngIf="post.type === PostType.Video" width="12" height="12" viewBox="0 0 16 16">
                  <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm4 4v6l5-3-5-3z"/>
                </svg>
                <svg *ngIf="post.type === PostType.Link" width="12" height="12" viewBox="0 0 16 16">
                  <path d="M4.715 6.542L3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.001 1.001 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                  <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 0 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 0 0-4.243-4.243L6.586 4.672z"/>
                </svg>
                {{ getTypeLabel(post.type) }}
              </span>
              <span class="flair-badge" *ngIf="post.flair">{{ post.flair }}</span>
            </div>
          </div>
        </div>

        <!-- Loading more -->
        <div *ngIf="loadingMore" class="loading-more">
          <div class="spinner"></div>
          Loading more messages...
        </div>

        <!-- Initial loading -->
        <div *ngIf="loading && posts.length === 0" class="loading">
          <div class="spinner"></div>
          Loading messages...
        </div>

        <!-- Empty state -->
        <div *ngIf="!loading && posts.length === 0" class="empty">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="#c8c6c4">
            <path d="M40 8H8a4 4 0 0 0-4 4v24a4 4 0 0 0 4 4h32a4 4 0 0 0 4-4V12a4 4 0 0 0-4-4zm-2 4L24 22 10 12h28zm2 24H8V14l16 12 16-12v22z"/>
          </svg>
          <p>No messages in this folder</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mail-list {
      width: 360px;
      min-width: 320px;
      max-width: 400px;
      height: 100%;
      background-color: #ffffff;
      border-right: 1px solid #edebe9;
      display: flex;
      flex-direction: column;
      user-select: none;
      font-family: 'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif;
    }

    .mail-list-header {
      padding: 16px 16px 8px 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      background: #ffffff;
    }

    .header-title {
      display: flex;
      flex-direction: column;
    }

    .inbox-name {
      font-size: 20px;
      font-weight: 600;
      color: #242424;
      line-height: 28px;
    }

    .mail-count {
      font-size: 12px;
      color: #616161;
      margin-top: 2px;
    }

    .header-actions {
      display: flex;
      gap: 2px;
    }

    .icon-btn {
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: 4px;
      color: #616161;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon-btn:hover:not(:disabled) {
      background-color: #f5f5f5;
    }

    .icon-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .mail-tabs {
      display: flex;
      padding: 0 16px;
      gap: 16px;
      border-bottom: 1px solid #edebe9;
      background: #ffffff;
    }

    .tab {
      padding: 8px 4px;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 14px;
      color: #616161;
      position: relative;
      font-family: inherit;
    }

    .tab.active {
      color: #242424;
      font-weight: 600;
    }

    .tab.active::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #0f6cbd;
      border-radius: 1px 1px 0 0;
    }

    .tab:hover:not(.active) {
      color: #242424;
    }

    .mail-items {
      flex: 1;
      overflow-y: auto;
      background-color: #ffffff;
    }

    .mail-item {
      padding: 10px 16px 10px 12px;
      border-bottom: 1px solid #f5f5f5;
      cursor: pointer;
      display: flex;
      align-items: flex-start;
      gap: 8px;
      transition: background-color 0.1s;
      position: relative;
    }

    .mail-item:hover {
      background-color: #f5f5f5;
    }

    .mail-item.selected {
      background-color: #ebebeb;
    }

    .mail-item.important {
      border-left: 3px solid #c50f1f;
      padding-left: 9px;
    }

    .mail-checkbox {
      opacity: 0;
      transition: opacity 0.15s;
      padding-top: 4px;
      width: 18px;
    }

    .mail-item:hover .mail-checkbox {
      opacity: 1;
    }

    .mail-checkbox input {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: #0f6cbd;
    }

    .mail-indicator {
      width: 3px;
      min-height: 48px;
      border-radius: 1.5px;
      flex-shrink: 0;
      background-color: transparent;
      align-self: stretch;
    }

    .mail-indicator.unread {
      background-color: #0f6cbd;
    }

    .mail-content {
      flex: 1;
      min-width: 0;
    }

    .mail-row-1 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 2px;
      line-height: 20px;
    }

    .sender {
      font-size: 14px;
      color: #242424;
      flex-shrink: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sender.unread {
      font-weight: 600;
    }

    .mail-icons {
      display: flex;
      gap: 4px;
      flex-shrink: 0;
    }

    .attachment-icon {
      fill: #616161;
    }

    .important-icon {
      fill: #c50f1f;
    }

    .date {
      font-size: 12px;
      color: #616161;
      flex-shrink: 0;
      margin-left: auto;
    }

    .mail-row-2 {
      margin-bottom: 2px;
      line-height: 20px;
    }

    .subject {
      font-size: 14px;
      color: #242424;
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .subject.unread {
      font-weight: 600;
    }

    .mail-row-3 {
      display: flex;
      gap: 6px;
      font-size: 12px;
      color: #616161;
      line-height: 16px;
    }

    .folder-tag {
      color: #0f6cbd;
      font-weight: 500;
      flex-shrink: 0;
    }

    .preview {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .mail-meta {
      display: flex;
      gap: 6px;
      margin-top: 6px;
      flex-wrap: wrap;
    }

    .type-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: #616161;
      background: #f0f0f0;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .type-badge svg {
      fill: #616161;
    }

    .flair-badge {
      font-size: 11px;
      color: #0f6cbd;
      background: #ebf3fc;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .loading, .empty, .loading-more {
      padding: 40px 24px;
      text-align: center;
      color: #616161;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .loading-more {
      padding: 16px;
      flex-direction: row;
      justify-content: center;
    }

    .spinner {
      width: 24px;
      height: 24px;
      border: 2px solid #e0e0e0;
      border-top-color: #0f6cbd;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .empty p {
      margin: 0;
      font-size: 14px;
    }
  `]
})
export class MailListComponent implements OnChanges, OnDestroy {
  @Input() currentSubreddit = 'all';

  posts: RedditPost[] = [];
  selectedPost: RedditPost | null = null;
  loading = false;
  loadingMore = false;
  currentAfter: string | undefined;
  currentSort = 'hot';
  PostType = PostType;
  settings: AppSettings;

  private settingsSubscription: Subscription;

  sortOptions = [
    { label: 'Hot', value: 'hot' },
    { label: 'New', value: 'new' },
    { label: 'Top', value: 'top' },
    { label: 'Rising', value: 'rising' }
  ];

  constructor(
    private redditService: RedditService,
    private settingsService: SettingsService
  ) {
    this.settings = this.settingsService.settings;
    this.settingsSubscription = this.settingsService.settings$.subscribe(s => {
      const nsfwChanged = this.settings.showNsfw !== s.showNsfw;
      this.settings = s;
      if (nsfwChanged) {
        this.posts = [];
        this.currentAfter = undefined;
        this.loadPosts();
      }
    });
    this.redditService.selectedPost$.subscribe(post => {
      this.selectedPost = post;
    });
  }

  ngOnDestroy(): void {
    this.settingsSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentSubreddit']) {
      this.posts = [];
      this.currentAfter = undefined;
      this.loadPosts();
    }
  }

  loadPosts(): void {
    this.loading = true;
    this.redditService.getPosts(this.currentSubreddit, 25, undefined, undefined, this.currentSort, this.settings.showNsfw).subscribe({
      next: (response) => {
        this.posts = response.items;
        this.currentAfter = response.after;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading posts', err);
        this.loading = false;
      }
    });
  }

  loadMore(): void {
    if (this.loadingMore || !this.currentAfter) return;

    this.loadingMore = true;
    this.redditService.getPosts(this.currentSubreddit, 25, this.currentAfter, undefined, this.currentSort, this.settings.showNsfw).subscribe({
      next: (response) => {
        this.posts = [...this.posts, ...response.items];
        this.currentAfter = response.after;
        this.loadingMore = false;
      },
      error: (err) => {
        console.error('Error loading more posts', err);
        this.loadingMore = false;
      }
    });
  }

  changeSort(sort: string): void {
    if (this.currentSort === sort) return;
    this.currentSort = sort;
    this.posts = [];
    this.currentAfter = undefined;
    this.loadPosts();
  }

  onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    const threshold = 200;
    const position = element.scrollTop + element.clientHeight;
    const height = element.scrollHeight;

    if (position > height - threshold && this.currentAfter && !this.loadingMore) {
      this.loadMore();
    }
  }

  refresh(): void {
    this.posts = [];
    this.currentAfter = undefined;
    this.loadPosts();
  }

  selectPost(post: RedditPost): void {
    this.redditService.selectPost(post);
  }

  isRead(postId: string): boolean {
    return this.redditService.isRead(postId);
  }

  trackByPostId(index: number, post: RedditPost): string {
    return post.id;
  }

  getFolderName(): string {
    if (this.currentSubreddit === 'all') return 'Inbox';
    if (this.currentSubreddit === 'popular') return 'Popular';
    return `r/${this.currentSubreddit}`;
  }

  getPreviewText(post: RedditPost): string {
    if (post.selfText) {
      return post.selfText.substring(0, 120);
    }
    if (post.domain) {
      return post.domain;
    }
    return '';
  }

  getTypeLabel(type: PostType): string {
    switch (type) {
      case PostType.Image: return 'Image';
      case PostType.Video: return 'Video';
      case PostType.Link: return 'Link';
      case PostType.Gallery: return 'Gallery';
      default: return '';
    }
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
