
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
      className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4 transition-colors duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-hidden transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 id="modal-title" className="text-base sm:text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">
                {formatDate(day.date)}
              </h3>
              {day.isToday && (
                <span className="inline-block mt-1 px-2 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50 rounded-full transition-colors duration-300">
                  오늘
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 sm:p-3 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600 rounded-lg transition-colors touch-manipulation"
              aria-label="닫기"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 transition-colors duration-300">
                    <div className="text-green-600 dark:text-green-400 text-sm font-medium transition-colors duration-300">총 수입</div>
                    <div className="text-green-800 dark:text-green-300 text-xl font-bold mt-1 transition-colors duration-300">
                      {formatAmount(summary.totalIncome)}
                    </div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 transition-colors duration-300">
                    <div className="text-red-600 dark:text-red-400 text-sm font-medium transition-colors duration-300">총 지출</div>
                    <div className="text-red-800 dark:text-red-300 text-xl font-bold mt-1 transition-colors duration-300">
                      {formatAmount(totalExpenseWithRecurring)}
                    </div>
                    {relevantRecurringExpenses.length > 0 && (
                      <div className="text-xs text-red-500 dark:text-red-400 mt-1 transition-colors duration-300">
                        (고정지출 {formatAmount(totalRecurringExpense)} 포함)
                      </div>
                    )}
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 transition-colors duration-300">
                    <div className="text-blue-600 dark:text-blue-400 text-sm font-medium transition-colors duration-300">일일 순액</div>
                    <div className={`text-xl font-bold mt-1 transition-colors duration-300 ${
                      netAmountWithRecurring >= 0 ? 'text-blue-800 dark:text-blue-300' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatAmount(netAmountWithRecurring)}
                    </div>
                  </div>
                </div>
              )}

              {/* 고정지출 표시 (가장 상단, 강조) */}
              {relevantRecurringExpenses.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 transition-colors duration-300">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-medium transition-colors duration-300">
                      고정지출
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">({relevantRecurringExpenses.length}건)</span>
                  </h4>
                  <div className="space-y-3">
                    {relevantRecurringExpenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="p-4 rounded-lg border-2 border-purple-400 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20 shadow-md transition-colors duration-300"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-xl">💳</span>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                                {expense.name}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                                {expense.category} · 매월 {expense.day_of_month}일
                              </div>
                              {expense.description && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
                                  {expense.description}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-purple-700 dark:text-purple-300 transition-colors duration-300">
                              -{formatAmount(expense.amount_in_krw)}
                            </div>
                            {expense.currency !== 'KRW' && (
                              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
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
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                    거래 내역 ({summary.transactionCount}건)
                  </h4>
                  <div className="space-y-3">
                    {day.transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className={`
                          p-4 rounded-lg border-l-4 bg-gray-50 dark:bg-gray-700/50 transition-colors duration-300
                          ${transaction.type === 'income' ? 'border-green-500 dark:border-green-400' : 'border-red-500 dark:border-red-400'}
                        `}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-xl">
                              {getCategoryIcon(transaction.category)}
                            </span>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
                                {transaction.description}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                                {transaction.category}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold transition-colors duration-300 ${
                              transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              {transaction.type === 'income' ? '+' : '-'}
                              {formatAmount(transaction.amountInKRW)}
                            </div>
                            {transaction.currency !== 'KRW' && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
                                {transaction.currency} {transaction.amount.toLocaleString()}
                              </div>
                            )}
                          </div>
                          {/* 수정/삭제 버튼 - 모바일 터치 개선 */}
                          <div className="flex gap-1">
                            {onEditTransaction && (
                              <button
                                onClick={() => handleEdit(transaction)}
                                className="p-3 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 active:text-blue-700 dark:active:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 active:bg-blue-100 dark:active:bg-blue-900/30 rounded-lg transition-colors touch-manipulation"
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
                                className="p-3 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 active:text-red-700 dark:active:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 active:bg-red-100 dark:active:bg-red-900/30 rounded-lg transition-colors touch-manipulation"
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
              <div className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2 transition-colors duration-300">
                이 날에는 거래 내역이 없습니다
              </div>
              <div className="text-gray-400 dark:text-gray-500 text-sm transition-colors duration-300">
                내역 추가하기를 통해 새로운 거래를 등록해보세요
              </div>
            </div>
          )}
        </div>

        {/* 모달 푸터 - 모바일 개선 */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {onAddTransaction && (
              <button
                onClick={() => {
                  onAddTransaction(day.date);
                  onClose();
                }}
                className="w-full sm:flex-1 md:flex-none px-6 py-3 sm:py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 active:bg-indigo-800 dark:active:bg-indigo-700 transition-colors touch-manipulation text-sm sm:text-base"
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