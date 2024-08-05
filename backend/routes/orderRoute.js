const express = require("express")
const router = express.Router()
const { isAuthenticatedUser, authoriseRoles } = require('../middlewares/auth')
const { createOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderController")


router.route("/order/new").post(isAuthenticatedUser,createOrder)

router.route("/order/:id").get(isAuthenticatedUser,getSingleOrder)

router.route("/orders/me").get(isAuthenticatedUser,myOrders)

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authoriseRoles("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authoriseRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authoriseRoles("admin"), deleteOrder);

module.exports = router;

