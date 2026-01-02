import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeKey = 'facturepro_dark_mode';
  private isDarkModeSubject = new BehaviorSubject<boolean>(this.loadDarkMode());
  isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor() {
    this.applyTheme(this.isDarkModeSubject.value);
  }

  private loadDarkMode(): boolean {
    const stored = localStorage.getItem(this.darkModeKey);
    return stored === 'true';
  }

  toggleDarkMode() {
    const newValue = !this.isDarkModeSubject.value;
    this.isDarkModeSubject.next(newValue);
    localStorage.setItem(this.darkModeKey, String(newValue));
    this.applyTheme(newValue);
  }

  private applyTheme(isDark: boolean) {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }
}
