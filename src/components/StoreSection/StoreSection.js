/**
 * Store Location Section - Kakao Maps Integration
 */

// 전역 객체에 할당하여 중복 선언 에러 방지
window.STORE_INFO = {
  name: '도트라인',
  address: '경기도 시흥시 광석천길 18 B115호',
  lat: 37.3776829864953,
  lng: 126.812768326784,
  phone: '010-5853-7033'
};

/**
 * 카카오 지도 초기화 함수
 */
window.initKakaoMap = function() {
  const container = document.getElementById('kakao-map');

  if (!container) return;

  if (typeof kakao === 'undefined' || typeof kakao.maps === 'undefined') {
    console.warn('카카오 지도 API 로드 대기 중...');
    return;
  }

  kakao.maps.load(() => {
    const options = {
      center: new kakao.maps.LatLng(window.STORE_INFO.lat, window.STORE_INFO.lng),
      level: 3
    };

    const map = new kakao.maps.Map(container, options);
    const markerPosition = new kakao.maps.LatLng(window.STORE_INFO.lat, window.STORE_INFO.lng);

    const marker = new kakao.maps.Marker({
      position: markerPosition,
      map: map
    });

    const infowindowContent = `
      <div style="padding: 10px; min-width: 150px; text-align: center;">
        <strong style="font-size: 14px;">${window.STORE_INFO.name}</strong><br>
        <span style="font-size: 12px; color: #666;">${window.STORE_INFO.address}</span>
      </div>
    `;

    const infowindow = new kakao.maps.InfoWindow({
      content: infowindowContent,
      removable: false
    });

    infowindow.open(map, marker);
  });
};

// 초기화 로직
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(window.initKakaoMap, 500);
  });
} else {
  setTimeout(window.initKakaoMap, 500);
}