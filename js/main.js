import { ApiService } from './api.js';
import { TelegramService } from './telegram.js';

class App {
  constructor() {
    this.api = new ApiService();
    this.tg = new TelegramService();
    
    // Handle close buttons
    const closeBtn = document.getElementById('btn-close');
    const desktopCloseBtn = document.getElementById('btn-close-desktop');
    
    const handleClose = () => {
        if (this.tg.tg && this.tg.tg.close) {
            this.tg.tg.close();
        } else {
            console.log('Close button clicked (TWA not available)');
        }
    };

    if (closeBtn) closeBtn.addEventListener('click', handleClose);
    if (desktopCloseBtn) desktopCloseBtn.addEventListener('click', handleClose);
  }

  async init() {
    // Empty init
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
