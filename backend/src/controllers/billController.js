import billModel from '../models/billModel.js';
export const createBillController = async (req, res) => {
  try {
    const {
      items,
      subTotal,
      discount,
      tax,
      grandTotal,
      paymentMethod,
      shopName,
      shopAddress,
      shopPhone,
      gstNumber,
      date,
      time,
      billNumber,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Bill must contain at least one items',
      });
    }

    const bill = await billModel.create({
      billNumber: billNumber || `BILL-${Date.now()}`,
      items,
      subTotal,
      discount: discount || 0,
      tax: tax || 0,
      grandTotal,
      paymentMethod: paymentMethod || 'CASH',
      shopName: shopName || 'My Shop',
      shopAddress: shopAddress || '',
      shopPhone: shopPhone || '',
      gstNumber: gstNumber || '',
      date: date || new Date().toLocaleDateString(),
      time: time || new Date().toLocaleTimeString(),
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
export const getQrCodeDetailsController = async (req, res) => {
  try {
    const { billNumber } = req.params;
    const bill = await billModel.findOne({ billNumber });

    if (!bill) {
      return res.status(404).send(`
        <html>
          <head><title>Bill Not Found</title></head>
          <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
            <h1>Bill Not Found</h1>
            <p>The bill with number ${billNumber} was not found.</p>
            <a href="/" style="color: #DA7320;">Go Back</a>
          </body>
        </html>
      `);
    }

    const itemsHtml = bill.items
      .map(
        item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `,
      )
      .join('');

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bill - ${bill.billNumber}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; background: #f5f5f5; }
    .bill-container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #DA7320; padding-bottom: 20px; }
    .shop-name { font-size: 28px; font-weight: bold; color: #333; }
    .shop-info { color: #666; font-size: 14px; margin-top: 5px; }
    .bill-details { display: flex; justify-content: space-between; margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px; }
    .bill-info-item { display: flex; flex-direction: column; }
    .bill-label { color: #888; font-size: 12px; }
    .bill-value { color: #333; font-size: 16px; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #DA7320; color: white; padding: 12px; text-align: left; }
    th:nth-child(2), th:nth-child(3), th:nth-child(4) { text-align: right; }
    th:nth-child(2) { text-align: center; }
    .totals { margin-top: 20px; }
    .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    .total-label { color: #666; }
    .total-value { font-weight: 600; }
    .grand-total { font-size: 20px; font-weight: bold; color: #DA7320; border-top: 2px solid #333; padding-top: 10px; margin-top: 10px; }
    .payment-info { text-align: center; margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px; }
    .footer { text-align: center; margin-top: 30px; color: #888; font-style: italic; }
    .print-btn { position: fixed; bottom : 20px; left : 25%; background: #DA7320; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; font-size: 16px; }
    .print-btn:hover { background: #b85d1a; }
    .share-btn { position: fixed; top: 20px; right: 160px; background: #27ae60; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; font-size: 16px; }
    .share-btn:hover { background: #1e8449; }
    @media print {
      .print-btn, .share-btn { display: none; }
      body { background: white; padding: 0; }
      .bill-container { box-shadow: none; border-radius: 0; }
    }
  </style>
</head>
<body>
  <div class="bill-container">
    <div class="header">
      <div class="shop-name">${bill.shopName || 'My Shop'}</div>
      <div class="shop-info">${bill.shopAddress || ''}</div>
      <div class="shop-info">Phone: ${bill.shopPhone || ''}</div>
      ${bill.gstNumber ? `<div class="shop-info">GST: ${bill.gstNumber}</div>` : ''}
    </div>
    
    <div class="bill-details">
      <div class="bill-info-item">
        <span class="bill-label">Bill Number</span>
        <span class="bill-value">${bill.billNumber}</span>
      </div>
      <div class="bill-info-item">
        <span class="bill-label">Date</span>
        <span class="bill-value">${bill.date || new Date(bill.createdAt).toLocaleDateString()}</span>
      </div>
      <div class="bill-info-item">
        <span class="bill-label">Time</span>
        <span class="bill-value">${bill.time || new Date(bill.createdAt).toLocaleTimeString()}</span>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <div class="totals">
      <div class="total-row">
        <span class="total-label">Subtotal</span>
        <span class="total-value">₹${bill.subTotal?.toFixed(2) || '0.00'}</span>
      </div>
      ${
        bill.tax > 0
          ? `
      <div class="total-row">
        <span class="total-label">Tax</span>
        <span class="total-value">₹${bill.tax?.toFixed(2) || '0.00'}</span>
      </div>
      `
          : ''
      }
      ${
        bill.discount > 0
          ? `
      <div class="total-row">
        <span class="total-label" style="color: #27ae60;">Discount</span>
        <span class="total-value" style="color: #27ae60;">-₹${bill.discount?.toFixed(2) || '0.00'}</span>
      </div>
      `
          : ''
      }
      <div class="total-row grand-total">
        <span>Grand Total</span>
        <span>₹${bill.grandTotal?.toFixed(2) || '0.00'}</span>
      </div>
    </div>

    <div class="payment-info">
      <strong>Payment Method:</strong> ${bill.paymentMethod || 'CASH'}
    </div>

    <div class="footer">
      <p>Thank you for shopping!</p>
      <p>Please visit again!</p>
    </div>
  </div>
  <button class="print-btn" onclick="window.print()">🖨️ Print / Save PDF</button>

  <script>
    function shareBill() {
      const billInfo = \`
Bill: ${bill.billNumber}
Date: ${bill.date || new Date(bill.createdAt).toLocaleDateString()}
Items: ${bill.items.length}
Total: ₹${bill.grandTotal?.toFixed(2) || '0.00'}
Payment: ${bill.paymentMethod || 'CASH'}

${bill.items.map(item => '- ' + item.name + ' x' + item.quantity + ' = ₹' + (item.price * item.quantity).toFixed(2)).join('\\n')}

---
View full bill: \${window.location.href}
\`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Bill ${bill.billNumber}',
          text: billInfo,
          url: window.location.href
        }).catch(err => console.log('Share failed:', err));
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(billInfo).then(() => {
          alert('Bill info copied to clipboard!');
        }).catch(err => {
          alert('Could not copy. Please take a screenshot or print to PDF.');
        });
      }
    }
  </script>
</body>
</html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('PDF View Error:', error);
    res.status(500).send(`
      <html>
        <head><title>Error</title></head>
        <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
          <h1>Error Loading Bill</h1>
          <p>Something went wrong. Please try again.</p>
        </body>
      </html>
    `);
  }
};
