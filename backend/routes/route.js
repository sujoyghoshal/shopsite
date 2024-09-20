const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware.js');

const {
    sellerRegister,
    sellerLogIn
} = require('../controllers/sellerController.js');

const {
    productCreate,
    getProducts,
    getProductDetail,
    searchProduct,
    searchProductbyCategory,
    searchProductbySubCategory,
    getSellerProducts,
    updateProduct,
    deleteProduct,
    deleteProducts,
    deleteProductReview,
    deleteAllProductReviews,
    addReview,
    getInterestedCustomers,
    getAddedToCartProducts,
} = require('../controllers/productController.js');

const {
    customerRegister,
    customerLogIn,
    getCartDetail,
    cartUpdate,
    getCartCount
} = require('../controllers/customerController.js');

const {
    newOrder,
    getOrderedProductsByCustomer,
    getOrderedProductsBySeller,
    getTotalOrderCount,
    getWeeklySales
} = require('../controllers/orderController.js');

// Seller Routes
router.post('/SellerRegister', sellerRegister);
router.post('/SellerLogin', sellerLogIn);

// Product Routes
router.post('/ProductCreate', productCreate);
router.get('/getSellerProducts/:id', getSellerProducts);
router.get('/getProducts', getProducts);
router.get('/getProductDetail/:id', getProductDetail);
router.get('/getInterestedCustomers/:id', getInterestedCustomers);
router.get('/getAddedToCartProducts/:id', getAddedToCartProducts);
router.put('/ProductUpdate/:id', updateProduct);
router.put('/addReview/:id', addReview);
router.get('/searchProduct/:key', searchProduct);
router.get('/searchProductbyCategory/:key', searchProductbyCategory);
router.get('/searchProductbySubCategory/:key', searchProductbySubCategory);
router.delete('/DeleteProduct/:id', deleteProduct);
router.delete('/DeleteProducts/:id', deleteProducts);
router.put('/deleteProductReview/:id', deleteProductReview);
router.delete('/deleteAllProductReviews/:id', deleteAllProductReviews);

// Customer Routes
router.post('/CustomerRegister', customerRegister);
router.post('/CustomerLogin', customerLogIn);
router.get('/getCartDetail/:id', getCartDetail);
router.put('/CustomerUpdate/:id', cartUpdate);
router.get('/getCartCount/:id', getCartCount);

// Order Routes
router.post('/NewOrder', newOrder);
router.get('/getOrderedProductsByCustomer/:id', getOrderedProductsByCustomer);
router.get('/getOrderedProductsBySeller/:id', getOrderedProductsBySeller);
router.get('/getTotalOrderCount', getTotalOrderCount);
router.get('/getWeeklySales', getWeeklySales);

module.exports = router;
