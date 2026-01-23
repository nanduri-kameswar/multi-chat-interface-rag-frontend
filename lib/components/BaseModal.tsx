"use client";

import { ReactNode, useEffect } from "react";
import FocusLock from "react-focus-lock";

type Props = {
  children: ReactNode;
  onClose: () => void;
};

export function Modal({ children, onClose }: Props) {
  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Escape key handling
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <FocusLock returnFocus>
        <div
          role="dialog"
          aria-modal="true"
          className="outline-none"
        >
          {children}
        </div>
      </FocusLock>
    </div>
  );
}
