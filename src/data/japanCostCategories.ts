import type { JapanCostCategory, JapanRegionInfo } from '../types/japanCost';

export const JAPAN_COST_CATEGORIES: JapanCostCategory[] = [
  // 필수 비용 - 출국 전 준비
  {
    id: 'airfare',
    name: '항공료',
    nameJp: '航空券',
    icon: '✈️',
    description: '한국-일본 왕복 항공료 (성수기/비수기 고려)',
    descriptionJp: '韓国-日本往復航空券（繁忙期・閑散期考慮）',
    isRequired: true,
    category: 'pre-departure',
    estimatedRange: {
      tokyo: { min: 200000, max: 600000, currency: 'KRW' },
      osaka: { min: 150000, max: 500000, currency: 'KRW' }
    }
  },
  {
    id: 'visa',
    name: '워킹홀리데이 비자',
    nameJp: 'ワーキングホリデービザ',
    icon: '📄',
    description: '일본 워킹홀리데이 비자 신청비 (무료이지만 서류비 포함)',
    descriptionJp: '日本ワーキングホリデービザ申請費（無料だが書類費含む）',
    isRequired: true,
    category: 'pre-departure',
    estimatedRange: {
      tokyo: { min: 50000, max: 100000, currency: 'KRW' },
      osaka: { min: 50000, max: 100000, currency: 'KRW' }
    }
  },
  {
    id: 'insurance',
    name: '여행자보험',
    nameJp: '海外旅行保険',
    icon: '🏥',
    description: '1년간 여행자보험 (국민건강보험 가입 전까지 필요)',
    descriptionJp: '1年間海外旅行保険（国民健康保険加入まで必要）',
    isRequired: true,
    category: 'pre-departure',
    estimatedRange: {
      tokyo: { min: 300000, max: 800000, currency: 'KRW' },
      osaka: { min: 300000, max: 800000, currency: 'KRW' }
    }
  },

  // 필수 비용 - 입국 후 정착
  {
    id: 'initial-accommodation',
    name: '초기 숙박비',
    nameJp: '初期宿泊費',
    icon: '🏠',
    description: '첫 2-4주간 숙박비 (게스트하우스, 호텔, 에어비앤비)',
    descriptionJp: '最初2-4週間宿泊費（ゲストハウス、ホテル、Airbnb）',
    isRequired: true,
    category: 'settlement',
    estimatedRange: {
      tokyo: { min: 100000, max: 300000, currency: 'JPY' },
      osaka: { min: 60000, max: 200000, currency: 'JPY' }
    }
  },
  {
    id: 'residence-card',
    name: '재류카드 발급',
    nameJp: '在留カード発行',
    icon: '🆔',
    description: '공항 또는 입국관리소에서 재류카드 발급 (무료)',
    descriptionJp: '空港または入国管理局で在留カード発行（無料）',
    isRequired: true,
    category: 'settlement',
    estimatedRange: {
      tokyo: { min: 0, max: 10000, currency: 'JPY' },
      osaka: { min: 0, max: 10000, currency: 'JPY' }
    }
  },
  {
    id: 'resident-registration',
    name: '주민등록',
    nameJp: '住民登録',
    icon: '📋',
    description: '거주지 구청/시청에서 주민등록 신고 (무료)',
    descriptionJp: '居住地区役所・市役所で住民登録届出（無料）',
    isRequired: true,
    category: 'settlement',
    estimatedRange: {
      tokyo: { min: 0, max: 5000, currency: 'JPY' },
      osaka: { min: 0, max: 5000, currency: 'JPY' }
    }
  },
  {
    id: 'national-health-insurance',
    name: '국민건강보험',
    nameJp: '国民健康保険',
    icon: '🏥',
    description: '의무 가입 국민건강보험료 (월 2-4만엔, 첫 2개월분)',
    descriptionJp: '義務加入国民健康保険料（月2-4万円、最初2ヶ月分）',
    isRequired: true,
    category: 'settlement',
    estimatedRange: {
      tokyo: { min: 60000, max: 120000, currency: 'JPY' },
      osaka: { min: 40000, max: 80000, currency: 'JPY' }
    }
  },
  {
    id: 'phone-setup',
    name: '휴대폰 개통',
    nameJp: '携帯電話開通',
    icon: '📱',
    description: '현지 휴대폰 개통비 및 첫 달 요금',
    descriptionJp: '現地携帯電話開通費および初月料金',
    isRequired: true,
    category: 'settlement',
    estimatedRange: {
      tokyo: { min: 10000, max: 30000, currency: 'JPY' },
      osaka: { min: 8000, max: 25000, currency: 'JPY' }
    }
  },

  // 선택 비용 - 주거
  {
    id: 'apartment-deposit',
    name: '아파트 보증금',
    nameJp: '敷金・礼金',
    icon: '🏠',
    description: '아파트 임대 시 보증금+사례금 (월세 3-6개월분)',
    descriptionJp: 'アパート賃貸時敷金・礼金（家賃3-6ヶ月分）',
    isRequired: false,
    category: 'housing',
    estimatedRange: {
      tokyo: { min: 300000, max: 800000, currency: 'JPY' },
      osaka: { min: 200000, max: 500000, currency: 'JPY' }
    }
  },
  {
    id: 'furniture',
    name: '가구 및 생활용품',
    nameJp: '家具・生活用品',
    icon: '🛏️',
    description: '침구, 가전제품, 생활필수품 구입비',
    descriptionJp: '寝具、家電製品、生活必需品購入費',
    isRequired: false,
    category: 'housing',
    estimatedRange: {
      tokyo: { min: 50000, max: 200000, currency: 'JPY' },
      osaka: { min: 40000, max: 150000, currency: 'JPY' }
    }
  },
  {
    id: 'bike-purchase',
    name: '자전거 구입',
    nameJp: '自転車購入',
    icon: '🚲',
    description: '일본 생활 필수 자전거 구입 및 등록비',
    descriptionJp: '日本生活必須自転車購入および登録費',
    isRequired: false,
    category: 'transportation',
    estimatedRange: {
      tokyo: { min: 15000, max: 50000, currency: 'JPY' },
      osaka: { min: 10000, max: 40000, currency: 'JPY' }
    }
  },

  // 선택 비용 - 언어 및 교육
  {
    id: 'japanese-school',
    name: '일본어학교',
    nameJp: '日本語学校',
    icon: '📚',
    description: '일본어 실력 향상을 위한 어학원 등록비',
    descriptionJp: '日本語実力向上のための語学院登録費',
    isRequired: false,
    category: 'education',
    estimatedRange: {
      tokyo: { min: 80000, max: 300000, currency: 'JPY' },
      osaka: { min: 60000, max: 250000, currency: 'JPY' }
    }
  },
  {
    id: 'textbooks',
    name: '교재 및 학습용품',
    nameJp: '教材・学習用品',
    icon: '📖',
    description: '일본어 교재, 사전, 학습용품 구입비',
    descriptionJp: '日本語教材、辞書、学習用品購入費',
    isRequired: false,
    category: 'education',
    estimatedRange: {
      tokyo: { min: 10000, max: 30000, currency: 'JPY' },
      osaka: { min: 8000, max: 25000, currency: 'JPY' }
    }
  },

  // 선택 비용 - 기타
  {
    id: 'ic-card',
    name: '교통카드 충전',
    nameJp: 'ICカードチャージ',
    icon: '🚇',
    description: 'Suica/PASMO 등 교통카드 구입 및 충전',
    descriptionJp: 'Suica/PASMO等交通カード購入およびチャージ',
    isRequired: false,
    category: 'transportation',
    estimatedRange: {
      tokyo: { min: 5000, max: 20000, currency: 'JPY' },
      osaka: { min: 3000, max: 15000, currency: 'JPY' }
    }
  },
  {
    id: 'emergency-fund',
    name: '비상금',
    nameJp: '緊急資金',
    icon: '💰',
    description: '긴급 상황 대비 예비 자금',
    descriptionJp: '緊急事態に備えた予備資金',
    isRequired: false,
    category: 'emergency',
    estimatedRange: {
      tokyo: { min: 100000, max: 300000, currency: 'JPY' },
      osaka: { min: 80000, max: 250000, currency: 'JPY' }
    }
  },
  {
    id: 'clothes-winter',
    name: '겨울옷 구입',
    nameJp: '冬服購入',
    icon: '🧥',
    description: '일본 겨울 대비 의류 구입 (계절에 따라 선택)',
    descriptionJp: '日本冬に備えた衣類購入（季節により選択）',
    isRequired: false,
    category: 'lifestyle',
    estimatedRange: {
      tokyo: { min: 30000, max: 100000, currency: 'JPY' },
      osaka: { min: 25000, max: 80000, currency: 'JPY' }
    }
  }
];

