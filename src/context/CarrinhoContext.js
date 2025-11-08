
import React, { createContext, useContext, useMemo, useState } from 'react';

export const CarrinhoContext = createContext();

export function CarrinhoProvider({ children }) {
  // Estrutura do cart: { [name]: { qty: number, price: number } }
  const [cart, setCart] = useState({});

  const addItem = (name, price) => {
    setCart(prev => {
      const current = prev[name] || { qty: 0, price };
      return { ...prev, [name]: { qty: current.qty + 1, price } };
    });
  };

  const removeItem = (name) => {
    setCart(prev => {
      const item = prev[name];
      if (!item) return prev;
      if (item.qty <= 1) {
        const { [name]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [name]: { ...item, qty: item.qty - 1 } };
    });
  };

  const setItemQuantity = (name, qty) => {
    setCart(prev => {
      if (qty <= 0) {
        const { [name]: _, ...rest } = prev;
        return rest;
      }
      const existing = prev[name] || { price: 0 };
      return { ...prev, [name]: { qty, price: existing.price } };
    });
  };

  const clearCart = () => setCart({});

  const totalItems = useMemo(
    () => Object.values(cart).reduce((s, i) => s + (i.qty || 0), 0),
    [cart]
  );

  const totalValue = useMemo(
    () => Object.values(cart).reduce((s, i) => s + (i.qty * (i.price || 0)), 0),
    [cart]
  );

  const value = {
    cart,
    addItem,
    removeItem,
    setItemQuantity,
    clearCart,
    totalItems,
    totalValue,
  };

  return (
    <CarrinhoContext.Provider value={value}>
      {children}
    </CarrinhoContext.Provider>
  );
}

// hook de conveniência
export const useCarrinho = () => useContext(CarrinhoContext);
