import React from 'react';
import type { CalendarDay } from '../../types/calendar';
import { getDayTransactionSummary } from '../../utils/calendar';
import { useCurrency } from '../../hooks/useCurrency';
import { useCurrencyConverter } from '../../hooks/useCurrencyConversion';

interface DayDetailModalProps {
  day: CalendarDay;
  onClose: () => void;
  onAddTransaction?: ((date: Date) => void) | undefined;
}

const DayDetailModal: React.FC<DayDetailModalProps> = ({ day, onClose, onAddTransaction }) => {
  const { currentCurrency } = useCurrency();
  const { convertAmount } = useCurrencyConverter();

  const summary = getDayTransactionSummary(day.transactions, day.date);

  const formatAmount = (amount: number): string => {
    const convertedAmount = convertAmount(amount, 'KRW', currentCurrency);
    const symbol = currentCurrency === 'KRW' ? '₩' : currentCurrency === 'JPY' ? '¥' : '$';
    return `${symbol}${Math.round(convertedAmount).toLocaleString()}`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const getCategoryIcon = (category: string): string => {
    const iconMap: { [key: string]: string } = {
      '식비': '🍽️',
      '숙박': '🏠',
      '교통': '🚌',
      '쇼핑': '🛍️',
      '의료': '🏥',
      '통신': '📱',
      '기타': '🎯',
      '급여': '💼',
      '용돈': '💸',
      '기타수입': '💰',
    };
    return iconMap[category] || '📝';
  };

  // 키보드 ESC로 모달 닫기
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return (): void => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* 모달 헤더 */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {formatDate(day.date)}
              </h3>
              {day.isToday && (
                <span className="inline-block mt-1 px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full">
                  오늘
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              aria-label="닫기"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 모달 내용 */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {summary.hasTransactions ? (
            <div className="space-y-6">
              {/* 일일 요약 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-green-600 text-sm font-medium">총 수입</div>
                  <div className="text-green-800 text-xl font-bold mt-1">
                    {formatAmount(summary.totalIncome)}
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="text-red-600 text-sm font-medium">총 지출</div>
                  <div className="text-red-800 text-xl font-bold mt-1">
                    {formatAmount(summary.totalExpense)}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-blue-600 text-sm font-medium">일일 순액</div>
                  <div className={`text-xl font-bold mt-1 ${
                    summary.totalIncome - summary.totalExpense >= 0 ? 'text-blue-800' : 'text-red-600'
                  }`}>
                    {formatAmount(summary.totalIncome - summary.totalExpense)}
                  </div>
                </div>
              </div>

              {/* 거래 내역 목록 */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">
                  거래 내역 ({summary.transactionCount}건)
                </h4>
                <div className="space-y-3">
                  {day.transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className={`
                        p-4 rounded-lg border-l-4 bg-gray-50
                        ${transaction.type === 'income' ? 'border-green-500' : 'border-red-500'}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">
                            {getCategoryIcon(transaction.category)}
                          </span>
                          <div>
                            <div className="font-medium text-gray-900">
                              {transaction.description}
                            </div>
                            <div className="text-sm text-gray-500">
                              {transaction.category}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatAmount(transaction.amountInKRW)}
                          </div>
                          {transaction.currency !== 'KRW' && (
                            <div className="text-xs text-gray-500 mt-1">
                              {transaction.currency} {transaction.amount.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <div className="text-gray-500 text-lg font-medium mb-2">
                이 날에는 거래 내역이 없습니다
              </div>
              <div className="text-gray-400 text-sm">
                내역 추가하기를 통해 새로운 거래를 등록해보세요
              </div>
            </div>
          )}
        </div>

        {/* 모달 푸터 */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex gap-3">
            {onAddTransaction && (
              <button
                onClick={() => {
                  onAddTransaction(day.date);
                  onClose();
                }}
                className="flex-1 md:flex-none px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                ➕ 이 날짜에 내역 추가
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 md:flex-none px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayDetailModal;