import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { BillContext } from '../context/billContext';
import { PrinterContext } from '../context/printerContext';
import logo from '../assets/images/logo.png';

const PROFILE_STORAGE_KEY = '@user_profile';

export default function Reciept() {
  const { billItems, total } = useContext(BillContext);
  const { connectedPrinter } = useContext(PrinterContext);

  // Profile data state
  const [shopName, setShopName] = useState('My Shop');
  const [shopAddress, setShopAddress] = useState('123 Main Street, City');
  const [shopPhone, setShopPhone] = useState('+91 9876543210');
  const [gstNumber, setGstNumber] = useState('');
  const [taxRate, setTaxRate] = useState('0');
  const [shopLogo, setShopLogo] = useState(null);

  // Discount state
  const [discountPercent, setDiscountPercent] = useState('0');
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [tempDiscount, setTempDiscount] = useState('0');

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Payment methods
  const paymentMethods = ['CASH', 'CARD', 'UPI', 'OTHER'];

  // Load profile data on mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const profileData = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (profileData) {
        const parsed = JSON.parse(profileData);
        setShopName(parsed.shopName || 'My Shop');
        setShopAddress(parsed.address || '123 Main Street, City');
        setShopPhone(parsed.phone || '+91 9876543210');
        setGstNumber(parsed.gstNumber || '');
        setTaxRate(parsed.taxRate || '0');
        setShopLogo(parsed.shopLogo || null);
      }
    } catch (error) {
      console.log('Error loading profile:', error);
    }
  };

  // Calculate tax and totals
  const taxAmount = (total * (parseFloat(taxRate) || 0)) / 100;
  const discountAmount = (total * (parseFloat(discountPercent) || 0)) / 100;
  const grandTotal = total + taxAmount - discountAmount;

  const billNumber = 'BILL-' + Math.floor(100000 + Math.random() * 900000);
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  // Handle discount application
  const handleApplyDiscount = () => {
    const percent = parseFloat(tempDiscount);
    if (isNaN(percent) || percent < 0 || percent > 100) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Discount',
        text2: 'Please enter a value between 0 and 100',
      });
      return;
    }
    setDiscountPercent(tempDiscount);
    setShowDiscountModal(false);
    Toast.show({
      type: 'success',
      text1: 'Discount Applied',
      text2: `${tempDiscount}% discount added`,
    });
  };

  const handleClearDiscount = () => {
    setDiscountPercent('0');
    setTempDiscount('0');
    setShowDiscountModal(false);
  };

  // ESC/POS commands for thermal printer
  const ESC = '\x1B';
  const GS = '\x1D';
  const LF = '\x0A';

  // Print logo using the thermal printer's image printing capability
  const printLogo = async logoBase64 => {
    if (!logoBase64 || !connectedPrinter) return;

    try {
      // Initialize printer
      await connectedPrinter.printImage(logoBase64);
    } catch (error) {
      console.log('Logo print error:', error);
      // Fallback: print shop name
      try {
        await connectedPrinter.write(ESC + '@');
        await connectedPrinter.write(ESC + 'a' + '\x01');
        await connectedPrinter.write(ESC + '!' + '\x30');
        await connectedPrinter.write(shopName.toUpperCase() + LF);
        await connectedPrinter.write(ESC + '!' + '\x00');
      } catch (fallbackError) {
        console.log('Fallback logo print error:', fallbackError);
      }
    }
  };

  const generateReceiptText = () => {
    let receipt = '';
    receipt += `  ${shopAddress}\n`;
    receipt += `  Phone: ${shopPhone}\n`;
    if (gstNumber) {
      receipt += `  GST: ${gstNumber}\n`;
    }
    receipt += '========================\n';
    receipt += `Bill No: ${billNumber}\n`;
    receipt += `Date: ${currentDate}\n`;
    receipt += `Time: ${currentTime}\n`;
    receipt += '------------------------\n';
    receipt += 'Item          Qty  Rate  Amt\n';
    receipt += '------------------------\n';

    billItems.forEach(item => {
      const name = item.name.substring(0, 10).padEnd(10);
      const qty = item.quantity.toString().padEnd(3);
      const rate = item.price.toFixed(2).padStart(6);
      const amt = (item.price * item.quantity).toFixed(2).padStart(7);
      receipt += `${name} ${qty} ${rate} ${amt}\n`;
    });

    receipt += '------------------------\n';
    receipt += `SubTotal:- ${total.toFixed(2)}\n`;
    if (parseFloat(taxRate) > 0) {
      receipt += `Tax (${taxRate}%):-  ${taxAmount.toFixed(2)}\n`;
    }
    if (parseFloat(discountPercent) > 0) {
      receipt += `Discount (${discountPercent}%):- ${discountAmount.toFixed(2)}\n`;
    }
    receipt += '------------------------\n';
    receipt += `GRAND TOTAL: ${grandTotal.toFixed(2)}\n`;
    receipt += '========================\n';
    receipt += `Payment: ${paymentMethod}\n`;
    receipt += '\n';
    receipt += '   Thank you for shopping!\n';
    receipt += '   Please visit again!\n';
    receipt += '  \n\n\n';

    return receipt;
  };

  const handlePrint = async () => {
    if (!connectedPrinter) {
      Toast.show({
        type: 'error',
        text1: 'No Printer Connected',
        text2: 'Please connect a printer in Settings first',
      });
      return;
    }

    try {
      Toast.show({ type: 'info', text1: 'Printing...' });

      const isConnected = await connectedPrinter.isConnected();
      if (!isConnected) {
        await connectedPrinter.connect();
      }

      // Print logo first if available
      if (shopLogo) {
        await printLogo(shopLogo);
      }

      // Print receipt
      const receiptText = generateReceiptText();
      await connectedPrinter.write(receiptText);

      Toast.show({ type: 'success', text1: 'Print Successful ✅' });
    } catch (error) {
      console.log('Print Error:', error);
      Toast.show({ type: 'error', text1: 'Print Failed ❌' });
    }
  };

  return (
    <SafeAreaProvider>
      <ScrollView>
        <SafeAreaView
          style={{ padding: hp('4%') }}
          className="bg-Cdarkgray h-screen w-screen flex-1 flex justify-start items-start"
        >
          <View
            style={{ alignItems: 'flex-start', width: '100%', top: hp('-5%') }}
          >
            <Text style={{ fontSize: 55, color: 'white', fontWeight: 400 }}>
              Receipt
            </Text>
            <View className="w-[100%] border-b border-white " />

            {!connectedPrinter && (
              <View style={styles.noPrinterBox}>
                <Text style={styles.noPrinterText}>
                  ⚠️ No printer connected
                </Text>
                <Text style={styles.noPrinterSubtext}>
                  Go to Settings to connect a printer
                </Text>
              </View>
            )}
            {connectedPrinter && (
              <View style={styles.printerStatusBox}>
                <Text style={styles.printerStatusText}>
                  🖨️ {connectedPrinter.name}
                </Text>
              </View>
            )}

            {/* Options Row */}
            <View style={styles.optionsRow}>
              {/* Discount Button */}
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  setTempDiscount(discountPercent);
                  setShowDiscountModal(true);
                }}
              >
                <Text style={styles.optionButtonText}>
                  🏷️ Discount: {discountPercent}%
                </Text>
              </TouchableOpacity>

              {/* Payment Method Button */}
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => setShowPaymentModal(true)}
              >
                <Text style={styles.optionButtonText}>
                  {paymentMethod === 'CASH' && '💵 '}
                  {paymentMethod === 'CARD' && '💳 '}
                  {paymentMethod === 'UPI' && '📱 '}
                  {paymentMethod === 'OTHER' && '•••• '}
                  {paymentMethod}
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={{ width: '100%', marginTop: 10 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.receiptContainer}>
                {/* Shop Logo */}
                {shopLogo ? (
                  <Image style={styles.logoImage} source={{ uri: shopLogo }} />
                ) : (
                  <View style={styles.logoPlaceholder}>
                    <Text style={styles.logoPlaceholderText}>
                      {shopName.charAt(0)}
                    </Text>
                  </View>
                )}

                {/* Shop Header */}
                <Text style={styles.shopName}>{shopName}</Text>
                <Text style={styles.shopAddress}>{shopAddress}</Text>
                <Text style={styles.shopPhone}>Phone: {shopPhone}</Text>

                {/* GST Number */}
                {gstNumber ? (
                  <Text style={styles.gstNumber}>GST: {gstNumber}</Text>
                ) : null}

                {/* Bill Details */}
                <View style={styles.billInfo}>
                  <Text style={styles.billInfoText}>Bill No: {billNumber}</Text>
                  <Text style={styles.billInfoText}>Date: {currentDate}</Text>
                  <Text style={styles.billInfoText}>Time: {currentTime}</Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.itemsHeader}>
                  <Text style={styles.itemHeaderText}>Item</Text>
                  <Text style={styles.itemHeaderText}>Qty</Text>
                  <Text style={styles.itemHeaderText}>Rate</Text>
                  <Text style={styles.itemHeaderText}>Amt</Text>
                </View>

                <View style={styles.separator} />

                {billItems.length > 0 ? (
                  billItems.map((item, index) => (
                    <View key={item._id || index} style={styles.itemRow}>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.itemQty}>{item.quantity}</Text>
                      <Text style={styles.itemPrice}>
                        ₹{item.price.toFixed(2)}
                      </Text>
                      <Text style={styles.itemTotal}>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noItems}>No items in bill</Text>
                )}

                <View style={styles.separator} />

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>SubTotal:</Text>
                  <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
                </View>

                {parseFloat(taxRate) > 0 && (
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Tax ({taxRate}%):</Text>
                    <Text style={styles.totalValue}>
                      ₹{taxAmount.toFixed(2)}
                    </Text>
                  </View>
                )}

                {parseFloat(discountPercent) > 0 && (
                  <View style={styles.discountRow}>
                    <Text style={styles.discountLabel}>
                      Discount ({discountPercent}%):
                    </Text>
                    <Text style={styles.discountValue}>
                      -₹{discountAmount.toFixed(2)}
                    </Text>
                  </View>
                )}

                <View style={styles.grandTotalRow}>
                  <Text style={styles.grandTotalLabel}>GRAND TOTAL:</Text>
                  <Text style={styles.grandTotalValue}>
                    ₹{grandTotal.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.paymentSection}>
                  <Text style={styles.paymentText}>
                    Payment: {paymentMethod}
                  </Text>
                </View>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Thank you for shopping!</Text>
                  <Text style={styles.footerText}>Please visit again!</Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              className={`p-3 rounded-lg w-full mt-4 ${
                connectedPrinter ? 'bg-[#DA7320]' : 'bg-gray-500'
              }`}
              onPress={handlePrint}
              disabled={!connectedPrinter}
            >
              <Text style={styles.printButtonText}>
                🖨️{' '}
                {connectedPrinter ? 'PRINT RECEIPT' : 'PRINTER NOT CONNECTED'}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>

      {/* Discount Modal */}
      <Modal
        visible={showDiscountModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDiscountModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🏷️ Apply Discount</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Discount Percentage:</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.discountInput}
                  value={tempDiscount}
                  onChangeText={setTempDiscount}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="gray"
                />
                <Text style={styles.percentSymbol}>%</Text>
              </View>
            </View>

            {parseFloat(tempDiscount) > 0 && (
              <View style={styles.discountPreview}>
                <Text style={styles.discountPreviewText}>
                  Discount Amount: ₹
                  {((total * parseFloat(tempDiscount)) / 100).toFixed(2)}
                </Text>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.clearButton]}
                onPress={handleClearDiscount}
              >
                <Text style={styles.modalButtonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDiscountModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.applyButton]}
                onPress={handleApplyDiscount}
              >
                <Text style={styles.modalButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Payment Method Modal */}
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>💳 Select Payment Method</Text>

            <View style={styles.paymentOptions}>
              {paymentMethods.map(method => (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.paymentOption,
                    paymentMethod === method && styles.paymentOptionSelected,
                  ]}
                  onPress={() => {
                    setPaymentMethod(method);
                    setShowPaymentModal(false);
                    Toast.show({
                      type: 'success',
                      text1: 'Payment Method Selected',
                      text2: method,
                    });
                  }}
                >
                  <Text
                    style={[
                      styles.paymentOptionText,
                      paymentMethod === method &&
                        styles.paymentOptionTextSelected,
                    ]}
                  >
                    {method === 'CASH' && '💵 '}
                    {method === 'CARD' && '💳 '}
                    {method === 'UPI' && '📱 '}
                    {method === 'OTHER' && '•••• '}
                    {method}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowPaymentModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaProvider>
  );
}

