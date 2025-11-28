import React, { useState, useContext } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { CurrencyContext } from '../../contexts/CurrencyContext';
import type { RecurringExpense } from '../../types/database';
import * as recurringExpenseService from '../../services/recurringExpenseService';

interface RecurringExpenseFormProps {
  expense: RecurringExpense | null;
  onClose: () => void;
  onSuccess: () => void;
  onAdd?: (expense: RecurringExpense) => void;
  onUpdate?: (expense: RecurringExpense) => void;
}

const EXPENSE_CATEGORIES = [
  '주거',
  '공과금',
  '통신비',
  '교통비',
  '보험',
  '구독 서비스',
  '학원/교육',
  '기타',
];

const RecurringExpenseForm: React.FC<RecurringExpenseFormProps> = ({
  expense,
  onClose,
  onSuccess,
  onAdd,
  onUpdate,
}) => {
  const { user } = useAuth();
  const currencyContext = useContext(CurrencyContext);
  const [loading, setLoading] = useState(false);

  const selectedCurrency = currencyContext?.currentCurrency || 'KRW';
  const exchangeRates = currencyContext?.exchangeRates;

  // 폼 상태
  const [name, setName] = useState(expense?.name || '');
  const [amount, setAmount] = useState(
    expense?.amount ? expense.amount.toLocaleString('en-US') : ''
  );
  const [currency, setCurrency] = useState<'KRW' | 'USD' | 'JPY'>(
    expense?.currency || selectedCurrency as 'KRW' | 'USD' | 'JPY'
  );
  const [category, setCategory] = useState(expense?.category || '주거');
  const [dayOfMonth, setDayOfMonth] = useState(expense?.day_of_month || 1);
  const [description, setDescription] = useState(expense?.description || '');
  const [isActive, setIsActive] = useState(expense?.is_active ?? true);

  // 금액 입력 핸들러 (쉼표 포맷팅)
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    // 숫자와 쉼표만 허용
    const numbersOnly = value.replace(/[^\d]/g, '');

    if (numbersOnly === '') {
      setAmount('');
      return;
    }

    // 숫자를 쉼표 포맷으로 변환
    const formatted = parseInt(numbersOnly, 10).toLocaleString('en-US');
    setAmount(formatted);
  };

  // 원화 환산 금액 계산
  const calculateAmountInKRW = (amt: number, curr: 'KRW' | 'USD' | 'JPY'): number => {
    if (curr === 'KRW') return amt;

    // 환율 정보가 없으면 원화 그대로 반환 (경고 출력)
    if (!exchangeRates || !exchangeRates[curr]) {
      console.warn(`환율 정보가 없어 ${curr} → KRW 변환을 할 수 없습니다. 원화 금액을 그대로 사용합니다.`);
      return amt; // 환율이 없으면 입력값 그대로 사용
    }

    const rate = exchangeRates[curr];
    // 다른 통화 → KRW: amount / rate (예: 100달러 / 0.00071 = 140,845원)
    return Math.round(amt / rate);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('고정지출 이름을 입력해주세요.');
      return;
    }

    // 쉼표 제거 후 숫자로 변환
    const amountNum = parseFloat(amount.replace(/,/g, ''));
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('올바른 금액을 입력해주세요.');
      return;
    }

    if (dayOfMonth < 1 || dayOfMonth > 31) {
      toast.error('지출 날짜는 1일부터 31일 사이여야 합니다.');
      return;
    }

    // 환율 정보 확인 (KRW가 아닌 경우)
    if (currency !== 'KRW' && (!exchangeRates || !exchangeRates[currency])) {
      toast.error('환율 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setLoading(true);

    try {
      const amountInKRW = calculateAmountInKRW(amountNum, currency);

      const expenseData = {
        name: name.trim(),
        amount: amountNum,
        currency,
        amount_in_krw: amountInKRW,
        category,
        day_of_month: dayOfMonth,
        description: description.trim() || null,
        is_active: isActive,
      };

      if (expense) {
        // 수정
        if (user && !expense.id.startsWith('local-')) {
          // 로그인 상태이고 Supabase 데이터면 서버에 저장
          const { error } = await recurringExpenseService.updateRecurringExpense(
            expense.id,
            expenseData
          );

          if (error) {
            toast.error('수정에 실패했습니다.');
            setLoading(false);
            return;
          }
        }

        // 로컬 상태 업데이트 (비로그인 또는 로컬 데이터)
        const updatedExpense: RecurringExpense = {
          ...expense,
          ...expenseData,
          updated_at: new Date().toISOString(),
        };

        onUpdate?.(updatedExpense);
        toast.success('고정지출이 수정되었습니다.');
        onSuccess();
      } else {
        // 추가
        if (user) {
          // 로그인 상태면 Supabase에 저장
          const { data, error } = await recurringExpenseService.addRecurringExpense(
            expenseData,
            user.id
          );

          if (error) {
            toast.error('추가에 실패했습니다.');
            setLoading(false);
            return;
          }

          if (data) {
            onAdd?.(data);
          }
        } else {
          // 비로그인 상태면 로컬에만 저장
          const localExpense: RecurringExpense = {
            id: `local-${Date.now()}-${Math.random()}`,
            user_id: 'local',
            ...expenseData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          onAdd?.(localExpense);

          toast('⚠️ 로그인하지 않아 데이터가 임시로만 저장됩니다.\n새로고침 시 데이터가 사라집니다.', {
            icon: '⚠️',
            duration: 4000,
          });
        }

        toast.success('고정지출이 추가되었습니다.');
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving recurring expense:', error);
      toast.error('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {expense ? '고정지출 수정' : '고정지출 추가'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 이름 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              고정지출 이름 <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 월세, 공과금, 넷플릭스"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
              required
            />
          </div>

          {/* 금액 및 통화 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                금액 <span className="text-red-500">*</span>
              </label>
              <input
                id="amount"
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                required
              />
            </div>
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                통화
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as 'KRW' | 'USD' | 'JPY')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
              >
                <option value="KRW">KRW (₩)</option>
                <option value="USD">USD ($)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
          </div>

          {/* 카테고리 */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              카테고리
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
            >
              {EXPENSE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 지출 날짜 */}
          <div>
            <label htmlFor="dayOfMonth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              매월 지출 날짜
            </label>
            <input
              id="dayOfMonth"
              type="number"
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(parseInt(e.target.value))}
              min="1"
              max="31"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              매월 {dayOfMonth}일에 지출됩니다
            </p>
          </div>

          {/* 설명 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              설명 (선택)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="추가 설명을 입력하세요"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors resize-none"
            />
          </div>

          {/* 활성화 여부 */}
          <div className="flex items-center gap-3">
            <input
              id="isActive"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              활성화 (체크하면 월별 총액에 포함됩니다)
            </label>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '저장 중...' : expense ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecurringExpenseForm;
