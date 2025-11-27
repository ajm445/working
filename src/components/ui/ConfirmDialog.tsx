import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonClass?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  confirmButtonClass = 'bg-indigo-600 hover:bg-indigo-700 text-white'
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 아이콘 */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
            <span className="text-3xl">💬</span>
          </div>
        </div>

        {/* 제목 */}
        <h3
          id="dialog-title"
          className="text-xl font-bold text-gray-900 dark:text-white text-center mb-3 transition-colors duration-300"
        >
          {title}
        </h3>

        {/* 메시지 */}
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6 transition-colors duration-300">
          {message}
        </p>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 active:bg-gray-400 dark:active:bg-gray-500 transition-colors touch-manipulation"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-3 rounded-lg font-medium active:transform active:scale-95 transition-all touch-manipulation ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
