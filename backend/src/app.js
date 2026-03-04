import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import billRoutes from './routes/billRoutes.js';
import billModel from './models/billModel.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/bills', billRoutes);

// // PDF View Route - Generate printable HTML page for bill
// app.get('/api/v1/bills/:billNumber/pdf', async (req, res) => {
//   try {
//     const { billNumber } = req.params;
//     const bill = await billModel.findOne({ billNumber });

//     if (!bill) {
//       return res.status(404).send(`
//         <html>
//           <head><title>Bill Not Found</title></head>
//           <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
//             <h1>Bill Not Found</h1>
//             <p>The bill with number ${billNumber} was not found.</p>
//             <a href="/" style="color: #DA7320;">Go Back</a>
//           </body>
//         </html>
//       `);
//     }

//     const itemsHtml = bill.items
//       .map(
//         item => `
//       <tr>
//         <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
//         <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
//         <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price.toFixed(2)}</td>
//         <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
//       </tr>
//     `,
//       )
//       .join('');

//     const html = `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Bill - ${bill.billNumber}</title>
//   <style>
//     * { box-sizing: border-box; margin: 0; padding: 0; }
//     body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; background: #f5f5f5; }
//     .bill-container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
//     .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #DA7320; padding-bottom: 20px; }
//     .shop-name { font-size: 28px; font-weight: bold; color: #333; }
//     .shop-info { color: #666; font-size: 14px; margin-top: 5px; }
//     .bill-details { display: flex; justify-content: space-between; margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px; }
//     .bill-info-item { display: flex; flex-direction: column; }
//     .bill-label { color: #888; font-size: 12px; }
//     .bill-value { color: #333; font-size: 16px; font-weight: 600; }
//     table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//     th { background: #DA7320; color: white; padding: 12px; text-align: left; }
//     th:nth-child(2), th:nth-child(3), th:nth-child(4) { text-align: right; }
//     th:nth-child(2) { text-align: center; }
//     .totals { margin-top: 20px; }
//     .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
//     .total-label { color: #666; }
//     .total-value { font-weight: 600; }
//     .grand-total { font-size: 20px; font-weight: bold; color: #DA7320; border-top: 2px solid #333; padding-top: 10px; margin-top: 10px; }
//     .payment-info { text-align: center; margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px; }
//     .footer { text-align: center; margin-top: 30px; color: #888; font-style: italic; }
//     .print-btn { position: fixed; top: 20px; right: 20px; background: #DA7320; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; font-size: 16px; }
//     .print-btn:hover { background: #b85d1a; }
//     .share-btn { position: fixed; top: 20px; right: 160px; background: #27ae60; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; font-size: 16px; }
//     .share-btn:hover { background: #1e8449; }
//     @media print {
//       .print-btn, .share-btn { display: none; }
//       body { background: white; padding: 0; }
//       .bill-container { box-shadow: none; border-radius: 0; }
//     }
//   </style>
// </head>
// <body>
//   <button class="print-btn" onclick="window.print()">🖨️ Print / Save PDF</button>
//   <button class="share-btn" onclick="shareBill()">📤 Share</button>
//   <div class="bill-container">
//     <div class="header">
//       <div class="shop-name">${bill.shopName || 'My Shop'}</div>
//       <div class="shop-info">${bill.shopAddress || ''}</div>
//       <div class="shop-info">Phone: ${bill.shopPhone || ''}</div>
//       ${bill.gstNumber ? `<div class="shop-info">GST: ${bill.gstNumber}</div>` : ''}
//     </div>

//     <div class="bill-details">
//       <div class="bill-info-item">
//         <span class="bill-label">Bill Number</span>
//         <span class="bill-value">${bill.billNumber}</span>
//       </div>
//       <div class="bill-info-item">
//         <span class="bill-label">Date</span>
//         <span class="bill-value">${bill.date || new Date(bill.createdAt).toLocaleDateString()}</span>
//       </div>
//       <div class="bill-info-item">
//         <span class="bill-label">Time</span>
//         <span class="bill-value">${bill.time || new Date(bill.createdAt).toLocaleTimeString()}</span>
//       </div>
//     </div>

//     <table>
//       <thead>
//         <tr>
//           <th>Item</th>
//           <th>Qty</th>
//           <th>Rate</th>
//           <th>Amount</th>
//         </tr>
//       </thead>
//       <tbody>
//         ${itemsHtml}
//       </tbody>
//     </table>

//     <div class="totals">
//       <div class="total-row">
//         <span class="total-label">Subtotal</span>
//         <span class="total-value">₹${bill.subTotal?.toFixed(2) || '0.00'}</span>
//       </div>
//       ${
//         bill.tax > 0
//           ? `
//       <div class="total-row">
//         <span class="total-label">Tax</span>
//         <span class="total-value">₹${bill.tax?.toFixed(2) || '0.00'}</span>
//       </div>
//       `
//           : ''
//       }
//       ${
//         bill.discount > 0
//           ? `
//       <div class="total-row">
//         <span class="total-label" style="color: #27ae60;">Discount</span>
//         <span class="total-value" style="color: #27ae60;">-₹${bill.discount?.toFixed(2) || '0.00'}</span>
//       </div>
//       `
//           : ''
//       }
//       <div class="total-row grand-total">
//         <span>Grand Total</span>
//         <span>₹${bill.grandTotal?.toFixed(2) || '0.00'}</span>
//       </div>
//     </div>

//     <div class="payment-info">
//       <strong>Payment Method:</strong> ${bill.paymentMethod || 'CASH'}
//     </div>

//     <div class="footer">
//       <p>Thank you for shopping!</p>
//       <p>Please visit again!</p>
//     </div>
//   </div>

//   <script>
//     function shareBill() {
//       const billInfo = \`
// Bill: ${bill.billNumber}
// Date: ${bill.date || new Date(bill.createdAt).toLocaleDateString()}
// Items: ${bill.items.length}
// Total: ₹${bill.grandTotal?.toFixed(2) || '0.00'}
// Payment: ${bill.paymentMethod || 'CASH'}

// ${bill.items.map(item => '- ' + item.name + ' x' + item.quantity + ' = ₹' + (item.price * item.quantity).toFixed(2)).join('\\n')}

// ---
// View full bill: \${window.location.href}
// \`;

//       if (navigator.share) {
//         navigator.share({
//           title: 'Bill ${bill.billNumber}',
//           text: billInfo,
//           url: window.location.href
//         }).catch(err => console.log('Share failed:', err));
//       } else {
//         // Fallback: copy to clipboard
//         navigator.clipboard.writeText(billInfo).then(() => {
//           alert('Bill info copied to clipboard!');
//         }).catch(err => {
//           alert('Could not copy. Please take a screenshot or print to PDF.');
//         });
//       }
//     }
//   </script>
// </body>
// </html>
//     `;

//     res.setHeader('Content-Type', 'text/html');
//     res.send(html);
//   } catch (error) {
//     console.error('PDF View Error:', error);
//     res.status(500).send(`
//       <html>
//         <head><title>Error</title></head>
//         <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
//           <h1>Error Loading Bill</h1>
//           <p>Something went wrong. Please try again.</p>
//         </body>
//       </html>
//     `);
//   }
// });

export default app;
