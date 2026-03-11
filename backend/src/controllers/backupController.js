import billModel from '../models/billModel.js';
import productModel from '../models/productModel.js';
import productCategoryModel from '../models/categoryModel.js';
import categoryModel from '../models/categoryModel.js';
import userModel from '../models/userModel.js';
import nodemailer from 'nodemailer';

// Configure email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password',
    },
  });
};

// Generate backup data
const generateBackupData = async (userId) => {
  try {
    // Get all bills for the user
    const bills = await billModel.find({ createdBy: userId });
    
    // Get all products for the user
    const products = await productModel.find({ createdBy: userId });
    
    // Get all categories for the user
    const categories = await categoryModel.find({ createdBy: userId });

    return {
      backupDate: new Date().toISOString(),
      version: '1.0',
      data: {
        bills: bills.map(bill => ({
          billNumber: bill.billNumber,
          items: bill.items,
          subTotal: bill.subTotal,
          discount: bill.discount,
          tax: bill.tax,
          grandTotal: bill.grandTotal,
          paymentMethod: bill.paymentMethod,
          shopName: bill.shopName,
          shopAddress: bill.shopAddress,
          shopPhone: bill.shopPhone,
          gstNumber: bill.gstNumber,
          date: bill.date,
          time: bill.time,
          createdAt: bill.createdAt,
        })),
        products: products.map(product => ({
          name: product.name,
          price: product.price,
          category: product.category,
          unit: product.unit,
          stock: product.stock,
          barcode: product.barcode,
          hsnCode: product.hsnCode,
          taxRate: product.taxRate,
        })),
        categories: categories.map(category => ({
          name: category.name,
          description: category.description,
        })),
      },
      stats: {
        totalBills: bills.length,
        totalProducts: products.length,
        totalCategories: categories.length,
      },
    };
  } catch (error) {
    console.log('Error generating backup data:', error);
    throw error;
  }
};

// Save backup to cloud and send email
export const saveBackupController = async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;
    
    // Generate backup data
    const backupData = await generateBackupData(userId);
    
    // Save backup to user's document in database (cloud storage)
    await userModel.findByIdAndUpdate(userId, {
      lastBackupDate: new Date(),
      backupData: backupData,
    });

    // Send email notification with backup attached
    const transporter = createTransporter();
    const backupJson = JSON.stringify(backupData, null, 2);

    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: userEmail,
      subject: `📦 Bill App Backup - ${new Date().toLocaleDateString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <div style="background: #DA7320; padding: 20px; border-radius: 10px;">
            <h1 style="color: white; margin: 0;">📦 Bill App Backup</h1>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9; border-radius: 10px; margin-top: 20px;">
            <p>Your backup is ready! Here are the details:</p>
            
            <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Backup Date:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${new Date(backupData.backupDate).toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Total Bills:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${backupData.stats.totalBills}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Total Products:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${backupData.stats.totalProducts}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Total Categories:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${backupData.stats.totalCategories}</td>
              </tr>
            </table>
            
            <p style="margin-top: 20px; color: #666; font-size: 12px;">
              This backup is also stored in the cloud. To restore, simply open the Bill App and tap "Restore" in Settings → Email Backup.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
            <p>Thank you for using Bill App! 🧾</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `bill-app-backup-${new Date().toISOString().split('T')[0]}.json`,
          content: backupJson,
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'Backup saved to cloud and email sent!',
      lastBackupDate: new Date(),
      stats: backupData.stats,
    });
  } catch (error) {
    console.log('Error in saveBackupController:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create backup. Please try again.',
      error: error.message,
    });
  }
};

// Auto-restore from cloud backup
export const autoRestoreController = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user with backup data
    const user = await userModel.findById(userId);
    
    if (!user || !user.backupData) {
      return res.status(404).json({
        success: false,
        message: 'No backup found. Please create a backup first.',
      });
    }

    const backupData = user.backupData;
    const results = {
      billsRestored: 0,
      productsRestored: 0,
      categoriesRestored: 0,
      errors: [],
    };

    // Restore categories
    if (backupData.data.categories && backupData.data.categories.length > 0) {
      for (const category of backupData.data.categories) {
        try {
          const existingCategory = await categoryModel.findOne({
            name: category.name,
            createdBy: userId,
          });

          if (!existingCategory) {
            await categoryModel.create({
              ...category,
              createdBy: userId,
            });
            results.categoriesRestored++;
          }
        } catch (error) {
          results.errors.push(`Category ${category.name}: ${error.message}`);
        }
      }
    }

    // Restore products
    if (backupData.data.products && backupData.data.products.length > 0) {
      for (const product of backupData.data.products) {
        try {
          const existingProduct = await productModel.findOne({
            name: product.name,
            createdBy: userId,
          });

          if (!existingProduct) {
            await productModel.create({
              ...product,
              createdBy: userId,
            });
            results.productsRestored++;
          }
        } catch (error) {
          results.errors.push(`Product ${product.name}: ${error.message}`);
        }
      }
    }

    // Restore bills
    if (backupData.data.bills && backupData.data.bills.length > 0) {
      for (const bill of backupData.data.bills) {
        try {
          const existingBill = await billModel.findOne({
            billNumber: bill.billNumber,
            createdBy: userId,
          });

          if (!existingBill) {
            await billModel.create({
              ...bill,
              createdBy: userId,
              userId: userId,
            });
            results.billsRestored++;
          }
        } catch (error) {
          results.errors.push(`Bill ${bill.billNumber}: ${error.message}`);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Data restored successfully from cloud backup!',
      lastBackupDate: user.lastBackupDate,
      results,
    });
  } catch (error) {
    console.log('Error in autoRestoreController:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to restore backup. Please try again.',
      error: error.message,
    });
  }
};

// Get backup status (last backup date)
export const getBackupStatusController = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await userModel.findById(userId).select('lastBackupDate backupData');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      hasBackup: !!user.backupData,
      lastBackupDate: user.lastBackupDate,
      stats: user.backupData?.stats || null,
    });
  } catch (error) {
    console.log('Error in getBackupStatusController:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get backup status.',
      error: error.message,
    });
  }
};

// Legacy controller - Send backup email (kept for compatibility)
export const sendBackupEmailController = async (req, res) => {
  // Redirect to saveBackup which does both cloud storage and email
  return saveBackupController(req, res);
};

// Legacy controller - Restore from backup code (kept for compatibility)
export const restoreFromBackupController = async (req, res) => {
  // Redirect to autoRestore which uses cloud backup
  return autoRestoreController(req, res);
};

// Get backup preview (without sending)
export const getBackupPreviewController = async (req, res) => {
  try {
    const userId = req.user.id;
    const backupData = await generateBackupData(userId);

    return res.status(200).json({
      success: true,
      preview: {
        backupDate: backupData.backupDate,
        stats: backupData.stats,
      },
    });
  } catch (error) {
    console.log('Error in getBackupPreviewController:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate backup preview.',
      error: error.message,
    });
  }
};

