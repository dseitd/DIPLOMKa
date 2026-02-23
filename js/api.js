// Simulating API fetch
export class ApiService {
  constructor(baseUrl = './data') {
    this.baseUrl = baseUrl;
  }

  async getProducts() {
    try {
      // In a real app, this would be a fetch to a remote server
      const response = await fetch(`${this.baseUrl}/products.json`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      return [];
    }
  }
}
