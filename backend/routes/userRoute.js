const express = require('express');
const { registerUser, LoginUser, logoutUser, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser } = require('../controllers/userController');
const router = express.Router()
const {isAuthenticatedUser, authoriseRoles} = require("../middlewares/auth")

router.route("/register").post(registerUser)

router.route("/login").post(LoginUser)

router.route("/logout").get(logoutUser)

router.route("/me").get(isAuthenticatedUser,getUserDetails)

router.route("/password/update").put(isAuthenticatedUser,updatePassword)

router.route("/me/update").put(isAuthenticatedUser,updateProfile)

router.route("/admin/users").get(isAuthenticatedUser,authoriseRoles("admin"),getAllUsers)

router.route("/admin/user/:id").get(isAuthenticatedUser,authoriseRoles("admin"),getSingleUser)
    .put(isAuthenticatedUser,authoriseRoles("admin"),updateUserRole)
    .delete(isAuthenticatedUser,authoriseRoles("admin"),deleteUser)

module.exports = router;