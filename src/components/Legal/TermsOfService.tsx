import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsOfService: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = (): void => {
    // 히스토리가 있으면 뒤로가기, 없으면 홈으로
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleGoBack}
            className="text-indigo-600 hover:text-indigo-800 mb-4 flex items-center gap-2 transition-colors"
          >
            ← 뒤로 가기
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">서비스 이용약관</h1>
          <p className="text-gray-600">시행일: 2025년 1월 1일</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm p-8 prose prose-indigo max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">제1조 (목적)</h2>
            <p className="text-gray-700 leading-relaxed">
              본 약관은 일본 워킹홀리데이 가계부 서비스(이하 "서비스")의 이용과 관련하여 서비스 제공자와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">제2조 (용어의 정의)</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li><strong>서비스</strong>: 일본 워킹홀리데이를 하는 사람들을 위한 가계부 및 초기비용 계산 웹 애플리케이션</li>
              <li><strong>이용자</strong>: 본 약관에 따라 서비스를 이용하는 개인</li>
              <li><strong>회원</strong>: 서비스에 회원가입을 완료하고 로그인하여 서비스를 이용하는 이용자</li>
              <li><strong>비회원</strong>: 회원가입 없이 임시 모드로 서비스를 이용하는 이용자</li>
              <li><strong>콘텐츠</strong>: 이용자가 서비스에 입력한 거래 내역, 메모 등의 정보</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">제3조 (약관의 효력 및 변경)</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.</li>
              <li>서비스 제공자는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있습니다.</li>
              <li>약관이 변경되는 경우, 서비스 제공자는 변경사항을 시행일자 7일 전부터 공지합니다.</li>
              <li>이용자가 변경된 약관에 동의하지 않는 경우, 서비스 이용을 중단하고 회원 탈퇴를 할 수 있습니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">제4조 (서비스의 제공)</h2>
            <p className="text-gray-700 mb-3">1. 서비스는 다음과 같은 기능을 제공합니다:</p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 mb-4">
              <li>수입 및 지출 내역 관리</li>
              <li>다중 통화 지원 (KRW, USD, JPY)</li>
              <li>실시간 환율 자동 변환</li>
              <li>월별/연도별 통계 및 분석</li>
              <li>캘린더 기반 거래 내역 조회</li>
              <li>워킹홀리데이 초기비용 계산기</li>
              <li>카테고리별 지출 분석</li>
            </ul>
            <p className="text-gray-700 mb-2">2. 서비스는 연중무휴 1일 24시간 제공을 원칙으로 합니다. 단, 다음의 경우 서비스 제공이 일시 중단될 수 있습니다:</p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 mb-4">
              <li>시스템 정기 점검 및 유지보수</li>
              <li>긴급 장애 대응</li>
              <li>기타 불가피한 사유</li>
            </ul>
            <p className="text-gray-700">3. 서비스 제공자는 서비스 중단 시 사전에 공지하는 것을 원칙으로 하나, 긴급한 경우 사후 공지할 수 있습니다.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">제5조 (회원가입)</h2>
            <p className="text-gray-700 mb-3">1. 이용자는 다음의 방법으로 회원가입을 할 수 있습니다:</p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 mb-4">
              <li>이메일 및 비밀번호를 이용한 가입</li>
              <li>Google 계정을 이용한 소셜 로그인</li>
            </ul>
            <p className="text-gray-700 mb-2">2. 회원가입 시 제공하는 정보는 정확하고 최신의 정보여야 합니다.</p>
            <p className="text-gray-700 mb-2">3. 다음의 경우 회원가입이 거부될 수 있습니다:</p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
              <li>타인의 정보를 도용한 경우</li>
              <li>회원가입 신청서의 내용을 허위로 기재한 경우</li>
              <li>기타 회원가입 요건을 충족하지 못한 경우</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">제6조 (비회원 이용)</h2>
            <p className="text-gray-700 mb-2">1. 이용자는 회원가입 없이 임시 모드로 서비스를 이용할 수 있습니다.</p>
            <p className="text-gray-700 mb-2">2. 비회원으로 이용 시 다음의 제한사항이 있습니다:</p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 mb-4">
              <li>입력한 데이터가 서버에 저장되지 않음</li>
              <li>브라우저를 종료하거나 새로고침 시 데이터가 삭제됨</li>
              <li>다른 기기에서 데이터 접근 불가</li>
            </ul>
            <p className="text-gray-700">3. 비회원이 입력한 데이터에 대해 서비스 제공자는 보관 및 복구 책임을 지지 않습니다.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">제7조 (개인정보의 보호)</h2>
            <p className="text-gray-700 mb-2">1. 서비스 제공자는 이용자의 개인정보를 보호하기 위해 노력합니다.</p>
            <p className="text-gray-700">2. 개인정보의 수집, 이용, 제공 등에 관한 사항은 별도의 개인정보 처리방침에 따릅니다.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">제11조 (면책사항)</h2>
            <p className="text-gray-700 mb-2">1. 서비스 제공자는 다음의 경우 책임을 지지 않습니다:</p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 mb-4">
              <li>천재지변 또는 이에 준하는 불가항력으로 서비스를 제공할 수 없는 경우</li>
              <li>이용자의 귀책사유로 인한 서비스 이용 장애</li>
              <li>제3자가 제공하는 환율 API의 정확성 및 가용성</li>
              <li>비회원이 입력한 데이터의 손실</li>
            </ul>
            <p className="text-gray-700 mb-2">2. 서비스 제공자는 이용자가 서비스를 이용하여 얻은 정보의 정확성, 완전성에 대해 보증하지 않습니다.</p>
            <p className="text-gray-700">3. 서비스에서 제공하는 환율 정보는 참고용이며, 실제 환율과 차이가 있을 수 있습니다.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">제12조 (분쟁의 해결)</h2>
            <p className="text-gray-700 mb-2">1. 서비스 이용과 관련하여 분쟁이 발생한 경우, 서비스 제공자와 이용자는 성실히 협의하여 해결하도록 노력합니다.</p>
            <p className="text-gray-700 mb-2">2. 본 약관에 명시되지 않은 사항은 관련 법령 및 상관례에 따릅니다.</p>
            <p className="text-gray-700">3. 서비스 이용으로 발생한 분쟁의 관할법원은 대한민국 법원으로 합니다.</p>
          </section>

          <section className="mb-8 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-2">부칙</h2>
            <p className="text-gray-700">본 약관은 2025년 1월 1일부터 시행됩니다.</p>
          </section>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>문의:</strong> 서비스 관련 문의사항은 GitHub Issues를 통해 접수하실 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
