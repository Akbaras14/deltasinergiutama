"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createDemoService } from "@/lib/demo";
import {
  createCustomerService,
  type CustomerService,
  type ShopState,
} from "./service";
interface ShopContext {
  state: ShopState;
  loading: boolean;
  error: string;
  refresh: () => void;
  service: CustomerService;
  sync: () => void;
}
const Context = createContext<ShopContext | null>(null);
/** Keeps demo cart/order state across client navigation. Reload intentionally resets the simulation. */
export function CustomerProvider({ children }: { children: ReactNode }) {
  const [service] = useState(() => createCustomerService(createDemoService()));
  const [state, setState] = useState<ShopState>({
    products: [],
    cart: [],
    orders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    service
      .read()
      .then((value) => {
        if (active) {
          setState(value);
          setLoading(false);
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Katalog belum dapat dimuat.",
          );
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [service, attempt]);
  return (
    <Context.Provider
      value={{
        state,
        loading,
        error,
        service,
        sync: () => setState(service.snapshot()),
        refresh: () => {
          setLoading(true);
          setError("");
          setAttempt((v) => v + 1);
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useShop() {
  const value = useContext(Context);
  if (!value) throw new Error("CustomerProvider diperlukan.");
  return value;
}
