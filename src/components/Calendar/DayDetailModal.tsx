
import React from 'react';
import type { CalendarDay } from '../../types/calendar';
import type { Transaction } from '../../types/transaction';
import type { RecurringExpense } from '../../types/database';
import { getDayTransactionSummary } from '../../utils/calendar';
import { useCurrency } from '../../hooks/useCurrency';
import { useCurrencyConverter } from '../../hooks/useCurrencyConversion';

interface DayDetailModalProps {
  day: CalendarDay;
  recurringExpenses?: RecurringExpense[];
  onClose: () => void;
  onAddTransaction?: ((date: Date) => void) | undefined;
  onDeleteTransaction?: ((id: string) => void) | undefined;
  onEditTransaction?: ((transaction: Transaction) => void) | undefined;
}

const DayDetailModal: React.FC<DayDetailModalProps> = ({
  day,
  recurringExpenses = [],
  onClose,
  onAddTransaction,
  onDeleteTransaction,
  onEditTransaction
}) => {
  const { currentCurrency } = useCurrency();
  const { convertAmount } = useCurrencyConverter();

  const summary = getDayTransactionSummary(day.transactions, day.date);

  // 해당 날짜의 고정지출 필터링 (활성화된 것만)
  const dayOfMonth = day.date.getDate();
  const relevantRecurringExpenses = recurringExpenses.filter(
    expense => expense.is_active && expense.day_of_month === dayOfMonth
  );

  // 고정지출 총액 계산
  const totalRecurringExpense = relevantRecurringExpenses.reduce(
    (sum, expense) => sum + expense.amount_in_krw,
    0
  );

  // 고정지출을 포함한 총 지출 및 순액 계산
  const totalExpenseWithRecurring = summary.totalExpense + totalRecurringExpense;
  const netAmountWithRecurring = summary.totalIncome - totalExpenseWithRecurring;

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

  const handleDelete = (transactionId: string): void => {
    if (window.confirm('이 거래 내역을 삭제하시겠습니까?')) {
      onDeleteTransaction?.(transactionId);
    }
  };

  const handleEdit = (transaction: Transaction): void => {
    onEditTransaction?.(transaction);
    onClose();
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
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 id="modal-title" className="text-base sm:text-lg font-bold text-gray-900">
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
              className="p-2 sm:p-3 hover:bg-gray-200 active:bg-gray-300 rounded-lg transition-colors touch-manipulation"
              aria-label="닫기"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 모달 내용 */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[65vh] sm:max-h-[60vh]">
          {summary.hasTransactions || relevantRecurringExpenses.length > 0 ? (
            <div className="space-y-6">
              {/* 일일 요약 - 거래 내역 또는 고정지출이 있을 때 표시 */}
              {(summary.hasTransactions || relevantRecurringExpenses.length > 0) && (
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
                      {formatAmount(totalExpenseWithRecurring)}
                    </div>
                    {relevantRecurringExpenses.length > 0 && (
                      <div className="text-xs text-red-500 mt-1">
                        (고정지출 {formatAmount(totalRecurringExpense)} 포함)
                      </div>
                    )}
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-blue-600 text-sm font-medium">일일 순액</div>
                    <div className={`text-xl font-bold mt-1 ${
                      netAmountWithRecurring >= 0 ? 'text-blue-800' : 'text-red-600'
                    }`}>
                      {formatAmount(netAmountWithRecurring)}
                    </div>
                  </div>
                </div>
              )}

              {/* 고정지출 표시 (가장 상단, 강조) */}
              {relevantRecurringExpenses.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-100 text-purple-700 text-xs font-medium">
                      고정지출
                    </span>
                    <span className="text-sm text-gray-500">({relevantRecurringExpenses.length}건)</span>
                  </h4>
                  <div className="space-y-3">
                    {relevantRecurringExpenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="p-4 rounded-lg border-2 border-purple-400 bg-purple-50 shadow-md"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-xl">💳</span>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">
                                {expense.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {expense.category} · 매월 {expense.day_of_month}일
                              </div>
                              {expense.description && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {expense.description}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-purple-700">
                              -{formatAmount(expense.amount_in_krw)}
                            </div>
                            {expense.currency !== 'KRW' && (
                              <div className="text-xs text-gray-600 mt-1">
                                {expense.currency} {expense.amount.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 거래 내역 목록 - 거래 내역이 있을 때만 표시 */}
              {summary.hasTransactions && (
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
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-xl">
                              {getCategoryIcon(transaction.category)}
                            </span>
                            <div className="flex-1">
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
                          {/* 수정/삭제 버튼 - 모바일 터치 개선 */}
                          <div className="flex gap-1">
                            {onEditTransaction && (
                              <button
                                onClick={() => handleEdit(transaction)}
                                className="p-3 text-gray-400 hover:text-blue-600 active:text-blue-700 hover:bg-blue-50 active:bg-blue-100 rounded-lg transition-colors touch-manipulation"
                                aria-label={`${transaction.description} 거래 내역 수정`}
                                title="수정"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                            )}
                            {onDeleteTransaction && (
                              <button
                                onClick={() => handleDelete(transaction.id)}
                                className="p-3 text-gray-400 hover:text-red-600 active:text-red-700 hover:bg-red-50 active:bg-red-100 rounded-lg transition-colors touch-manipulation"
                                aria-label={`${transaction.description} 거래 내역 삭제`}
                                title="삭제"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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

        {/* 모달 푸터 - 모바일 개선 */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {onAddTransaction && (
              <button
                onClick={() => {
                  onAddTransaction(day.date);
                  onClose();
                }}
                className="w-full sm:flex-1 md:flex-none px-6 py-3 sm:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors touch-manipulation text-sm sm:text-base"
                aria-label={`${formatDate(day.date)}에 거래 내역 추가`}
              >
                ➕ 이 날짜에 내역 추가
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayDetailModal;