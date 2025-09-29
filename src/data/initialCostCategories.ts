import type { InitialCostCategory, CountryInfo } from '../types/initialCost';

export const INITIAL_COST_CATEGORIES: InitialCostCategory[] = [
  // 필수 비용
  {
    id: 'airfare',
    name: '항공료',
    nameEn: 'Airfare',
    icon: '✈️',
    description: '왕복 항공료 (성수기/비수기 고려)',
    isRequired: true,
    estimatedRange: {
      min: 800000,
      max: 2000000,
      currency: 'KRW'
    }
  },
  {
    id: 'visa',
    name: '비자비',
    nameEn: 'Visa Fee',
    icon: '📄',
    description: '워킹홀리데이 비자 신청 수수료',
    isRequired: true,
    estimatedRange: {
      min: 200000,
      max: 600000,
      currency: 'KRW'
    }
  },
  {
    id: 'insurance',
    name: '보험료',
    nameEn: 'Insurance',
    icon: '🏥',
    description: '여행자보험 또는 현지 의료보험',
    isRequired: true,
    estimatedRange: {
      min: 300000,
      max: 800000,
      currency: 'KRW'
    }
  },
  {
    id: 'initial-accommodation',
    name: '초기 숙박비',
    nameEn: 'Initial Accommodation',
    icon: '🏠',
    description: '첫 1-2주간 숙박비 (백팩커, 에어비앤비 등)',
    isRequired: true,
    estimatedRange: {
      min: 200000,
      max: 800000,
      currency: 'KRW'
    }
  },
  // 선택 비용
  {
    id: 'language-school',
    name: '어학원 등록비',
    nameEn: 'Language School',
    icon: '📚',
    description: '어학원 수강료 (선택사항)',
    isRequired: false,
    estimatedRange: {
      min: 1000000,
      max: 5000000,
      currency: 'KRW'
    }
  },
  {
    id: 'agent-fee',
    name: '공인중개사 비용',
    nameEn: 'Agent Fee',
    icon: '👔',
    description: '유학원 또는 중개업체 이용 시',
    isRequired: false,
    estimatedRange: {
      min: 300000,
      max: 1500000,
      currency: 'KRW'
    }
  },
  {
    id: 'phone-setup',
    name: '휴대폰 개통비',
    nameEn: 'Phone Setup',
    icon: '📱',
    description: '현지 휴대폰 개통 및 초기 요금',
    isRequired: false,
    estimatedRange: {
      min: 50000,
      max: 200000,
      currency: 'KRW'
    }
  },
  {
    id: 'equipment',
    name: '장비 및 용품',
    nameEn: 'Equipment & Supplies',
    icon: '🎒',
    description: '노트북, 의류, 생필품 등',
    isRequired: false,
    estimatedRange: {
      min: 300000,
      max: 1500000,
      currency: 'KRW'
    }
  },
  {
    id: 'emergency-fund',
    name: '비상금',
    nameEn: 'Emergency Fund',
    icon: '💰',
    description: '긴급 상황 대비 예비 자금',
    isRequired: false,
    estimatedRange: {
      min: 500000,
      max: 2000000,
      currency: 'KRW'
    }
  }
];

export const SUPPORTED_COUNTRIES: CountryInfo[] = [
  {
    code: 'australia',
    name: 'Australia',
    nameKo: '호주',
    currency: 'USD', // AUD는 아직 지원하지 않으므로 USD로 대체
    flag: '🇦🇺'
  },
  {
    code: 'canada',
    name: 'Canada',
    nameKo: '캐나다',
    currency: 'USD', // CAD는 아직 지원하지 않으므로 USD로 대체
    flag: '🇨🇦'
  },
  {
    code: 'newzealand',
    name: 'New Zealand',
    nameKo: '뉴질랜드',
    currency: 'USD', // NZD는 아직 지원하지 않으므로 USD로 대체
    flag: '🇳🇿'
  },
  {
    code: 'uk',
    name: 'United Kingdom',
    nameKo: '영국',
    currency: 'USD', // GBP는 아직 지원하지 않으므로 USD로 대체
    flag: '🇬🇧'
  },
  {
    code: 'japan',
    name: 'Japan',
    nameKo: '일본',
    currency: 'JPY',
    flag: '🇯🇵'
  }
];