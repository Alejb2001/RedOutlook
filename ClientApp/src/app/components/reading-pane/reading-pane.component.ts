import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RedditService } from '../../services/reddit.service';
import { RedditPost } from '../../models/reddit.models';

@Component({
  selector: 'app-reading-pane',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reading-pane">
      <ng-container *ngIf="selectedPost; else emptyState">
        <!-- Email Header -->
        <div class="email-header">
          <div class="email-actions">
            <button class="action-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1l-7 7h4v7h6V8h4L8 1z"/>
              </svg>
              Reply
            </button>
            <button class="action-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M15 8l-7-7v4H2v6h6v4l7-7z"/>
              </svg>
              Forward
            </button>
            <button class="action-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 2v12h12V2H2zm11 11H3V3h10v10z"/>
                <path d="M5 7h6v2H5z"/>
              </svg>
              Delete
            </button>
          </div>
        </div>

        <!-- Email Content -->
        <div class="email-content">
          <div class="email-subject">{{ selectedPost.title }}</div>

          <div class="email-meta">
            <div class="sender-info">
              <div class="avatar">{{ selectedPost.author.charAt(0).toUpperCase() }}</div>
              <div class="sender-details">
                <span class="sender-name">{{ selectedPost.author }}</span>
                <span class="sender-address">u/{{ selectedPost.author }}&#64;reddit.com</span>
              </div>
            </div>
            <div class="email-date">{{ formatDate(selectedPost.createdUtc) }}</div>
          </div>

          <div class="email-recipients">
            <span class="label">To:</span>
            <span class="value">r/{{ selectedPost.subreddit }}</span>
          </div>

          <div class="email-body">
            <div *ngIf="selectedPost.selfText" class="text-content">
              {{ selectedPost.selfText }}
            </div>

            <div *ngIf="!selectedPost.selfText && selectedPost.url" class="link-content">
              <a [href]="selectedPost.url" target="_blank" rel="noopener noreferrer">
                {{ selectedPost.url }}
              </a>
            </div>

            <div class="email-footer">
              <div class="stats">
                <span class="stat">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="#0078d4">
                    <path d="M8 1l2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z"/>
                  </svg>
                  {{ selectedPost.score }} points
                </span>
                <span class="stat">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="#0078d4">
                    <path d="M14 1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3v4l4-4h5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
                  </svg>
                  {{ selectedPost.numComments }} comments
                </span>
              </div>

              <a
                [href]="'https://reddit.com' + selectedPost.permalink"
                target="_blank"
                rel="noopener noreferrer"
                class="view-original">
                View on Reddit
              </a>
            </div>
          </div>
        </div>
      </ng-container>

      <ng-template #emptyState>
        <div class="empty-state">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="#c8c6c4">
            <path d="M64 16H16a4 4 0 0 0-4 4v40a4 4 0 0 0 4 4h48a4 4 0 0 0 4-4V20a4 4 0 0 0-4-4zm-2 6L40 42 18 22h44zm2 36H16V26l24 22 24-22v32z"/>
          </svg>
          <h2>Select a message to read</h2>
          <p>Choose a post from the list to view its content here.</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .reading-pane {
      flex: 1;
      height: 100%;
      background-color: white;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .email-header {
      padding: 12px 24px;
      border-bottom: 1px solid #edebe9;
    }

    .email-actions {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      padding: 8px 16px;
      border: 1px solid #8a8886;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #323130;
      transition: all 0.1s;
    }

    .action-btn:hover {
      background-color: #f3f2f1;
    }

    .email-content {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
    }

    .email-subject {
      font-size: 22px;
      font-weight: 600;
      color: #323130;
      margin-bottom: 20px;
      line-height: 1.3;
    }

    .email-meta {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .sender-info {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #0078d4;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 600;
    }

    .sender-details {
      display: flex;
      flex-direction: column;
    }

    .sender-name {
      font-size: 14px;
      font-weight: 600;
      color: #323130;
    }

    .sender-address {
      font-size: 13px;
      color: #605e5c;
    }

    .email-date {
      font-size: 13px;
      color: #605e5c;
    }

    .email-recipients {
      padding: 8px 0;
      font-size: 13px;
      color: #605e5c;
      border-bottom: 1px solid #edebe9;
      margin-bottom: 20px;
    }

    .email-recipients .label {
      margin-right: 8px;
    }

    .email-recipients .value {
      color: #0078d4;
    }

    .email-body {
      font-size: 14px;
      line-height: 1.6;
      color: #323130;
    }

    .text-content {
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .link-content a {
      color: #0078d4;
      text-decoration: none;
    }

    .link-content a:hover {
      text-decoration: underline;
    }

    .email-footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #edebe9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .stats {
      display: flex;
      gap: 24px;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: #605e5c;
    }

    .view-original {
      color: #0078d4;
      text-decoration: none;
      font-size: 14px;
    }

    .view-original:hover {
      text-decoration: underline;
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

    .empty-state h2 {
      font-size: 20px;
      font-weight: 600;
      color: #323130;
      margin: 20px 0 8px 0;
    }

    .empty-state p {
      font-size: 14px;
      margin: 0;
    }
  `]
})
export class ReadingPaneComponent {
  selectedPost: RedditPost | null = null;

  constructor(private redditService: RedditService) {
    this.redditService.selectedPost$.subscribe(post => {
      this.selectedPost = post;
    });
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
