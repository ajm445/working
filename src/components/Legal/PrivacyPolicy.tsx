import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">개인정보 처리방침</h1>
          <p className="text-gray-600">시행일: 2025년 1월 1일</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm p-8 prose prose-indigo max-w-none">
          <div className="mb-8 p-4 bg-indigo-50 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              일본 워킹홀리데이 가계부(이하 "서비스")는 이용자의 개인정보를 매우 중요하게 생각하며, 「개인정보 보호법」 및 관련 법령을 준수하고 있습니다.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. 수집하는 개인정보 항목</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">1.1 회원가입 시 수집 정보</h3>

            <h4 className="text-lg font-medium text-gray-800 mb-2">이메일/비밀번호 가입</h4>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 mb-4">
              <li><strong>필수 항목</strong>: 이메일 주소, 비밀번호</li>
              <li><strong>선택 항목</strong>: 사용자 이름(닉네임), 프로필 사진</li>
            </ul>

            <h4 className="text-lg font-medium text-gray-800 mb-2">소셜 로그인 (Google)</h4>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 mb-4">
              <li><strong>수집 항목</strong>: 이메일 주소, 프로필 사진, 이름</li>
              <li><strong>제공자</strong>: Google Inc.</li>
              <li><strong>수집 방법</strong>: OAuth 2.0 프로토콜을 통한 자동 수집</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">1.2 서비스 이용 중 수집 정보</h3>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 mb-4">
              <li><strong>거래 내역</strong>: 수입/지출 금액, 카테고리, 설명, 날짜, 통화 종류</li>
              <li><strong>환율 설정</strong>: 선택한 통화 및 환율 정보</li>
              <li><strong>서비스 이용 기록</strong>: 접속 로그, 이용 시간, IP 주소</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">1.3 비회원 이용자</h3>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
              <li><strong>수집 정보</strong>: 없음 (모든 데이터는 브라우저 로컬에만 저장)</li>
              <li><strong>서버 저장</strong>: 비회원 데이터는 서버에 저장되지 않음</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 개인정보의 수집 및 이용 목적</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 서비스 제공</h3>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 mb-4">
              <li>회원 식별 및 인증</li>
              <li>거래 내역 저장 및 조회</li>
              <li>통계 및 분석 정보 제공</li>
              <li>다중 기기 간 데이터 동기화</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 서비스 개선</h3>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 mb-4">
              <li>서비스 이용 통계 분석</li>
              <li>신규 서비스 개발 및 기존 서비스 개선</li>
              <li>이용자 맞춤형 기능 제공</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 고객 지원</h3>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
              <li>문의사항 및 불만 처리</li>
              <li>공지사항 전달</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. 개인정보의 보유 및 이용 기간</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 회원 정보</h3>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 mb-4">
              <li><strong>보유 기간</strong>: 회원 탈퇴 시까지</li>
              <li><strong>탈퇴 후</strong>: 즉시 삭제 (단, 관련 법령에 따라 보관이 필요한 경우 예외)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 법령에 따른 보관</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div>
                <p className="font-medium text-gray-800">계약 또는 청약철회 등에 관한 기록</p>
                <p className="text-sm text-gray-600">보존 이유: 전자상거래 등에서의 소비자보호에 관한 법률</p>
                <p className="text-sm text-gray-600">보존 기간: 5년</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">소비자의 불만 또는 분쟁처리에 관한 기록</p>
                <p className="text-sm text-gray-600">보존 이유: 전자상거래 등에서의 소비자보호에 관한 법률</p>
                <p className="text-sm text-gray-600">보존 기간: 3년</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">웹사이트 방문 기록</p>
                <p className="text-sm text-gray-600">보존 이유: 통신비밀보호법</p>
                <p className="text-sm text-gray-600">보존 기간: 3개월</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. 개인정보 처리 위탁</h2>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Supabase (데이터베이스 및 인증)</h3>
              <ul className="list-disc list-inside ml-4 space-y-1 text-sm text-gray-700">
                <li><strong>위탁 업체</strong>: Supabase Inc.</li>
                <li><strong>위탁 업무</strong>: 데이터베이스 호스팅, 사용자 인증, 데이터 저장</li>
                <li><strong>개인정보 보관 위치</strong>: 미국 (AWS 서버)</li>
                <li><strong>보유 및 이용 기간</strong>: 회원 탈퇴 시 또는 위탁 계약 종료 시까지</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">환율 정보 제공 (ExchangeRate-API)</h3>
              <ul className="list-disc list-inside ml-4 space-y-1 text-sm text-gray-700">
                <li><strong>위탁 업체</strong>: ExchangeRate-API</li>
                <li><strong>위탁 업무</strong>: 실시간 환율 정보 제공</li>
                <li><strong>수집 정보</strong>: 없음 (API 호출만 수행)</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. 이용자의 권리와 행사 방법</h2>
            <p className="text-gray-700 mb-4">이용자는 언제든지 다음의 권리를 행사할 수 있습니다:</p>

            <ul className="list-disc list-inside ml-4 space-y-2 text-gray-700 mb-4">
              <li><strong>개인정보 열람 요구권</strong>: 서비스 내 설정 페이지에서 본인의 정보를 확인할 수 있습니다.</li>
              <li><strong>개인정보 정정 요구권</strong>: 잘못된 정보는 서비스 내에서 직접 수정할 수 있습니다.</li>
              <li><strong>개인정보 삭제 요구권</strong>: 회원 탈퇴를 통해 개인정보 삭제를 요청할 수 있습니다.</li>
              <li><strong>개인정보 처리 정지 요구권</strong>: 개인정보 처리의 정지를 요구할 수 있습니다.</li>
            </ul>

            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">권리 행사 방법</h3>
              <ul className="list-disc list-inside ml-4 space-y-1 text-sm text-gray-700">
                <li>서비스 내 설정 페이지 이용</li>
                <li>GitHub Issues를 통한 요청</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. 개인정보의 안전성 확보 조치</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">8.1 관리적 조치</h3>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 mb-4">
              <li>개인정보 취급 직원의 최소화 및 교육</li>
              <li>개인정보 보호 관련 내부 관리 계획 수립 및 시행</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">8.2 기술적 조치</h3>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 mb-4">
              <li>비밀번호 암호화 저장 (bcrypt 해싱)</li>
              <li>HTTPS를 통한 안전한 데이터 전송</li>
              <li>데이터베이스 접근 권한 관리</li>
              <li>Supabase Row Level Security (RLS) 정책 적용</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">8.3 물리적 조치</h3>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
              <li>데이터베이스는 Supabase의 보안 데이터센터에 저장</li>
              <li>접근 통제 시스템 운영</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. 개인정보 보호책임자</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-4">
                서비스는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의 불만처리 및 피해구제를 위하여 개인정보 보호책임자를 지정하고 있습니다.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>문의 방법</strong>: GitHub Issues
              </p>
              <p className="text-sm text-gray-600">
                개인정보 침해에 대한 신고나 상담이 필요한 경우 아래 기관에 문의하실 수 있습니다:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-sm text-gray-600 mt-2">
                <li>개인정보 침해신고센터: (국번없이) 118</li>
                <li>대검찰청 사이버수사과: (국번없이) 1301</li>
                <li>경찰청 사이버안전국: (국번없이) 182</li>
              </ul>
            </div>
          </section>

          <section className="mb-8 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-2">부칙</h2>
            <p className="text-gray-700 mb-2"><strong>시행일</strong>: 본 개인정보 처리방침은 2025년 1월 1일부터 시행됩니다.</p>
            <p className="text-gray-700"><strong>최종 수정일</strong>: 2025년 1월 1일</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
