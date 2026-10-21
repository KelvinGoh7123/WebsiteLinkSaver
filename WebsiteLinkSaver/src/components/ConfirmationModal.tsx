import { useEffect, useState } from "react";
import { AlertTriangle, X, Trash2, CheckCircle } from "lucide-react";

interface ConfirmationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName: string;
  confirmText?: string;
  cancelText?: string;
  type?: "delete" | "warning" | "info";
}

const ConfirmationModal = ({
  isVisible,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "delete",
}: ConfirmationModalProps) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  if (!show) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case "delete":
        return <Trash2 className="w-8 h-8 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-8 h-8 text-yellow-600" />;
      default:
        return <CheckCircle className="w-8 h-8 text-blue-600" />;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case "delete":
        return "bg-red-100";
      case "warning":
        return "bg-yellow-100";
      default:
        return "bg-blue-100";
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case "delete":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700 text-white";
      default:
        return "bg-blue-600 hover:bg-blue-700 text-white";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative p-6 text-center">
          {/* Icon */}
          <div
            className={`mx-auto w-16 h-16 ${getIconBg()} rounded-full flex items-center justify-center mb-4 animate-in zoom-in-95 duration-500`}
          >
            {getIcon()}
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>

          {/* Message */}
          <p className="text-gray-600 mb-6">{message}</p>

          {/* Item Info Card */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="font-medium text-gray-900 text-sm mb-1">
                  {itemName}
                </p>
                <p className="text-xs text-gray-500">
                  This action cannot be undone
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2 ${getConfirmButtonStyle()}`}
            >
              {type === "delete" && <Trash2 className="w-4 h-4" />}
              <span>{confirmText}</span>
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
