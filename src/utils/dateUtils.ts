/**
 * 날짜를 YYYY-MM-DD 형식으로 변환
 */
export const formatDateForInput = (date: Date): string => {
  const isoString = date.toISOString();
  const datePart = isoString.split('T')[0];
  return datePart || '';
};

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 */
export const getTodayDateString = (): string => {
  return formatDateForInput(new Date());
};

/**
 * YYYY-MM-DD 형식의 문자열을 Date 객체로 변환
 */
export const parseInputDate = (dateString: string): Date => {
  return new Date(dateString + 'T00:00:00');
};

/**
 * Date 객체를 한국 로케일 형식으로 변환 (YYYY. M. D.)
 */
export const formatDateToKorean = (date: Date): string => {
  return date.toLocaleDateString('ko-KR');
};

/**
 * YYYY-MM-DD 형식을 한국 로케일 형식으로 변환
 */
export const formatInputDateToKorean = (dateString: string): string => {
  const date = parseInputDate(dateString);
  return formatDateToKorean(date);
};

/**
 * 날짜가 유효한지 검증
 */
export const isValidDate = (dateString: string): boolean => {
  if (!dateString) return false;
  const date = parseInputDate(dateString);
  return !isNaN(date.getTime());
};

/**
 * 날짜가 미래인지 확인
 */
export const isFutureDate = (dateString: string): boolean => {
  if (!isValidDate(dateString)) return false;
  const inputDate = parseInputDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정
  return inputDate > today;
};

/**
 * 날짜가 너무 과거인지 확인 (10년 전까지만 허용)
 */
export const isTooOldDate = (dateString: string): boolean => {
  if (!isValidDate(dateString)) return false;
  const inputDate = parseInputDate(dateString);
  const tenYearsAgo = new Date();
  tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
  return inputDate < tenYearsAgo;
};