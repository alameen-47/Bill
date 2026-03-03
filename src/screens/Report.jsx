import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  FlatList,
} from 'react-native';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native';
import { BillContext } from '../context/billContext';
import { useLanguage } from '../context/languageContext';

const { width } = Dimensions.get('window');

export default function Report({ navigation }) {
  const { getDailySales, getMonthlySales, getYearlySales, getReportSummary, savedBills, getLast5Bills } = useContext(BillContext);
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('daily');
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [summary, setSummary] = useState({});
  const [last5Bills, setLast5Bills] = useState([]);

  // Load data when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadReportData();
    }, [])
  );

  const loadReportData = () => {
    const daily = getDailySales(7);
    const monthly = getMonthlySales(6);
    const yearly = getYearlySales();
    const reportSummary = getReportSummary();
    const recent = getLast5Bills();

    setDailyData(daily);
    setMonthlyData(monthly);
    setYearlyData(yearly);
    setSummary(reportSummary);
    setLast5Bills(recent);
  };

  // Find max value for chart scaling
  const getMaxValue = (data) => {
    const max = Math.max(...data.map(d => d.total));
    return max > 0 ? max : 100;
  };

  // Render bar chart for daily/monthly data
  const renderBarChart = (data, dataKey = 'total') => {
    const maxValue = getMaxValue(data);
    
    return (
      <View style={styles.chartContainer}>
        <View style={styles.barsContainer}>
          {data.map((item, index) => {
            const height = (item[dataKey] / maxValue) * 150;
            return (
              <View key={index} style={styles.barWrapper}>
                <Text style={styles.barValue}>₹{item[dataKey]?.toFixed(0) || 0}</Text>
                <View style={[styles.bar, { height: Math.max(height, 5) }]}>
                  <View style={[styles.barFill, { height: '100%' }]} />
                </View>
                <Text style={styles.barLabel}>
                  {item.date?.substring(0, 3) || item.month?.substring(0, 3) || item.year}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  // Render yearly chart
  const renderYearlyChart = (data) => {
    const maxValue = getMaxValue(data);
    
    return (
      <View style={styles.chartContainer}>
        <View style={styles.yearBarsContainer}>
          {data.map((item, index) => {
            const height = (item.total / maxValue) * 150;
            return (
              <View key={index} style={styles.yearBarWrapper}>
                <Text style={styles.barValue}>₹{item.total?.toFixed(0) || 0}</Text>
                <View style={[styles.bar, { height: Math.max(height, 5) }]}>
                  <View style={[styles.yearBarFill, { height: '100%' }]} />
                </View>
                <Text style={styles.yearBarLabel}>{item.year}</Text>
                <Text style={styles.yearBarCount}>{item.count} bills</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  // Tab button component
  const TabButton = ({ tab, label }) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabButtonText, activeTab === tab && styles.activeTabText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('salesReport')}</Text>
            <View style={styles.headerLine} />
          </View>

          {/* Summary Cards */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{t('totalSales')}</Text>
              <Text style={styles.summaryValue}>₹{summary.totalSales?.toFixed(2) || '0.00'}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{t('totalBills')}</Text>
              <Text style={styles.summaryValue}>{summary.totalBills || 0}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{t('averageBill')}</Text>
              <Text style={styles.summaryValue}>₹{summary.averageBill?.toFixed(2) || '0.00'}</Text>
            </View>
            <View style={[styles.summaryCard, styles.todayCard]}>
              <Text style={styles.summaryLabel}>Today</Text>
              <Text style={styles.todayValue}>₹{summary.todaySales?.toFixed(2) || '0.00'}</Text>
              <Text style={styles.todayCount}>{summary.todayCount || 0} bills</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TabButton tab="daily" label={t('daily')} />
            <TabButton tab="monthly" label={t('monthly')} />
            <TabButton tab="yearly" label={t('yearly')} />
          </View>

          {/* Chart Area */}
          <View style={styles.chartArea}>
            {activeTab === 'daily' && (
              <>
                <Text style={styles.chartTitle}>{t('last7DaysSales')}</Text>
                {dailyData.length > 0 ? renderBarChart(dailyData) : (
                  <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>No sales data for this period</Text>
                  </View>
                )}
              </>
            )}
            {activeTab === 'monthly' && (
              <>
                <Text style={styles.chartTitle}>{t('last6MonthsSales')}</Text>
                {monthlyData.length > 0 ? renderBarChart(monthlyData, 'total') : (
                  <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>No sales data for this period</Text>
                  </View>
                )}
              </>
            )}
            {activeTab === 'yearly' && (
              <>
                <Text style={styles.chartTitle}>{t('yearlySalesDistribution')}</Text>
                {yearlyData.length > 0 ? renderYearlyChart(yearlyData) : (
                  <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>No sales data for this period</Text>
                  </View>
                )}
              </>
            )}
          </View>

          {/* Recent Bills */}
          <View style={styles.recentBillsSection}>
            <Text style={styles.sectionTitle}>{t('recentBills')}</Text>
            {last5Bills.length > 0 ? (
              last5Bills.map((bill, index) => (
                <TouchableOpacity
                  key={bill._id || index}
                  style={styles.billItem}
                  onPress={() => navigation.navigate('BillDetail', { bill })}
                >
                  <View style={styles.billInfo}>
                    <Text style={styles.billNumber}>{bill.billNumber}</Text>
                    <Text style={styles.billDate}>{bill.date} • {bill.items?.length || 0} items</Text>
                  </View>
                  <View style={styles.billAmount}>
                    <Text style={styles.amountText}>₹{bill.grandTotal?.toFixed(2)}</Text>
                    <Text style={styles.viewText}>View →</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noBillsContainer}>
                <Text style={styles.noBillsText}>{t('noBillsFound')}</Text>
              </View>
            )}
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
  headerTitle: {
    fontSize: 50,
    color: 'white',
    fontWeight: '400',
  },
  headerLine: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    marginTop: 10,
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    padding: 15,
    width: '48%',
    alignItems: 'center',
  },
  todayCard: {
    width: '100%',
    backgroundColor: '#1a3a1a',
    borderWidth: 1,
    borderColor: '#2ecc71',
  },
  summaryLabel: {
    color: '#888',
    fontSize: 14,
    marginBottom: 5,
  },
  summaryValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  todayValue: {
    color: '#2ecc71',
    fontSize: 28,
    fontWeight: 'bold',
  },
  todayCount: {
    color: '#2ecc71',
    fontSize: 14,
    marginTop: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    padding: 5,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#DA7320',
  },
  tabButtonText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: 'white',
  },
  chartArea: {
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  chartTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  chartContainer: {
    paddingVertical: 10,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 30,
    backgroundColor: '#3a3a3a',
    borderRadius: 5,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    backgroundColor: '#DA7320',
    borderRadius: 5,
  },
  barValue: {
    color: '#DA7320',
    fontSize: 10,
    marginBottom: 5,
    fontWeight: '600',
  },
  barLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
  yearBarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 220,
  },
  yearBarWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  yearBarFill: {
    backgroundColor: '#2ecc71',
    borderRadius: 5,
  },
  yearBarLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
  },
  yearBarCount: {
    color: '#888',
    fontSize: 11,
  },
  noDataContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: '#888',
    fontSize: 16,
  },
  recentBillsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  billItem: {
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  billInfo: {
    flex: 1,
  },
  billNumber: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  billDate: {
    color: '#888',
    fontSize: 14,
    marginTop: 3,
  },
  billAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    color: '#DA7320',
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewText: {
    color: '#888',
    fontSize: 12,
    marginTop: 3,
  },
  noBillsContainer: {
    padding: 30,
    alignItems: 'center',
  },
  noBillsText: {
    color: '#888',
    fontSize: 16,
  },
});

