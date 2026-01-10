import Product from '../models/productModel.js';

export const createProductController = async (req, res) => {
  try {
    const { name, quantity, price } = req.body;
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      res
        .status(400)
        .json({ message: 'Product with same name is Already Present' });
    }
    const product = await Product.create({ name, quantity, price });
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error on CreateProductController' });
  }
};

export const getAllProductController = async (req, res) => {
  try {
    const allProducts = await Product.find();
    res.status(200).json({
      success: true,
      message: 'All Products Fetched Succesfully',
      data: allProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error in GetAllProductController' });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const { name } = req.params;
    const singleProduct = await Product.findOne({ name });
    if (!singleProduct) {
      res.status(400).json({
        succes: false,
        message: 'Product not Found',
      });
    }
    return res.status(200).json({
      succes: false,
      message: 'Product fetched succesfully',
      data: singleProduct,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ succes: false, message: 'Error in GetSingleProductController' });
  }
};
