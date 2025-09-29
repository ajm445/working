import React from 'react';
import type { JapanRegion, JapanRegionInfo } from '../../types/japanCost';

interface JapanRegionSelectorProps {
  selectedRegion: JapanRegion;
  onRegionChange: (region: JapanRegion) => void;
  regions: JapanRegionInfo[];
}

const JapanRegionSelector: React.FC<JapanRegionSelectorProps> = ({
  selectedRegion,
  onRegionChange,
  regions
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🇯🇵</span>
        <h2 className="text-xl font-bold text-gray-900">일본 지역 선택</h2>
        <span className="text-sm text-gray-500">地域選択</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {regions.map(region => (
          <button
            key={region.code}
            onClick={() => onRegionChange(region.code)}
            className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
              selectedRegion === region.code
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">{region.flag}</div>
              <div>
                <div className="text-lg font-bold">{region.nameKo}</div>
                <div className="text-sm text-gray-500">{region.nameJp}</div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-3">{region.description}</p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-blue-50 p-2 rounded">
                <div className="font-medium text-blue-800">쉐어하우스</div>
                <div className="text-blue-600">
                  ¥{region.averageRent.shareHouse.min.toLocaleString()}-{region.averageRent.shareHouse.max.toLocaleString()}
                </div>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <div className="font-medium text-green-800">원룸</div>
                <div className="text-green-600">
                  ¥{region.averageRent.oneRoom.min.toLocaleString()}-{region.averageRent.oneRoom.max.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mt-2 text-xs text-gray-500">
              시급: ¥{region.averageWage.partTime.min}-{region.averageWage.partTime.max} |
              월급: ¥{region.averageWage.fullTime.min.toLocaleString()}-{region.averageWage.fullTime.max.toLocaleString()}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 p-4 bg-orange-50 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-orange-500 mt-0.5">💡</span>
          <div className="text-sm text-orange-800">
            <p className="font-medium mb-1">지역별 생활비 가이드</p>
            <p>도쿄는 높은 생활비와 다양한 일자리, 오사카는 상대적으로 저렴한 생활비와 관서 지역의 독특한 문화를 경험할 수 있습니다. 선택하신 지역에 따라 초기비용이 자동으로 조정됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JapanRegionSelector;