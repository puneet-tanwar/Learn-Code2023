class DuplicateProductException extends Error {
    constructor(message) {
      super(message);
      this.name = 'DuplicateProductException';
    }
}

class ProductNotFoundException extends Error {
    constructor(message) {
      super(message);
      this.name = 'ProductNotFoundException';
    }
}

class InsufficientQuantityException extends Error {
    constructor(message) {
      super(message);
      this.name = 'InsufficientQuantityException';
    }
}

class NegativeInputException extends Error {
    constructor(message) {
        super(message);
        this.name = "NegativeValueException";
    }
}

module.exports = {
    DuplicateProductException,
    ProductNotFoundException,
    InsufficientQuantityException,
    NegativeInputException,
};
