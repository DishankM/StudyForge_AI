"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";

type ToastType = "success" | "error";

type ToastState = {
  message: string;
  type: ToastType;
  id: number;
};

type ToastContextValue = {
  toast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const idRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { message, type, id }]);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timeoutRef.current = null;
    }, 4000);
  }, []);

  useEffect(() => () => { timeoutRef.current && clearTimeout(timeoutRef.current); }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-xl bg-card border shadow-lg shadow-black/20 ${
                t.type === "error" ? "border-red-500/30" : "border-white/10"
              }`}
            >
              {t.type === "success" && (
                <CheckCircle2 className="w-5 h-5 text-primary-pink shrink-0" />
              )}
              {t.type === "error" && (
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              )}
              <span className="text-text-primary text-sm font-medium">
                {t.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
