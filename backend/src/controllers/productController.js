import productModel from '../models/productModel.js';
import Product from '../models/productModel.js';

export const createProductController = async (req, res) => {
  try {
    const { category, name, price } = req.body;
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product with same name is Already Present',
      });
    }
    const product = await Product.create({ category, name, price });
    res.json({
      success: true,
      message: 'Product Created Succesfully',
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error on CreateProductController' });
  }
};

export const getAllProductController = async (req, res) => {
  try {
    const allProducts = await Product.find().lean();
    res.status(200).json({
      success: true,
      message: 'All Products Fetched Succesfully',
      products: allProducts,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: 'Error in GetAllProductController' });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const { name } = req.params;
    const singleProduct = await Product.findOne({ name });
    if (!singleProduct) {
      res.status(400).json({
        success: false,
        message: 'Product not Found',
      });
    }
    return res.status(200).json({
      success: false,
      message: 'Product fetched succesfully',
      data: singleProduct,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: 'Error in GetSingleProductController' });
  }
};

export const singleProductUpdateController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error in SingleProductUpdateController: ', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
export const productDeleteController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).send({ message: 'Id is not mentioned' });
    }
    await Product.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: 'Product Deleted Succesfully' });
  } catch (error) {
    console.error('Error in Delete Controller: ', error);
  }
};

export const getCategoryProductController = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const products = await productModel.find({ category: categoryName });
    return res.status(200).json({
      success: true,
      message: `Products of ${categoryName} fetched successfully`,
      products,
    });
  } catch (error) {
    console.log('Error in Backend getCategoryProductController - ', error);
    res.status(500).json({
      success: false,
      message: 'Error in Backend getCategoryProductController - ',
      error,
    });
  }
};
