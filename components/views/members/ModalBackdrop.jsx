"use client";

import { createPortal } from "react-dom";

export default function ModalBackdrop({ children, onClose }) {
  return createPortal(
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </div>,
    document.body
  );
}
