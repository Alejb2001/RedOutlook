import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MailListComponent } from './components/mail-list/mail-list.component';
import { ReadingPaneComponent } from './components/reading-pane/reading-pane.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarComponent,
    SidebarComponent,
    MailListComponent,
    ReadingPaneComponent
  ],
  template: `
    <div class="app-container">
      <app-toolbar (sidebarToggle)="onSidebarToggle()"></app-toolbar>
      <div class="app-content">
        <app-sidebar
          *ngIf="sidebarVisible"
          (subredditChange)="onSubredditChange($event)">
        </app-sidebar>
        <app-mail-list [currentSubreddit]="currentSubreddit"></app-mail-list>
        <app-reading-pane></app-reading-pane>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background-color: #f5f5f5;
    }

    .app-content {
      flex: 1;
      display: flex;
      overflow: hidden;
      background-color: #ffffff;
    }
  `]
})
export class AppComponent implements OnInit {
  currentSubreddit = 'all';
  sidebarVisible = true;

  private readonly SIDEBAR_STORAGE_KEY = 'outlookReddit_sidebarVisible';

  ngOnInit(): void {
    const stored = localStorage.getItem(this.SIDEBAR_STORAGE_KEY);
    if (stored !== null) {
      this.sidebarVisible = stored === 'true';
    }
  }

  onSubredditChange(subreddit: string): void {
    this.currentSubreddit = subreddit;
  }

  onSidebarToggle(): void {
    this.sidebarVisible = !this.sidebarVisible;
    localStorage.setItem(this.SIDEBAR_STORAGE_KEY, String(this.sidebarVisible));
  }
}
