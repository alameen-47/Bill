import { createContext, useMemo, useState } from 'react';

export const BillContext = createContext();

export const BillProvider = ({ children }) => {
  const [billItems, setBillItems] = useState([]);
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
      }}
    >
      {children}
    </BillContext.Provider>
  );
};
