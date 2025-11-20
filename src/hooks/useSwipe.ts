import { useEffect, useRef, useState } from 'react';

/**
 * 터치 제스처(스와이프) 감지를 위한 커스텀 훅
 *
 * 모바일에서 좌우 스와이프를 감지하여 콜백 함수를 실행합니다.
 *
 * @param onSwipeLeft - 왼쪽 스와이프 시 호출되는 콜백
 * @param onSwipeRight - 오른쪽 스와이프 시 호출되는 콜백
 * @param minSwipeDistance - 스와이프로 인식되기 위한 최소 거리 (기본값: 50px)
 * @returns 제스처를 감지할 엘리먼트에 연결할 ref 객체
 *
 * @example
 * ```tsx
 * const swipeHandlers = useSwipe(
 *   () => console.log('Swiped left'),
 *   () => console.log('Swiped right')
 * );
 *
 * return <div ref={swipeHandlers}>Swipe me!</div>;
 * ```
 */
export function useSwipe(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  minSwipeDistance: number = 50
) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  /**
   * 터치 시작 위치 기록
   */
  const handleTouchStart = (e: TouchEvent): void => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0]?.clientX ?? null);
  };

  /**
   * 터치 이동 중 위치 기록
   */
  const handleTouchMove = (e: TouchEvent): void => {
    setTouchEnd(e.targetTouches[0]?.clientX ?? null);
  };

  /**
   * 터치 종료 시 스와이프 방향 판단 및 콜백 실행
   */
  const handleTouchEnd = (): void => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // 터치 이벤트 리스너 등록
    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);

    // 클린업: 컴포넌트 언마운트 시 이벤트 리스너 제거
    return (): void => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchStart, touchEnd, onSwipeLeft, onSwipeRight, minSwipeDistance]);

  return elementRef;
}
