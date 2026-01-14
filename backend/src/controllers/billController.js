import billModel from '../models/billModel';
export const createBillController = async (req, res) => {
  try {
    const { items, subTotal, discount, tax, grandTotal, paymentMethod } =
      req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Bill must contain at least one items',
      });
    }
    const bill = await billModel.create({
      billNumber: `BILL-${Date.now()}`,
      items,
      subTotal,
      discount,
      tax,
      grandTotal,
      paymentMethod,
    });

    return res.status(201).json({
      success: true,
      message: 'Bill Created Succesfully',
      bill,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error in CreateBillController :',
      error,
    });
  }
};
export const getAllBillController = async (req, res) => {
  try {
    const allBills = await billModel.find();
    res.status(200).json({
      success: true,
      message: 'All Bills Fetched Succesfully',
      allBills,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error in getAllBillController :',
      error,
    });
  }
};
export const getSingleBillController = async (req, res) => {
  try {
    const { billNumber } = req.body;
    const singleBill = await billModel.findOne({ billNumber });
    if (!singleBill) {
      res.status(400).json({
        success: false,
        message: `${billNumber} - Bill Details not Found`,
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Bill DetailsFetched Succesfully',
      singleBill,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error in getSingleBillController :',
      error,
    });
  }
};
export const updateSingleBillController = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      billNumber,
      items,
      subTotal,
      discount,
      tax,
      grandTotal,
      paymentMethod,
    } = req.body;
    const singleBill = await billModel.findByIdAndUpdate(
      id,
      { items, subTotal, discount, tax, grandTotal, paymentMethod },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!singleBill) {
      res.status(400).json({
        success: false,
        message: `${billNumber} - Bill Details not Found`,
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Bill details updated Succesfully',
      singleBill,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error in updateSingleBillController :',
      error,
    });
  }
};
export const deleteSingleBillController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Bill Id is Invalid / Not Mentioned ',
      });
    }
    await billModel.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: 'Product Deleted Succesfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error in deleteSingleBillController :',
      error,
    });
  }
};
