import { useEffect, useState } from "react";
import { CheckCircle, X, ExternalLink, Star } from "lucide-react";

interface SuccessModalProps {
  isVisible: boolean;
  onClose: () => void;
  websiteName: string;
  websiteUrl: string;
  isFavorite?: boolean;
  onViewWebsite?: () => void;
  onGoHome?: () => void;
}

const SuccessModal = ({
  isVisible,
  onClose,
  websiteName,
  websiteUrl,
  isFavorite = false,
  onViewWebsite,
  onGoHome,
}: SuccessModalProps) => {
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

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-300">
        {/* Header with Success Icon */}
        <div className="relative p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in-95 duration-500">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Website Added Successfully!
          </h2>

          <p className="text-gray-600 mb-6">
            <span className="font-semibold text-gray-900">{websiteName}</span>{" "}
            has been saved to your collection.
          </p>

          {/* Website Info Card */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ExternalLink className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 text-sm">
                    {websiteName}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-48">
                    {websiteUrl}
                  </p>
                </div>
              </div>
              {isFavorite && (
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {onViewWebsite && (
              <button
                onClick={onViewWebsite}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Visit Website</span>
              </button>
            )}

            {onGoHome && (
              <button
                onClick={onGoHome}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Go to Home</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full text-gray-500 py-2 px-4 rounded-lg font-medium hover:text-gray-700 transition-colors"
            >
              Add Another Website
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

export default SuccessModal;
