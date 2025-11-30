import React, { useEffect } from 'react';
import type { TransactionFormData, Transaction } from '../../types';
import TransactionForm from './TransactionForm';

interface TransactionFormModalProps {
  onSubmit: (data: TransactionFormData & { amountInKRW: number }) => Promise<void>;
  onCancel: () => void;
  initialDate?: string | undefined;
  editingTransaction?: Transaction | null;
  onUpdate?: ((id: string, data: TransactionFormData & { amountInKRW: number }) => void) | undefined;
}

/**
 * 거래 내역 추가/수정 모달
 *
 * TransactionForm을 모달로 감싸서 표시합니다.
 * 모든 화면 크기(모바일/태블릿/데스크톱)에서 모달로 표시됩니다.
 * 모바일/태블릿: 하단 슬라이드업, 데스크톱: 중앙 모달
 */
const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  onSubmit,
  onCancel,
  initialDate,
  editingTransaction,
  onUpdate
}) => {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return (): void => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onCancel]);

  // 모든 화면 크기에서 모달로 표시
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-end md:items-center justify-center z-50 transition-colors duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="transaction-form-title"
      onClick={onCancel}
    >
      <div
        className="bg-white dark:bg-gray-800 w-full md:max-w-2xl md:rounded-xl rounded-t-2xl shadow-xl max-h-[90vh] overflow-y-auto transition-colors duration-300 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="sticky top-0 z-10 px-4 py-3 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-between rounded-t-2xl md:rounded-t-xl">
          <h2 id="transaction-form-title" className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">
            {editingTransaction ? '거래 내역 수정' : '거래 내역 추가'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600 rounded-lg transition-colors touch-manipulation"
            aria-label="닫기"
          >
            <svg className="w-6 h-6 text-gray-500 dark:text-gray-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 폼 내용 */}
        <div className="p-4">
          <TransactionForm
            onSubmit={onSubmit}
            onCancel={onCancel}
            initialDate={initialDate}
            editingTransaction={editingTransaction ?? null}
            onUpdate={onUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionFormModal;
