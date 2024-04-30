const {
  DuplicateProductException,
  NegativeInputException,
  ProductNotFoundException,
  InsufficientQuantityException,
} = require("./exceptions");

class Inventory {
  constructor() {
    this.products = [
      { id: "001", name: "Laptop", price: 999.99, quantity: 20 },
      { id: "002", name: "Smartphone", price: 699.99, quantity: 50 },
      { id: "003", name: "Headphones", price: 99.99, quantity: 100 },
      { id: "004", name: "Tablet", price: 299.99, quantity: 30 },
      { id: "005", name: "Speaker", price: 149.99, quantity: 40 },
    ];
  }

  addProduct(id, name, price, quantity) {
    if (this.getProductById(id)) {
      throw new DuplicateProductException(`Product with same ID exists`);
    }
    if (price < 0 || quantity < 0) {
      throw new NegativeInputException("Invalid Price or Quantity");
    }
    const product = { id, name, price, quantity };
    this.products.push(product);
  }

  updateProduct(id, newName, newPrice, newQuantity) {
    const product = this.getProductById(id);
    if (!product) {
      throw new ProductNotFoundException(`Product not found.`);
    }
    if (newPrice < 0 || newQuantity < 0) {
      throw new NegativeInputException("Invalid Price or Quantity");
    }
    product.name = newName;
    product.price = newPrice;
    product.quantity = newQuantity;
  }

  deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      throw new ProductNotFoundException(`Product not found.`);
    }
    this.products.splice(index, 1);
  }

  getProductById(id) {
    return this.products.find((product) => product.id === id);
  }

  sellProduct(id, quantity) {
    const product = this.getProductById(id);
    if (!product) {
      throw new ProductNotFoundException(`Product not found.`);
    }
    if (quantity > product.quantity) {
      throw new InsufficientQuantityException(
        `Required Quantity not available`
      );
    }
    product.quantity -= quantity;
  }

  showProducts() {
    if (this.products.length === 0) {
      console.log("No products in the inventory.");
    } else {
      console.log("Current products in the inventory:");
      this.products.forEach((product) => {
        console.table(product)
      });
    }
  }
}

module.exports = { Inventory };
