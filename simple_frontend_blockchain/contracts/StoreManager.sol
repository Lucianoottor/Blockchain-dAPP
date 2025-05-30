// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StoreManager {
    // Struct to store product information
    struct Product {
        uint256 id;
        string name;
        uint256 quantity;
        uint256 unitPrice;
        address seller;
        bool isPaid;
    }

    // Struct to store payment information
    struct Payment {
        address buyer;
        uint256 amount;
        uint256 timestamp;
    }

    // Mappings for storage
    mapping(uint256 => Product) public products;
    mapping(uint256 => Payment) public payments;
    uint256 public productCount;

    // Constructor
    constructor() {
        productCount = 0;
    }

    // Events
    event ProductCreated(
        uint256 indexed id,
        string name,
        uint256 quantity,
        uint256 unitPrice,
        address seller
    );

    event PaymentSuccessful(
        uint256 indexed productId,
        address buyer,
        address seller,
        uint256 amount
    );

    // Create a new product
    function createProduct(
        uint256 _id,
        string memory _name,
        uint256 _quantity,
        uint256 _unitPrice
    ) external {
        require(_quantity > 0, "Quantity must be positive");
        require(_unitPrice > 0, "Price must be positive");

        products[_id] = Product({
            id: _id,
            name: _name,
            quantity: _quantity,
            unitPrice: _unitPrice,
            seller: msg.sender,
            isPaid: false
        });

        productCount++;
        emit ProductCreated(_id, _name, _quantity, _unitPrice, msg.sender);
    }

    // Pay for a product
    function payForProduct(uint256 _productId) external payable {
        Product storage product = products[_productId];
        require(product.id == _productId, "Product does not exist");
        require(!product.isPaid, "Product already paid for");
        require(
            msg.value == (product.quantity * product.unitPrice),
            "Incorrect payment amount"
        );

        // Mark as paid
        product.isPaid = true;

        // Record payment
        payments[_productId] = Payment({
            buyer: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        });

        // Transfer funds to seller using call
        (bool success, ) = payable(product.seller).call{value: msg.value}("");
        require(success, "Transfer failed");

        emit PaymentSuccessful(
            _productId,
            msg.sender,
            product.seller,
            msg.value
        );
    }

    // Calculate total price (view function)
    function calculateTotalPrice(uint256 _productId)
        external
        view
        returns (uint256)
    {
        Product memory product = products[_productId];
        require(product.id == _productId, "Product does not exist");
        return product.quantity * product.unitPrice;
    }

    // Get product details (view function)
    function getProduct(uint256 _productId)
        external
        view
        returns (
            string memory,
            uint256,
            uint256,
            address,
            bool
        )
    {
        Product memory product = products[_productId];
        require(product.id == _productId, "Product does not exist");
        return (
            product.name,
            product.quantity,
            product.unitPrice,
            product.seller,
            product.isPaid
        );
    }
}