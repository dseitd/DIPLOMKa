import { ApiService } from './api.js';
import { TelegramService } from './telegram.js';

class App {
  constructor() {
    this.api = new ApiService();
    this.tg = new TelegramService();
    this.products = [];
    this.filteredProducts = [];
    
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
    const filtersButton = document.querySelector('.catalog-filters');
    const filtersClose = document.querySelector('.filter-close');
    const filtersApply = document.querySelector('.filter-apply');
    const filtersReset = document.querySelector('.filter-reset');
    const filtersBackdrop = document.querySelector('.catalog-backdrop');
    const filterInputs = Array.from(document.querySelectorAll('input[data-filter]'));
    this.catalogGrid = document.getElementById('catalog-grid');
    this.catalogCount = document.querySelector('.catalog-count');
    const setFiltersOpen = (isOpen) => {
      document.body.classList.toggle('filters-open', isOpen);
    };

    if (filtersButton) {
      filtersButton.addEventListener('click', () => setFiltersOpen(true));
    }
    if (filtersClose) {
      filtersClose.addEventListener('click', () => setFiltersOpen(false));
    }
    if (filtersApply) {
      filtersApply.addEventListener('click', () => {
        this.applyFilters();
        setFiltersOpen(false);
      });
    }
    if (filtersReset) {
      filtersReset.addEventListener('click', () => {
        filterInputs.forEach((input) => {
          input.checked = false;
        });
        this.applyFilters();
        setFiltersOpen(false);
      });
    }
    if (filtersBackdrop) {
      filtersBackdrop.addEventListener('click', () => setFiltersOpen(false));
    }

    filterInputs.forEach((input) => {
      input.addEventListener('change', () => this.applyFilters());
    });

    this.products = await this.api.getProducts();
    this.applyFilters();
  }

  normalizeValue(value) {
    return String(value || '').trim().toLowerCase();
  }

  getSelectedValues(type) {
    return Array.from(document.querySelectorAll(`input[data-filter="${type}"]:checked`)).map((input) =>
      this.normalizeValue(input.value)
    );
  }

  applyFilters() {
    const selectedCategories = this.getSelectedValues('category');
    const selectedSizes = this.getSelectedValues('size');
    const selectedColors = this.getSelectedValues('color');
    this.syncFilterOptionStates();

    this.filteredProducts = this.products.filter((product) => {
      const categoryMatch =
        selectedCategories.length === 0 || selectedCategories.includes(this.normalizeValue(product.category));
      const sizeMatch =
        selectedSizes.length === 0 || selectedSizes.includes(this.normalizeValue(product.size));
      const colorMatch =
        selectedColors.length === 0 || selectedColors.includes(this.normalizeValue(product.color));
      return categoryMatch && sizeMatch && colorMatch;
    });

    if (this.catalogCount) {
      this.catalogCount.textContent = `${this.filteredProducts.length} Products`;
    }

    this.renderProducts(this.filteredProducts);
  }

  syncFilterOptionStates() {
    const inputs = Array.from(document.querySelectorAll('input[data-filter]'));
    inputs.forEach((input) => {
      const label = input.closest('.filter-option');
      if (!label) return;
      label.classList.toggle('is-checked', input.checked);
    });
  }

  renderProducts(products) {
    if (!this.catalogGrid) return;
    this.catalogGrid.innerHTML = '';

    if (products.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'catalog-empty';
      empty.textContent = 'Нет товаров по выбранным фильтрам';
      this.catalogGrid.appendChild(empty);
      return;
    }

    products.forEach((product) => {
      const card = document.createElement('article');
      card.className = 'catalog-card';

      const image = document.createElement('div');
      image.className = 'card-image';

      const badge = document.createElement('span');
      badge.className = 'card-badge';
      badge.textContent = String(product.category || '').toUpperCase();

      image.appendChild(badge);

      const title = document.createElement('div');
      title.className = 'card-title';
      title.textContent = product.name || '';

      const price = document.createElement('div');
      price.className = 'card-price';
      price.textContent = `${product.price} ₽`;

      card.appendChild(image);
      card.appendChild(title);
      card.appendChild(price);
      this.catalogGrid.appendChild(card);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
