import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useLanguage } from '../context/languageContext';
import QRCode from 'react-native-qrcode-svg';

// Backend server URL for QR code - change this to your actual server IP/domain
const SERVER_URL = 'https://bill-h3p1.onrender.com/';

export default function BillDetail({ route, navigation }) {
  const { bill } = route.params;
  const { t } = useLanguage();

  if (!bill) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <Text style={styles.errorText}>Bill not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('receipt')}</Text>
            <View style={styles.headerLine} />
          </View>

          {/* Shop Info */}
          <View style={styles.shopCard}>
            <Text style={styles.shopName}>{bill.shopName || 'Shop'}</Text>
            <Text style={styles.shopAddress}>{bill.shopAddress || ''}</Text>
            <Text style={styles.shopPhone}>{bill.shopPhone || ''}</Text>
          </View>

          {/* Bill Info */}
          <View style={styles.billInfoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('billNumber')}:</Text>
              <Text style={styles.infoValue}>{bill.billNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('date')}:</Text>
              <Text style={styles.infoValue}>{bill.date}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('time')}:</Text>
              <Text style={styles.infoValue}>{bill.time}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('paymentMethod')}:</Text>
              <Text style={styles.infoValue}>
                {bill.paymentMethod || 'CASH'}
              </Text>
            </View>
          </View>

          {/* Items */}
          <View style={styles.itemsCard}>
            <Text style={styles.sectionTitle}>{t('items')}</Text>
            <View style={styles.separator} />

            {bill.items && bill.items.length > 0 ? (
              bill.items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQty}>× {item.quantity}</Text>
                  </View>
                  <Text style={styles.itemPrice}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noItems}>No items</Text>
            )}

            <View style={styles.separator} />
          </View>

          {/* Totals */}
          <View style={styles.totalsCard}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{t('subtotal')}:</Text>
              <Text style={styles.totalValue}>
                ₹{bill.subTotal?.toFixed(2) || '0.00'}
              </Text>
            </View>

            {bill.tax > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>{t('tax')}:</Text>
                <Text style={styles.totalValue}>
                  ₹{bill.tax?.toFixed(2) || '0.00'}
                </Text>
              </View>
            )}

            {bill.discount > 0 && (
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, styles.discountLabel]}>
                  {t('discount')}:
                </Text>
                <Text style={[styles.totalValue, styles.discountValue]}>
                  -₹{bill.discount?.toFixed(2) || '0.00'}
                </Text>
              </View>
            )}

            <View style={[styles.totalRow, styles.grandTotalRow]}>
              <Text style={styles.grandTotalLabel}>{t('grandTotal')}:</Text>
              <Text style={styles.grandTotalValue}>
                ₹{bill.grandTotal?.toFixed(2) || '0.00'}
              </Text>
            </View>
          </View>

          {/* QR Code Section */}
          <View style={styles.qrSection}>
            <Text style={styles.qrTitle}>📱 Scan to View Bill</Text>
            <Text style={styles.qrSubtitle}>
              Scan to view, print or share bill
            </Text>
            <View style={styles.qrContainer}>
              <QRCode
                value={`${SERVER_URL}/api/v1/bills/${bill.billNumber}/pdf`}
                size={120}
                color="#000"
                backgroundColor="#fff"
              />
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('thankYou')}</Text>
            <Text style={styles.footerText}>{t('pleaseVisitAgain')}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171717',
    padding: hp('4%'),
  },
  header: {
    marginBottom: 20,
  },
  backBtn: {
    marginBottom: 10,
  },
  backBtnText: {
    color: '#DA7320',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 45,
    color: 'white',
    fontWeight: '400',
  },
  headerLine: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    marginTop: 10,
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  backButton: {
    backgroundColor: '#DA7320',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  shopCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  shopName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  shopAddress: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  shopPhone: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  billInfoCard: {
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#888',
    fontSize: 14,
  },
  infoValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  itemsCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemName: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  itemQty: {
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  noItems: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 10,
  },
  totalsCard: {
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    color: '#888',
    fontSize: 16,
  },
  totalValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  discountLabel: {
    color: '#2ecc71',
  },
  discountValue: {
    color: '#2ecc71',
  },
  grandTotalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  grandTotalLabel: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  grandTotalValue: {
    color: '#DA7320',
    fontSize: 20,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 30,
  },
  footerText: {
    color: '#888',
    fontSize: 14,
    fontStyle: 'italic',
  },
  // QR Code Styles
  qrSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  qrSubtitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 15,
  },
  qrContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
});
