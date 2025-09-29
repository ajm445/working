/**
 * 날짜를 YYYY-MM-DD 형식으로 변환 (로컬 시간대 기준)
 */
export const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 */
export const getTodayDateString = (): string => {
  return formatDateForInput(new Date());
};

/**
 * YYYY-MM-DD 형식의 문자열을 Date 객체로 변환 (로컬 시간대 기준)
 */
export const parseInputDate = (dateString: string): Date => {
  const parts = dateString.split('-').map(Number);
  if (parts.length !== 3) {
    throw new Error('Invalid date format. Expected YYYY-MM-DD');
  }
  const [year, month, day] = parts;
  return new Date(year!, month! - 1, day!); // month는 0-based이므로 1을 빼줌
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