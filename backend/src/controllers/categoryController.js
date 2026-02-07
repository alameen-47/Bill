import categoryModel from '../models/categoryModel.js';

export const createCategoryController = async (req, res) => {
  try {
    let { category } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category Name is Required',
      });
    }

    const existingCategory = await categoryModel.findOne({ category });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category Name Already Exists',
      });
    }

    const newCategory = await categoryModel.create({ category });

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
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Category Id is Required',
      });
    }
    const category = await categoryModel.findById(categoryId);
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

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Category Id is Required',
      });
    }
    await categoryModel.findByIdAndDelete(categoryId);
    return res.status(200).json({
      success: false,
      message: 'Category Deleted Succesfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error in DeleteCategoryController',
    });
  }
};
