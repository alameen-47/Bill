export const createBillController = async (req, res) => {
  try {
    // const { items, subTotal, discount, tax, grandTotal, paymentMethod } =
    //   req.body;
    // const bill = await billModel.create({ billDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      succes: false,
      message: 'Error in CreateBillController :',
      error,
    });
  }
};
export const getAllBillController = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      succes: false,
      message: 'Error in CreateBillController :',
      error,
    });
  }
};
export const getSingleBillController = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      succes: false,
      message: 'Error in CreateBillController :',
      error,
    });
  }
};
export const updateSingleBillController = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      succes: false,
      message: 'Error in CreateBillController :',
      error,
    });
  }
};
export const deleteSingleBillController = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      succes: false,
      message: 'Error in CreateBillController :',
      error,
    });
  }
};
