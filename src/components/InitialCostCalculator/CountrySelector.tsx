import React from 'react';
import type { CountryDestination, CountryInfo } from '../../types/initialCost';

interface CountrySelectorProps {
  selectedCountry: CountryDestination;
  onCountryChange: (country: CountryDestination) => void;
  countries: CountryInfo[];
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountry,
  onCountryChange,
  countries
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🌏</span>
        <h2 className="text-xl font-bold text-gray-900">목적지 선택</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {countries.map(country => (
          <button
            key={country.code}
            onClick={() => onCountryChange(country.code)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedCountry === country.code
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="text-2xl mb-2">{country.flag}</div>
            <div className="text-sm font-medium">{country.nameKo}</div>
            <div className="text-xs text-gray-500">{country.name}</div>
          </button>
        ))}
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-blue-500 mt-0.5">ℹ️</span>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">워킹홀리데이 비용 가이드</p>
            <p>선택하신 국가에 따라 예상 비용 범위가 조정됩니다. 실제 비용은 개인의 생활 패턴과 환율에 따라 달라질 수 있습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountrySelector;