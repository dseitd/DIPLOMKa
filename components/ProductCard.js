export class ProductCard {
  constructor(product) {
    this.product = product;
  }

  render() {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = this.product.id;

    // Placeholder for 3D model or image
    // Since these are GLB files, we might need a viewer, but for now just showing info
    const imagePlaceholder = document.createElement('div');
    imagePlaceholder.className = 'product-image-placeholder';
    imagePlaceholder.textContent = '3D Model Preview';

    const info = document.createElement('div');
    info.className = 'product-info';

    const title = document.createElement('h3');
    title.textContent = this.product.name;

    const category = document.createElement('p');
    category.className = 'category';
    category.textContent = this.product.category;

    const price = document.createElement('p');
    price.className = 'price';
    price.textContent = `${this.product.price} ₽`;

    const button = document.createElement('button');
    button.className = 'add-btn';
    button.textContent = 'Добавить';
    button.onclick = (e) => {
        e.stopPropagation(); // Prevent card click if necessary
        // Dispatch custom event for main app to handle
        card.dispatchEvent(new CustomEvent('product-selected', { 
            detail: { product: this.product },
            bubbles: true 
        }));
    };

    info.appendChild(title);
    info.appendChild(category);
    info.appendChild(price);
    info.appendChild(button);

    card.appendChild(imagePlaceholder);
    card.appendChild(info);

    return card;
  }
}
