import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RedditService } from '../../services/reddit.service';
import { RedditPost, PostType } from '../../models/reddit.models';

@Component({
  selector: 'app-reading-pane',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reading-pane">
      <ng-container *ngIf="selectedPost; else emptyState">
        <!-- Action Bar -->
        <div class="action-bar">
          <div class="action-group">
            <button class="action-btn primary" title="Reply">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M6 8L1 4v8l5-4zm1-1l7-5H2l7 5zm7 1l-5 4V7h-2v5l-5-4v6h12V8z"/>
              </svg>
              <span>Reply</span>
            </button>
            <button class="action-btn" title="Reply all">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M8 4L3 8l5 4V9h3V7H8V4zM6 2v3L0 8l6 3v3l8-6-8-6z"/>
              </svg>
              <span>Reply all</span>
            </button>
            <button class="action-btn" title="Forward">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M10 4v3H3v2h7v3l5-4-5-4z"/>
              </svg>
              <span>Forward</span>
            </button>
          </div>

          <div class="action-separator"></div>

          <div class="action-group">
            <button class="action-btn" title="Delete">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1z"/>
              </svg>
            </button>
            <button class="action-btn" title="Archive">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
              </svg>
            </button>
            <button class="action-btn" title="Mark as unread" (click)="markAsUnread()">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm12 2v.217l-6 3.6-6-3.6V4h12zm-12 2.383l5.36 3.216a1 1 0 0 0 1.028.052L14 6.383V12H2V6.383z"/>
              </svg>
            </button>
          </div>

          <div class="action-group more-actions">
            <button class="action-btn" title="More actions">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Email Content -->
        <div class="email-content">
          <!-- Subject -->
          <h1 class="email-subject">{{ selectedPost.title }}</h1>

          <!-- Important/Flair badges -->
          <div class="email-badges" *ngIf="selectedPost.isImportant || selectedPost.flair">
            <span class="badge important" *ngIf="selectedPost.isImportant">
              <svg width="12" height="12" viewBox="0 0 16 16">
                <path d="M8 1l2 4.5 5 .5-3.5 3.5 1 5L8 12l-4.5 2.5 1-5L1 6l5-.5L8 1z"/>
              </svg>
              Important
            </span>
            <span class="badge flair" *ngIf="selectedPost.flair">{{ selectedPost.flair }}</span>
          </div>

          <!-- Sender info -->
          <div class="sender-section">
            <div class="avatar" [style.backgroundColor]="getAvatarColor(selectedPost.author)">
              {{ selectedPost.author.charAt(0).toUpperCase() }}
            </div>
            <div class="sender-info">
              <div class="sender-row">
                <span class="sender-name">{{ selectedPost.author }}</span>
                <span class="sender-email">&lt;u/{{ selectedPost.author }}&#64;reddit.com&gt;</span>
              </div>
              <div class="recipient-row">
                <span class="label">To:</span>
                <span class="recipient">r/{{ selectedPost.subreddit }}</span>
              </div>
            </div>
            <div class="date-section">
              <span class="date">{{ formatDate(selectedPost.createdUtc) }}</span>
            </div>
          </div>

          <!-- Attachment indicator -->
          <div class="attachment-bar" *ngIf="selectedPost.hasAttachment">
            <svg width="14" height="14" viewBox="0 0 16 16">
              <path d="M4.5 3A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h5a.5.5 0 0 1 0 1h-5A2.5 2.5 0 0 1 2 11.5v-7A2.5 2.5 0 0 1 4.5 2h7A2.5 2.5 0 0 1 14 4.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 0 11.5 3h-7z"/>
              <path d="M10 10a1 1 0 1 1 2 0v4.5a2.5 2.5 0 0 1-5 0v-5a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 0 3 0V10z"/>
            </svg>
            <span>1 attachment</span>
            <a [href]="selectedPost.url" target="_blank" rel="noopener noreferrer" class="attachment-link">
              {{ getDomainFromUrl(selectedPost.url) }}
            </a>
          </div>

          <!-- Message body -->
          <div class="message-body">
            <!-- Self text with HTML rendering -->
            <div *ngIf="selectedPost.selfTextHtml" class="html-content" [innerHTML]="getSafeHtml(selectedPost.selfTextHtml)"></div>

            <!-- Plain text fallback -->
            <div *ngIf="!selectedPost.selfTextHtml && selectedPost.selfText" class="text-content">
              {{ selectedPost.selfText }}
            </div>

            <!-- Image post -->
            <div *ngIf="selectedPost.type === PostType.Image && selectedPost.url" class="media-content">
              <img [src]="selectedPost.url" alt="Post image" class="post-image" loading="lazy">
            </div>

            <!-- Link post (when no self text) -->
            <div *ngIf="!selectedPost.selfText && !selectedPost.selfTextHtml && selectedPost.url" class="link-content">
              <a [href]="selectedPost.url" target="_blank" rel="noopener noreferrer" class="external-link">
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <path d="M4.715 6.542L3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/>
                  <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 0 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 0 0-4.243-4.243L6.586 4.672z"/>
                </svg>
                {{ selectedPost.url }}
              </a>
            </div>
          </div>

          <!-- Footer stats -->
          <div class="email-footer">
            <div class="stats">
              <div class="stat">
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <path d="M8 1a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 1z"/>
                </svg>
                <span>{{ formatNumber(selectedPost.score) }} points</span>
              </div>
              <div class="stat">
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <path d="M14 1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3v4l4-4h5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
                </svg>
                <span>{{ formatNumber(selectedPost.numComments) }} comments</span>
              </div>
            </div>
            <a [href]="'https://reddit.com' + selectedPost.permalink"
               target="_blank"
               rel="noopener noreferrer"
               class="view-reddit">
              View on Reddit
              <svg width="12" height="12" viewBox="0 0 16 16">
                <path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                <path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
              </svg>
            </a>
          </div>
        </div>
      </ng-container>

      <ng-template #emptyState>
        <div class="empty-state">
          <div class="empty-icon">
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
              <rect x="10" y="20" width="80" height="60" rx="4" stroke="#c8c6c4" stroke-width="2"/>
              <path d="M10 28l40 25 40-25" stroke="#c8c6c4" stroke-width="2"/>
              <circle cx="50" cy="50" r="15" fill="#f3f2f1" stroke="#c8c6c4" stroke-width="2"/>
              <path d="M45 50l4 4 8-8" stroke="#0078d4" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h2>Select an item to read</h2>
          <p>Nothing is selected</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .reading-pane {
      flex: 1;
      height: 100%;
      background-color: #ffffff;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .action-bar {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      border-bottom: 1px solid #edebe9;
      background: #faf9f8;
      gap: 4px;
    }

    .action-group {
      display: flex;
      gap: 2px;
    }

    .action-separator {
      width: 1px;
      height: 24px;
      background: #edebe9;
      margin: 0 8px;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: 4px;
      font-size: 13px;
      color: #323130;
      transition: background-color 0.1s;
    }

    .action-btn:hover {
      background-color: #edebe9;
    }

    .action-btn.primary {
      background-color: #0078d4;
      color: white;
    }

    .action-btn.primary:hover {
      background-color: #106ebe;
    }

    .action-btn.primary svg {
      fill: white;
    }

    .action-btn svg {
      fill: #323130;
    }

    .more-actions {
      margin-left: auto;
    }

    .email-content {
      flex: 1;
      overflow-y: auto;
      padding: 20px 24px;
    }

    .email-subject {
      font-size: 21px;
      font-weight: 600;
      color: #323130;
      margin: 0 0 12px 0;
      line-height: 1.3;
    }

    .email-badges {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .badge.important {
      background: #fde7e9;
      color: #a80000;
    }

    .badge.important svg {
      fill: #a80000;
    }

    .badge.flair {
      background: #deecf9;
      color: #0078d4;
    }

    .sender-section {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px 0;
      border-bottom: 1px solid #edebe9;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 600;
      color: white;
      flex-shrink: 0;
    }

    .sender-info {
      flex: 1;
      min-width: 0;
    }

    .sender-row {
      display: flex;
      align-items: baseline;
      gap: 8px;
      flex-wrap: wrap;
    }

    .sender-name {
      font-size: 14px;
      font-weight: 600;
      color: #323130;
    }

    .sender-email {
      font-size: 13px;
      color: #605e5c;
    }

    .recipient-row {
      margin-top: 4px;
      font-size: 13px;
      color: #605e5c;
    }

    .recipient-row .label {
      margin-right: 4px;
    }

    .recipient {
      color: #0078d4;
    }

    .date-section {
      flex-shrink: 0;
    }

    .date {
      font-size: 13px;
      color: #605e5c;
    }

    .attachment-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      margin: 16px 0;
      background: #f3f2f1;
      border-radius: 4px;
      font-size: 13px;
      color: #323130;
    }

    .attachment-bar svg {
      fill: #605e5c;
    }

    .attachment-link {
      color: #0078d4;
      text-decoration: none;
      margin-left: auto;
    }

    .attachment-link:hover {
      text-decoration: underline;
    }

    .message-body {
      padding: 20px 0;
      font-size: 14px;
      line-height: 1.6;
      color: #323130;
    }

    .html-content {
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    .html-content :deep(a) {
      color: #0078d4;
    }

    .html-content :deep(pre) {
      background: #f3f2f1;
      padding: 12px;
      border-radius: 4px;
      overflow-x: auto;
    }

    .html-content :deep(code) {
      background: #f3f2f1;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Consolas', monospace;
    }

    .html-content :deep(blockquote) {
      border-left: 4px solid #0078d4;
      margin: 16px 0;
      padding: 8px 16px;
      background: #f9f9f9;
    }

    .text-content {
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .media-content {
      margin: 16px 0;
    }

    .post-image {
      max-width: 100%;
      max-height: 500px;
      border-radius: 4px;
      object-fit: contain;
    }

    .link-content {
      margin: 16px 0;
    }

    .external-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #0078d4;
      text-decoration: none;
      padding: 12px 16px;
      background: #f3f2f1;
      border-radius: 4px;
      word-break: break-all;
    }

    .external-link:hover {
      background: #edebe9;
    }

    .external-link svg {
      fill: #0078d4;
      flex-shrink: 0;
    }

    .email-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 20px;
      margin-top: 20px;
      border-top: 1px solid #edebe9;
    }

    .stats {
      display: flex;
      gap: 20px;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #605e5c;
    }

    .stat svg {
      fill: #0078d4;
    }

    .view-reddit {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #0078d4;
      text-decoration: none;
      font-size: 13px;
    }

    .view-reddit:hover {
      text-decoration: underline;
    }

    .view-reddit svg {
      fill: #0078d4;
    }

    .empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #605e5c;
      text-align: center;
      padding: 40px;
    }

    .empty-icon {
      margin-bottom: 16px;
    }

    .empty-state h2 {
      font-size: 18px;
      font-weight: 600;
      color: #323130;
      margin: 0 0 8px 0;
    }

    .empty-state p {
      font-size: 14px;
      margin: 0;
    }
  `]
})
export class ReadingPaneComponent {
  selectedPost: RedditPost | null = null;
  PostType = PostType;

  // Colors for avatar
  private avatarColors = [
    '#0078d4', '#107c10', '#5c2d91', '#d83b01',
    '#008272', '#e81123', '#00188f', '#8764b8'
  ];

  constructor(
    private redditService: RedditService,
    private sanitizer: DomSanitizer
  ) {
    this.redditService.selectedPost$.subscribe(post => {
      this.selectedPost = post;
    });
  }

  getSafeHtml(html: string): SafeHtml {
    // Clean up Reddit's HTML
    let cleanHtml = html
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/<!-- SC_OFF -->/g, '')
      .replace(/<!-- SC_ON -->/g, '');

    return this.sanitizer.bypassSecurityTrustHtml(cleanHtml);
  }

  getAvatarColor(username: string): string {
    const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return this.avatarColors[hash % this.avatarColors.length];
  }

  getDomainFromUrl(url: string): string {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  markAsUnread(): void {
    if (this.selectedPost) {
      this.redditService.markAsUnread(this.selectedPost.id);
    }
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
}
