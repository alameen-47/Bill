import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import searchImg from '../assets/icons/search.png';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { BillContext } from '../context/billContext';
import { useLanguage } from '../context/languageContext';

export default function AllBills({ navigation }) {
  const [search, setSearch] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { getAllBills, getBillsByDateRange, savedBills, loadSavedBills } = useContext(BillContext);
  const { t } = useLanguage();
  const [bills, setBills] = useState([]);

  // Load bills when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadBills();
    }, [])
  );

  const loadBills = () => {
    const allBills = getAllBills();
    setBills(allBills);
    loadSavedBills();
  };

  // Filter options
  const filterOptions = [
    { key: 'all', label: 'All Bills' },
    { key: 'today', label: 'Today' },
    { key: 'yesterday', label: 'Yesterday' },
    { key: 'week', label: 'Last 7 Days' },
    { key: 'month', label: 'This Month' },
  ];

  // Apply filter
  const applyFilter = (filterKey) => {
    setSelectedFilter(filterKey);
    const now = new Date();
    let filtered = [];

    switch (filterKey) {
      case 'today':
        const today = now.toLocaleDateString();
        filtered = savedBills.filter(b => 
          new Date(b.createdAt).toLocaleDateString() === today
        );
        break;
      case 'yesterday':
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toLocaleDateString();
        filtered = savedBills.filter(b => 
          new Date(b.createdAt).toLocaleDateString() === yesterdayStr
        );
        break;
      case 'week':
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = savedBills.filter(b => new Date(b.createdAt) >= weekAgo);
        break;
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = savedBills.filter(b => new Date(b.createdAt) >= monthStart);
        break;
      default:
        filtered = savedBills;
    }
    setBills(filtered);
    setShowFilterModal(false);
  };

  // Search functionality
  const searchData = (text) => {
    setSearch(text);
    if (text === '') {
      applyFilter(selectedFilter);
    } else {
      const allBills = getAllBills();
      const result = allBills.filter(item =>
        item.billNumber?.toLowerCase().includes(text.toLowerCase()) ||
        item.items?.some(item => item.name?.toLowerCase().includes(text.toLowerCase()))
      );
      setBills(result);
    }
  };

  // Render bill item
  const renderBillItem = ({ item }) => (
    <TouchableOpacity
      style={styles.billCard}
      onPress={() => navigation.navigate('BillDetail', { bill: item })}
    >
      <View style={styles.billInfo}>
        <Text style={styles.billNumber}>{item.billNumber || 'N/A'}</Text>
        <Text style={styles.billDate}>{item.date} • {item.time}</Text>
        <Text style={styles.billItems}>{item.items?.length || 0} items</Text>
      </View>
      <View style={styles.billAmount}>
        <Text style={styles.amountText}>₹{item.grandTotal?.toFixed(2) || '0.00'}</Text>
        <Text style={styles.viewText}>View →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('allBillsTitle')}</Text>
          <View style={styles.headerLine} />
        </View>

        {/* Search and Filter Row */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Image resizeMode="contain" style={styles.searchIcon} source={searchImg} />
            <TextInput
              placeholder={t('search')}
              value={search}
              placeholderTextColor="gray"
              onChangeText={searchData}
              style={styles.searchInput}
            />
          </View>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Text style={styles.filterButtonText}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* Active Filter Badge */}
        {selectedFilter !== 'all' && (
          <View style={styles.activeFilterRow}>
            <TouchableOpacity 
              style={styles.filterBadge}
              onPress={() => applyFilter('all')}
            >
              <Text style={styles.filterBadgeText}>
                {filterOptions.find(f => f.key === selectedFilter)?.label} ✕
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bills List */}
        <FlatList
          data={bills}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={renderBillItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t('noBillsFound')}</Text>
            </View>
          }
        />

        {/* Filter Modal */}
        <Modal
          visible={showFilterModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowFilterModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t('filterByDate')}</Text>
              
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.filterOption,
                    selectedFilter === option.key && styles.selectedFilterOption
                  ]}
                  onPress={() => applyFilter(option.key)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    selectedFilter === option.key && styles.selectedFilterText
                  ]}>
                    {option.label}
                  </Text>
                  {selectedFilter === option.key && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.closeModalText}>{t('cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    marginBottom: 15,
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
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchIcon: {
    width: wp('6%'),
    height: hp('3%'),
  },
  searchInput: {
    color: 'white',
    fontSize: 16,
    flex: 1,
    paddingVertical: 12,
  },
  filterButton: {
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonText: {
    color: 'white',
    fontSize: 20,
  },
  activeFilterRow: {
    marginBottom: 10,
  },
  filterBadge: {
    backgroundColor: '#DA7320',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  filterBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: hp('10%'),
  },
  billCard: {
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
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
    fontSize: 18,
    fontWeight: '600',
  },
  billDate: {
    color: '#888',
    fontSize: 14,
    marginTop: 4,
  },
  billItems: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  billAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    color: '#DA7320',
    fontSize: 20,
    fontWeight: 'bold',
  },
  viewText: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    color: '#888',
    fontSize: 18,
  },
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
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  filterOption: {
    backgroundColor: '#1C1C1D',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedFilterOption: {
    borderWidth: 2,
    borderColor: '#DA7320',
    backgroundColor: '#3a2a1a',
  },
  filterOptionText: {
    color: 'white',
    fontSize: 16,
  },
  selectedFilterText: {
    color: '#DA7320',
  },
  checkmark: {
    color: '#DA7320',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeModalButton: {
    backgroundColor: '#444',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  closeModalText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});

