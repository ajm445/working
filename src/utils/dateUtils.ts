/**
 * KST/JST 시간대 기준으로 현재 날짜를 가져옴 (UTC+9)
 * 반환된 Date 객체는 내부적으로 KST 시간을 UTC로 저장하므로
 * getUTCFullYear(), getUTCMonth(), getUTCDate()를 사용해야 함
 */
export const getKSTDate = (): Date => {
  const now = new Date();
  // 현재 UTC 시간에 9시간을 더해서 KST 시간을 UTC로 표현
  const kstTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
  return kstTime;
};

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
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환 (KST/JST 기준)
 */
export const getTodayDateString = (): string => {
  return formatDateForInput(getKSTDate());
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
 * 날짜가 미래인지 확인 (KST/JST 기준)
 */
export const isFutureDate = (dateString: string): boolean => {
  if (!isValidDate(dateString)) return false;
  const inputDate = parseInputDate(dateString);
  const kstToday = getKSTDate();

  // inputDate는 로컬 시간대, kstToday는 KST를 UTC로 표현
  const inputYear = inputDate.getFullYear();
  const inputMonth = inputDate.getMonth();
  const inputDay = inputDate.getDate();

  const todayYear = kstToday.getUTCFullYear();
  const todayMonth = kstToday.getUTCMonth();
  const todayDay = kstToday.getUTCDate();

  if (inputYear > todayYear) return true;
  if (inputYear < todayYear) return false;
  if (inputMonth > todayMonth) return true;
  if (inputMonth < todayMonth) return false;
  return inputDay > todayDay;
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