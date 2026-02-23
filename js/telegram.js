
export class TelegramService {
  constructor() {
    this.tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
    if (this.tg) {
      this.init();
    }
  }

  init() {
    if (!this.tg) return;
    this.tg.ready();
    this.tg.expand();
    
    // Set header color to match the theme (secondary_bg_color to match our new header bar)
    this.tg.setHeaderColor(this.tg.themeParams.secondary_bg_color || '#ffffff');
    this.tg.setBackgroundColor(this.tg.themeParams.bg_color || '#ffffff');

    // Hide the native Telegram close button because we implemented custom ones
    if (this.tg.BackButton) this.tg.BackButton.hide();


    // Listen for theme changes
    this.tg.onEvent('themeChanged', () => {
        this.updateTheme();
    });
    this.updateTheme();
  }

  updateTheme() {
    if (!this.tg) return;
    const params = this.tg.themeParams;
    if (!params) return;

    // Helper to set property only if value exists
    const setProp = (name, value) => {
        if (value) {
            document.documentElement.style.setProperty(name, value);
        }
    };

    setProp('--tg-theme-bg-color', params.bg_color);
    setProp('--tg-theme-text-color', params.text_color);
    setProp('--tg-theme-hint-color', params.hint_color);
    setProp('--tg-theme-link-color', params.link_color);
    setProp('--tg-theme-button-color', params.button_color);
    setProp('--tg-theme-button-text-color', params.button_text_color);
    setProp('--tg-theme-secondary-bg-color', params.secondary_bg_color);
  }

  showMainButton(text, onClick) {
    if (!this.tg) return;
    this.tg.MainButton.setText(text);
    this.tg.MainButton.show();
    
    // Remove previous listeners to avoid duplicates
    if (this.currentOnClick) {
        this.tg.MainButton.offClick(this.currentOnClick);
    }
    
    this.currentOnClick = onClick;
    this.tg.MainButton.onClick(onClick);
  }

  hideMainButton() {
    if (!this.tg) return;
    this.tg.MainButton.hide();
    if (this.currentOnClick) {
        this.tg.MainButton.offClick(this.currentOnClick);
        this.currentOnClick = null;
    }
  }
  
  hapticFeedback(style = 'light') {
    if (!this.tg || !this.tg.HapticFeedback) return;
    this.tg.HapticFeedback.impactOccurred(style);
  }
}
