/**
 * Store Location Section - Kakao Maps Integration
 * 카카오 지도를 사용한 매장 위치 표시
 */

// 도트라인 매장 정보
const STORE_INFO = {
  name: '도트라인',
  address: '경기도 시흥시 광석천길 18 B115호',
  lat: 37.3776829864953,
  lng: 126.812768326784,
  phone: '010-5853-7033'
};

/**
 * 카카오 지도 초기화 함수
 */
function initKakaoMap() {
  const container = document.getElementById('kakao-map');

  if (!container) {
    console.error('카카오 지도 컨테이너를 찾을 수 없습니다.');
    return;
  }

  // 카카오 지도 API가 로드되었는지 확인
  if (typeof kakao === 'undefined' || typeof kakao.maps === 'undefined') {
    console.error('카카오 지도 API가 로드되지 않았습니다.');
    return;
  }

  // kakao.maps.load를 사용하여 API가 완전히 로드된 후 실행
  kakao.maps.load(() => {
    // 지도 옵션 설정
    const options = {
      center: new kakao.maps.LatLng(STORE_INFO.lat, STORE_INFO.lng),
      level: 3 // 확대 레벨 (1-14, 숫자가 작을수록 더 확대됨)
    };

    // 지도 생성
    const map = new kakao.maps.Map(container, options);

    // 마커 위치 설정
    const markerPosition = new kakao.maps.LatLng(STORE_INFO.lat, STORE_INFO.lng);

    // 마커 생성
    const marker = new kakao.maps.Marker({
      position: markerPosition,
      map: map
    });

    // 인포윈도우 내용 설정
    const infowindowContent = `
      <div style="padding: 10px; min-width: 150px; text-align: center;">
        <strong style="font-size: 14px;">${STORE_INFO.name}</strong><br>
        <span style="font-size: 12px; color: #666;">${STORE_INFO.address}</span>
      </div>
    `;

    // 인포윈도우 생성
    const infowindow = new kakao.maps.InfoWindow({
      content: infowindowContent,
      removable: false
    });

    // 마커에 인포윈도우 표시
    infowindow.open(map, marker);
  });
}

// 카카오 지도 스크립트 로드 후 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // 약간의 지연을 두고 초기화 (DOM이 완전히 로드될 때까지 대기)
    setTimeout(initKakaoMap, 500);
  });
} else {
  setTimeout(initKakaoMap, 500);
}

// 외부에서 사용할 수 있도록 export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    STORE_INFO,
    initKakaoMap
  };
}