const styles = {
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    gap: 10,
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#2C2C2C',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DA7320',
  },
  optionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  noPrinterBox: {
    backgroundColor: '#5a3030',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  noPrinterText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noPrinterSubtext: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  printerStatusBox: {
    backgroundColor: '#1a5a1a',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#2ecc71',
  },
  printerStatusText: {
    color: '#2ecc71',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  receiptContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 10,
    alignItems: 'center',
  },
  logoImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DA7320',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoPlaceholderText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  shopName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  shopAddress: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
    marginTop: 2,
  },
  shopPhone: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
    marginTop: 2,
  },
  gstNumber: {
    fontSize: 11,
    textAlign: 'center',
    color: '#3498db',
    marginTop: 2,
    fontWeight: '600',
  },
  billInfo: {
    marginBottom: 10,
    width: '100%',
  },
  billInfoText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    marginVertical: 8,
    width: '100%',
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    width: '100%',
  },
  itemHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    width: '100%',
  },
  itemName: {
    fontSize: 12,
    color: '#333',
    flex: 1.5,
  },
  itemQty: {
    fontSize: 12,
    color: '#333',
    flex: 0.5,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 12,
    color: '#333',
    flex: 0.75,
    textAlign: 'right',
  },
  itemTotal: {
    fontSize: 12,
    color: '#333',
    flex: 0.75,
    textAlign: 'right',
  },
  noItems: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    paddingVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    width: '100%',
  },
  totalLabel: {
    fontSize: 14,
    color: '#333',
  },
  totalValue: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
  },
  discountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    width: '100%',
  },
  discountLabel: {
    fontSize: 14,
    color: '#e74c3c',
  },
  discountValue: {
    fontSize: 14,
    color: '#e74c3c',
    fontFamily: 'monospace',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#999',
    marginTop: 5,
    width: '100%',
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'monospace',
  },
  paymentSection: {
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  paymentText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  printButtonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2C2C2C',
    borderRadius: 15,
    padding: 20,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountInput: {
    flex: 1,
    backgroundColor: '#1C1C1D',
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  percentSymbol: {
    fontSize: 20,
    color: 'white',
    marginLeft: 10,
  },
  discountPreview: {
    backgroundColor: '#1a3a1a',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2ecc71',
  },
  discountPreviewText: {
    color: '#2ecc71',
    fontSize: 14,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#7f8c8d',
  },
  cancelButton: {
    backgroundColor: '#c0392b',
  },
  applyButton: {
    backgroundColor: '#27ae60',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  paymentOptions: {
    gap: 10,
    marginBottom: 20,
  },
  paymentOption: {
    backgroundColor: '#1C1C1D',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3a3a3a',
  },
  paymentOptionSelected: {
    borderColor: '#DA7320',
    backgroundColor: '#3a2a1a',
  },
  paymentOptionText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  paymentOptionTextSelected: {
    color: '#DA7320',
  },
};
