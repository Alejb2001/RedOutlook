import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppSettings {
  showSortTabs: boolean;
  hideImages: boolean;
  showNsfw: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  showSortTabs: true,
  hideImages: false,
  showNsfw: false
};

const STORAGE_KEY = 'outlookReddit_settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settingsSubject = new BehaviorSubject<AppSettings>(DEFAULT_SETTINGS);
  settings$ = this.settingsSubject.asObservable();

  constructor() {
    this.loadSettings();
  }

  get settings(): AppSettings {
    return this.settingsSubject.value;
  }

  updateSettings(partial: Partial<AppSettings>): void {
    const newSettings = { ...this.settings, ...partial };
    this.settingsSubject.next(newSettings);
    this.saveSettings();
  }

  toggleShowSortTabs(): void {
    this.updateSettings({ showSortTabs: !this.settings.showSortTabs });
  }

  toggleHideImages(): void {
    this.updateSettings({ hideImages: !this.settings.hideImages });
  }

  toggleShowNsfw(): void {
    this.updateSettings({ showNsfw: !this.settings.showNsfw });
  }

  private loadSettings(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<AppSettings>;
        this.settingsSubject.next({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch {
      this.settingsSubject.next(DEFAULT_SETTINGS);
    }
  }

  private saveSettings(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
  }
}
