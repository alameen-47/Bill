import categoryModel from '../models/categoryModel.js';

export const createCategoryController = async (req, res) => {
  try {
    let { category } = req.body;
    const userId = req.user.id; // Get user ID from auth middleware

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category Name is Required',
      });
    }

    // Check if category exists for THIS USER only
    const existingCategory = await categoryModel.findOne({ category, createdBy: userId });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category Name Already Exists',
      });
    }

    // Create category linked to user
    const newCategory = await categoryModel.create({ category, createdBy: userId });

    return res.status(201).json({
      success: true,
      message: 'New Category Created Successfully',
      newCategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error on CategoryController',
      error,
    });
  }
};

export const getSingleCategoryController = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const userId = req.user.id;
    
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Category Id is Required',
      });
    }
    // Find category belonging to this user
    const category = await categoryModel.findOne({ _id: categoryId, createdBy: userId });
    if (category) {
      return res.status(200).json({
        success: true,
        message: 'Single Category Details Fetched Successfully',
        category,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in GetSingleCategoryController',
      error,
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const userId = req.user.id;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Category Id is Required',
      });
    }
    // Delete only if category belongs to this user
    const deletedCategory = await categoryModel.findOneAndDelete({ _id: categoryId, createdBy: userId });
    
    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found or unauthorized',
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Category Deleted Succesfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error in DeleteCategoryController',
    });
  }
};

export const getAllCategoryController = async (req, res) => {
  try {
    const userId = req.user.id;
    // Get only categories created by this user
    const allCategory = await categoryModel.find({ createdBy: userId });
    return res
      .status(200)
      .json({ success: true, message: 'Fetched All Category', allCategory });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error in GetAllCategoryContoller',
      error,
    });
  }
};

