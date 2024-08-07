const Product = require("../models/productModel")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncError = require("../middlewares/catchAsyncError")
const ApiFeatures = require("../utils/apiFeatures")

// create Product -admin
exports.createProduct = catchAsyncError(async(req,res,next)=>{
    const product = await Product.create(req.body)
    res.status(201).json({
        success:true,
        product
    })
})

// get all products -admin
exports.getAllProducts = catchAsyncError(async(req,res)=>{
    const resultsPerPage = 5;
    const apiFeatures = new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultsPerPage)
    const products = await apiFeatures.query;
    res.status(200).json({
        success:true,
        products
    })
})

// Get product Details
exports.getProductDetails = catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler("Product Not Found",404))
    }
    res.status(200).json({
        success:true,
        product
    })
})

// update Product -admin
exports.updateProduct = catchAsyncError(async(req,res,next)=>{
    let product = await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler("Product Not Found",404))
    }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:true
    })
    res.status(200).json({
        success:true,
        product
    })
})

// Delete Product 
exports.deleteProduct = catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler("Product Not Found",404))
    }
    await product.deleteOne()
    res.status(200).json({
        success:true,
        message:"Product Deleted"
    })
})

// Create new review or update the review
exports.createProductReview = catchAsyncError(async(req,res,next)=>{
    const {rating,comment,productId} = req.body;
    const review = {
        user:req.user.id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }
    const product = await Product.findById(productId)

    const isReviewed = product.reviews.forEach((rev)=>{
        rev.user.toString() === req.user._id.toString()
    })
    if(isReviewed){
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
              (rev.rating = rating), (rev.comment = comment);
          });
    }else{
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
    }
    let avg = 0;
    product.reviews.forEach((rev)=>{
        avg += rev.rating
    })
    product.ratings = avg / product.reviews.length
    await product.save({ validateBeforeSave: false })
    res.status(200).json({
        success:true
    })
})

// Get all reviews of a product
exports.productReviews = catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.query.id)
    if(!product){
        return next(new ErrorHandler("Product Not Found",404))
    }
    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
})


// Delete Review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
    let avg = 0;
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
    await Product.findByIdAndUpdate(req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },{
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
    res.status(200).json({
      success: true,
    });
  });