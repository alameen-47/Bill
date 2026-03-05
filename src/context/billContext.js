import {
  createContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';
import { useAuth } from './authContext';

export const BillContext = createContext();

const BILLS_STORAGE_KEY = '@saved_bills';

export const BillProvider = ({ children }) => {
  const [billItems, setBillItems] = useState([]);
  const [savedBills, setSavedBills] = useState([]);
  const [auth, setAuth] = useAuth ? useAuth() : [{}, () => {}];
  const token = auth?.token;

  // Load saved bills from AsyncStorage on mount
  useEffect(() => {
    loadSavedBills();
  }, []);

  // Load bills from AsyncStorage
  const loadSavedBills = async () => {
    try {
      const stored = await AsyncStorage.getItem(BILLS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedBills(parsed);
      }
    } catch (error) {
      console.log('Error loading saved bills:', error);
    }
  };

  // Save bills to AsyncStorage
  const saveBillsToStorage = async bills => {
    try {
      await AsyncStorage.setItem(BILLS_STORAGE_KEY, JSON.stringify(bills));
    } catch (error) {
      console.log('Error saving bills:', error);
    }
  };

  // Save a new bill after printing - saves to both local storage and backend
  const saveBill = useCallback(async billData => {
    const newBill = {
      _id: Date.now().toString(),
      ...billData,
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      userId: auth?.user?.id || null, // Store user ID
    };

    // Save to local storage
    setSavedBills(prev => {
      const updated = [newBill, ...prev];
      // Keep only last 100 bills to avoid storage overflow
      const trimmed = updated.slice(0, 100);
      saveBillsToStorage(trimmed);
      return trimmed;
    });

    // Also save to backend for QR code access (with user ID if logged in)
    try {
      const backendBillData = {
        billNumber: billData.billNumber,
        items: billData.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subTotal: billData.subTotal,
        tax: billData.tax || 0,
        discount: billData.discount || 0,
        grandTotal: billData.grandTotal,
        paymentMethod: billData.paymentMethod,
        shopName: billData.shopName,
        shopAddress: billData.shopAddress,
        shopPhone: billData.shopPhone,
        date: billData.date,
        time: billData.time,
      };

      // Only save to backend if we have a token (user is logged in)
      if (token) {
        const response = await api.post(
          '/api/v1/bills/createBill',
          backendBillData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.data.success) {
          console.log('Bill saved to backend successfully with user ID');
        }
      } else {
        console.log('No token - bill saved locally only');
      }
    } catch (error) {
      console.log('Error saving bill to backend:', error?.response?.data || error.message);
      // Don't fail the whole operation if backend save fails
      // Local save already succeeded
    }
  }, [token, auth?.user]);

  // Get bills from backend based on user ID
  const fetchBillsFromBackend = useCallback(async () => {
    if (!token) {
      console.log('No token - cannot fetch from backend');
      return savedBills;
    }

    try {
      const response = await api.get('/api/v1/bills/getAllBill', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const backendBills = response.data.allBills;
        // Update local storage with backend bills
        setSavedBills(backendBills);
        await saveBillsToStorage(backendBills);
        return backendBills;
      }
    } catch (error) {
      console.log('Error fetching bills from backend:', error?.response?.data || error.message);
    }
    return savedBills;
  }, [token, savedBills]);

  // Get last 5 bills
  const getLast5Bills = useCallback(() => {
    return savedBills.slice(0, 5);
  }, [savedBills]);

  // Get all bills
  const getAllBills = useCallback(() => {
    return savedBills;
  }, [savedBills]);

  // Get bills filtered by date range
  const getBillsByDateRange = useCallback(
    (startDate, endDate) => {
      return savedBills.filter(bill => {
        const billDate = new Date(bill.createdAt);
        return billDate >= startDate && billDate <= endDate;
      });
    },
    [savedBills],
  );

  // Get daily sales for reports
  const getDailySales = useCallback(
    (days = 7) => {
      const now = new Date();
      const sales = [];

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString();

        const dayBills = savedBills.filter(bill => {
          const billDate = new Date(bill.createdAt).toLocaleDateString();
          return billDate === dateStr;
        });

        sales.push({
          date: dateStr,
          total: dayBills.reduce((sum, b) => sum + (b.grandTotal || 0), 0),
          count: dayBills.length,
        });
      }
      return sales;
    },
    [savedBills],
  );

  // Get monthly sales for reports
  const getMonthlySales = useCallback(
    (months = 6) => {
      const now = new Date();
      const sales = [];

      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStr = date.toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        });

        const monthBills = savedBills.filter(bill => {
          const billDate = new Date(bill.createdAt);
          return (
            billDate.getMonth() === date.getMonth() &&
            billDate.getFullYear() === date.getFullYear()
          );
        });

        sales.push({
          month: monthStr,
          total: monthBills.reduce((sum, b) => sum + (b.grandTotal || 0), 0),
          count: monthBills.length,
        });
      }
      return sales;
    },
    [savedBills],
  );

  // Get yearly sales for reports
  const getYearlySales = useCallback(() => {
    const yearlyData = {};

    savedBills.forEach(bill => {
      const year = new Date(bill.createdAt).getFullYear();
      if (!yearlyData[year]) {
        yearlyData[year] = { total: 0, count: 0 };
      }
      yearlyData[year].total += bill.grandTotal || 0;
      yearlyData[year].count += 1;
    });

    return Object.entries(yearlyData)
      .map(([year, data]) => ({ year, ...data }))
      .sort((a, b) => a.year - b.year);
  }, [savedBills]);

  // Get report summary
  const getReportSummary = useCallback(() => {
    const totalSales = savedBills.reduce(
      (sum, b) => sum + (b.grandTotal || 0),
      0,
    );
    const totalBills = savedBills.length;
    const averageBill = totalBills > 0 ? totalSales / totalBills : 0;

    // Today's sales
    const today = new Date().toLocaleDateString();
    const todayBills = savedBills.filter(
      b => new Date(b.createdAt).toLocaleDateString() === today,
    );
    const todaySales = todayBills.reduce(
      (sum, b) => sum + (b.grandTotal || 0),
      0,
    );

    return {
      totalSales,
      totalBills,
      averageBill,
      todaySales,
      todayCount: todayBills.length,
    };
  }, [savedBills]);

  //ADD ITEM TO BILL
  const addItem = item => {
    setBillItems(prev => {
      const existing = prev?.find(p => p._id == item._id);
      if (existing) {
        return prev.map(p =>
          p._id == item._id ? { ...p, quantity: p.quantity + 1 } : p,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };
  //INCREASE QUANTITY
  const increaseQty = id => {
    setBillItems(prev =>
      prev.map(item =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  //DECREASE QUANTITY
  const decreaseQty = id => {
    setBillItems(prev =>
      prev
        .map(item =>
          item._id == id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter(item => item.quantity > 0),
    );
  };
  //TOTAL CALCULATION
  const total = useMemo(() => {
    return billItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [billItems]);

  // REMOVE ITEM FROM BILL
  const removeItem = index => {
    setBillItems(prev => prev.filter((_, i) => i !== index));
  };

  // CLEAR ALL BILL
  const clearBill = () => {
    setBillItems([]);
  };

  return (
    <BillContext.Provider
      value={{
        billItems,
        addItem,
        increaseQty,
        decreaseQty,
        total,
        removeItem,
        clearBill,
        // New bill storage functionality
        savedBills,
        saveBill,
        getLast5Bills,
        getAllBills,
        getBillsByDateRange,
        getDailySales,
        getMonthlySales,
        getYearlySales,
        getReportSummary,
        loadSavedBills,
        fetchBillsFromBackend,
      }}
    >
      {children}
    </BillContext.Provider>
  );
};
