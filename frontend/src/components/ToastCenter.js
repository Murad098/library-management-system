import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const ToastContext = createContext(() => {});
const AUTO_DISMISS_MS = 4500;

export const useToast = () => useContext(ToastContext);

function ToastCenter({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    const timer = timers.current.get(id);

    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, tone = "success") => {
      const text = typeof message === "string" ? message.trim() : "";

      if (!text) return;

      const id = (nextId.current += 1);

      setToasts((current) => [...current, { id, message: text, tone }]);
      timers.current.set(
        id,
        window.setTimeout(() => dismiss(id), AUTO_DISMISS_MS)
      );
    },
    [dismiss]
  );

  useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current.clear();
    },
    []
  );

  const value = useMemo(() => showToast, [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="toast-center" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast--${toast.tone}`}>
            {toast.tone === "error" ? (
              <AlertCircle className="toast__icon" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="toast__icon" aria-hidden="true" />
            )}
            <span className="toast__text">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastCenter;
