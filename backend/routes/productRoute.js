const express = require('express')
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, productReviews, deleteReview } = require('../controllers/productController')
const { isAuthenticatedUser, authoriseRoles } = require('../middlewares/auth')
const router = express.Router()

router.route("/products").get( getAllProducts)

router.route("/admin/product/new").post(isAuthenticatedUser, authoriseRoles("admin"), createProduct)

router.route("/admin/product/:id").put(isAuthenticatedUser, authoriseRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authoriseRoles("admin"), deleteProduct)
    
router.route("/product/:id").get(isAuthenticatedUser, authoriseRoles("admin"), getProductDetails)

router.route("/review/new").post(isAuthenticatedUser,createProductReview)

router.route("/reviews").post(isAuthenticatedUser,productReviews).delete(isAuthenticatedUser,deleteReview)

module.exports = router;