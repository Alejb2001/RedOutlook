import { Component } from '@angular/core';
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
      <app-toolbar></app-toolbar>
      <div class="app-content">
        <app-sidebar (subredditChange)="onSubredditChange($event)"></app-sidebar>
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
    }

    .app-content {
      flex: 1;
      display: flex;
      overflow: hidden;
    }
  `]
})
export class AppComponent {
  currentSubreddit = 'all';

  onSubredditChange(subreddit: string): void {
    this.currentSubreddit = subreddit;
  }
}