export const JAPAN_REGIONS: JapanRegionInfo[] = [
  {
    code: 'tokyo',
    name: 'Tokyo',
    nameKo: '도쿄',
    nameJp: '東京',
    flag: '🗼',
    description: '일본의 수도, 높은 생활비하지만 다양한 일자리 기회',
    descriptionJp: '日本の首都、高い生活費だが多様な仕事の機会',
    currency: 'JPY',
    averageRent: {
      shareHouse: { min: 50000, max: 90000 },
      oneRoom: { min: 80000, max: 150000 }
    },
    averageWage: {
      partTime: { min: 1000, max: 1500 },
      fullTime: { min: 200000, max: 350000 }
    }
  },
  {
    code: 'osaka',
    name: 'Osaka',
    nameKo: '오사카',
    nameJp: '大阪',
    flag: '🏯',
    description: '관서 지역 중심지, 도쿄 대비 저렴한 생활비',
    descriptionJp: '関西地域中心地、東京より安い生活費',
    currency: 'JPY',
    averageRent: {
      shareHouse: { min: 35000, max: 65000 },
      oneRoom: { min: 55000, max: 100000 }
    },
    averageWage: {
      partTime: { min: 900, max: 1300 },
      fullTime: { min: 180000, max: 300000 }
    }
  }
];

// 카테고리별 그룹핑을 위한 상수
export const CATEGORY_GROUPS = {
  'pre-departure': {
    name: '출국 전 준비',
    nameJp: '出国前準備',
    icon: '🛫',
    description: '한국에서 미리 준비해야 할 비용',
    color: 'red'
  },
  'settlement': {
    name: '입국 후 정착',
    nameJp: '入国後定着',
    icon: '🏡',
    description: '일본 도착 후 필수로 처리해야 할 비용',
    color: 'blue'
  },
  'housing': {
    name: '주거',
    nameJp: '住居',
    icon: '🏠',
    description: '장기 거주를 위한 주거 관련 비용',
    color: 'green'
  },
  'transportation': {
    name: '교통',
    nameJp: '交通',
    icon: '🚇',
    description: '교통수단 관련 비용',
    color: 'purple'
  },
  'education': {
    name: '교육',
    nameJp: '教育',
    icon: '📚',
    description: '일본어 학습 관련 비용',
    color: 'indigo'
  },
  'lifestyle': {
    name: '생활',
    nameJp: '生活',
    icon: '🛍️',
    description: '일상생활 관련 비용',
    color: 'pink'
  },
  'emergency': {
    name: '비상',
    nameJp: '緊急',
    icon: '🆘',
    description: '비상 상황 대비 비용',
    color: 'yellow'
  }
} as const;