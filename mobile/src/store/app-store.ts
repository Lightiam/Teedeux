import { create } from 'zustand';

import {
  DEMO_ADDRESSES,
  DEMO_PAYMENT_METHODS,
  STORES,
} from '../data/catalog';
import type { Address } from '../types';

interface AppState {
  selectedStoreId: string | null;
  deliveryAddress: Address | null;
  selectedPaymentMethodId: string | null;
  searchQuery: string;
  setStore: (storeId: string | null) => void;
  setAddress: (address: Address | null) => void;
  setPayment: (paymentMethodId: string | null) => void;
  setSearch: (query: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedStoreId: STORES[0]?.id ?? null,
  deliveryAddress: DEMO_ADDRESSES[0] ?? null,
  selectedPaymentMethodId:
    DEMO_PAYMENT_METHODS.find((p) => p.isDefault)?.id ??
    DEMO_PAYMENT_METHODS[0]?.id ??
    null,
  searchQuery: '',

  setStore: (storeId) => set({ selectedStoreId: storeId }),

  setAddress: (address) => set({ deliveryAddress: address }),

  setPayment: (paymentMethodId) =>
    set({ selectedPaymentMethodId: paymentMethodId }),

  setSearch: (query) => set({ searchQuery: query }),
}));
