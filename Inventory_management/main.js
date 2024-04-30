const { DuplicateProductException, InvalidInputDataException, ProductNotFoundException, InsufficientQuantityException } = require('./exceptions');
const { Inventory } = require('./inventory');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const myInventory = new Inventory();

function addProduct() {
    rl.question('Enter product ID: ', id => {
        rl.question('Enter product name: ', name => {
            rl.question('Enter product price: ', price => {
                rl.question('Enter product quantity: ', quantity => {
                    try {
                        myInventory.addProduct(id, name, parseFloat(price), parseInt(quantity));
                        console.log('Product added successfully.');
                    } catch (error) {
                        handleException(error);
                    } finally {
                        mainMenu();
                    }
                });
            });
        });
    });
}

function updateProduct() {
    rl.question('Enter product ID to update: ', id => {
        const product = myInventory.getProductById(id);
        if (!product) {
            console.log(`Product with ID ${id} not found.`);
            mainMenu();
            return;
        }
        rl.question('Enter new name: ', newName => {
            rl.question('Enter new price: ', newPrice => {
                rl.question('Enter new quantity: ', newQuantity => {
                    try {
                        myInventory.updateProduct(id, newName, parseFloat(newPrice), parseInt(newQuantity));
                        console.log('Product updated successfully.');
                    } catch (error) {
                        handleException(error);
                    } finally {
                        mainMenu();
                    }
                });
            });
        });
    });
}

function deleteProduct() {
    rl.question('Enter product ID to delete: ', id => {
        try {
            myInventory.deleteProduct(id);
            console.log('Product deleted successfully.');
        } catch (error) {
            handleException(error);
        } finally {
            mainMenu();
        }
    });
}

function sellProduct() {
    rl.question('Enter product ID to sell: ', id => {
        const product = myInventory.getProductById(id);
        if (!product) {
            console.log(`Product with ID ${id} not found.`);
            mainMenu();
            return;
        }
        rl.question('Enter quantity to sell: ', quantity => {
            try {
                myInventory.sellProduct(id, parseInt(quantity));
                console.log('Product sold successfully.');
            } catch (error) {
                handleException(error);
            } finally {
                mainMenu();
            }
        });
    });
}

function showProducts() {
    myInventory.showProducts();
    mainMenu();
}

function displayMenu() {
    console.log('1. Add Product');
    console.log('2. Update Product');
    console.log('3. Delete Product');
    console.log('4. Sell Product');
    console.log('5. Show Products');
    console.log('6. Exit');
}

function mainMenu() {
    displayMenu();
    rl.question('Enter your choice: ', choice => {
        switch (choice) {
            case '1':
                addProduct();
                break;
            case '2':
                updateProduct();
                break;
            case '3':
                deleteProduct();
                break;
            case '4':
                sellProduct();
                break;
            case '5':
                showProducts();
                break;
            case '6':
                rl.close();
                break;
            default:
                console.log('Invalid choice. Please try again.');
                mainMenu();
        }
    });
}

function handleException(error) {
    if (error instanceof DuplicateProductException) {
        console.log(error.message);
    } else if (error instanceof InvalidInputDataException) {
        console.log('Invalid input:', error.message);
    } else if (error instanceof ProductNotFoundException) {
        console.log(error.message);
    } else if (error instanceof InsufficientQuantityException) {
        console.log(error.message);
    } else {
        console.log('Unknown error occurred:', error.message);
    }
}

mainMenu();
