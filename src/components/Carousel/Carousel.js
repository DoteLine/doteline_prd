/**
 * Carousel Component Script
 * Swiper.js를 사용한 이미지 캐러셀 초기화
 * 4개 슬라이드 표시 (가운데 2개 진하게, 양쪽 2개 투명하게)
 * 원형 루프 최적화
 */

/**
 * 캐러셀 초기화
 */
function initCarousel() {
  // Swiper 인스턴스 생성
  const carousel = new Swiper('.carousel-swiper', {
    // 기본 설정 - 4개 표시
    slidesPerView: 4,
    spaceBetween: 30,
    centeredSlides: true, // 중앙 정렬
    loop: true, // 무한 루프
    loopedSlides: 8, // 루프용 복제 슬라이드 개수 (전체 슬라이드 개수와 동일하게)

    // 슬라이드 진행 상태 추적
    watchSlidesProgress: true,

    // 클릭한 슬라이드로 이동
    slideToClickedSlide: false,

    // 자동 재생
    autoplay: {
      delay: 3500, // 3.5초마다 자동 전환
      disableOnInteraction: false, // 사용자 조작 후에도 자동 재생 유지
      pauseOnMouseEnter: true, // 마우스 오버 시 일시정지
    },

    // 속도 및 효과
    speed: 600, // 전환 속도 (밀리초) - 부드러운 전환을 위해 줄임
    effect: 'slide', // 슬라이드 효과

    // 네비게이션 버튼
    navigation: {
      nextEl: '.carousel-button-next',
      prevEl: '.carousel-button-prev',
    },

    // 페이지네이션
    pagination: {
      el: '.carousel-pagination',
      clickable: true, // 클릭 가능
      dynamicBullets: true, // 동적 불릿
      dynamicMainBullets: 3, // 메인 불릿 개수
    },

    // 반응형 브레이크포인트
    breakpoints: {
      // 320px 이상 (모바일) - 1개 크게 + 양쪽 살짝
      320: {
        slidesPerView: 1.2,
        spaceBetween: 12,
        centeredSlides: true,
      },
      // 640px 이상 (태블릿) - 3개 표시
      640: {
        slidesPerView: 3,
        spaceBetween: 20,
        centeredSlides: true,
      },
      // 1024px 이상 (데스크톱) - 4개 표시
      1024: {
        slidesPerView: 4,
        spaceBetween: 30,
        centeredSlides: true,
      },
    },

    // 접근성
    a11y: {
      enabled: true,
      prevSlideMessage: '이전 슬라이드',
      nextSlideMessage: '다음 슬라이드',
    },

    // 키보드 제어
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },

    // 마우스 휠 제어
    mousewheel: {
      enabled: false,
    },

    // 터치 제스처
    touchRatio: 1,
    touchAngle: 45,
    simulateTouch: true,
    grabCursor: true, // 마우스 커서를 grab으로 변경

    // 슬라이드 변경 이벤트
    on: {
      // 초기화 완료
      init: function() {
        },

      // 슬라이드 변경 시작
      slideChangeTransitionStart: function() {
        // 슬라이드 전환 시작
      },

      // 터치 시작
      touchStart: function() {
        this.autoplay.stop();
      },

      // 터치 종료
      touchEnd: function() {
        setTimeout(() => {
          this.autoplay.start();
        }, 2000); // 2초 후 자동재생 재개
      },
    },
  });

  // 캐러셀 인스턴스를 전역으로 저장 (디버깅용)
  window.carouselInstance = carousel;

  return carousel;
}

/**
 * 이미지 프리로딩
 * 이미지를 미리 로드하여 부드러운 전환 보장
 */
function preloadCarouselImages() {
  const images = document.querySelectorAll('.carousel-image');

  images.forEach(img => {
    // 이미지가 로드되지 않은 경우
    if (!img.complete) {
      // 로딩 인디케이터 표시
      const wrapper = img.closest('.carousel-slide-content');
      if (wrapper) {
        wrapper.classList.add('loading');
      }

      // 이미지 로드 완료 이벤트
      img.addEventListener('load', function() {
        if (wrapper) {
          wrapper.classList.remove('loading');
          wrapper.classList.add('loaded');
        }
      });

      // 이미지 로드 에러 이벤트
      img.addEventListener('error', function() {
        console.error('이미지 로드 실패:', this.src);
        if (wrapper) {
          wrapper.classList.remove('loading');
          wrapper.classList.add('error');
        }
      });
    }
  });
}

/**
 * 페이지 초기화
 */
function initCarouselPage() {
  // Swiper 라이브러리가 로드되었는지 확인
  if (typeof Swiper === 'undefined') {
    console.error('Swiper 라이브러리가 로드되지 않았습니다. HTML에 Swiper CDN을 추가해주세요.');
    return;
  }

  // 캐러셀 초기화
  const carousel = initCarousel();

  // 이미지 프리로딩
  preloadCarouselImages();
}

// 페이지 로드 완료 후 실행
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCarouselPage);
} else {
  initCarouselPage();
}

// 외부에서 사용할 수 있도록 export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initCarousel,
    preloadCarouselImages,
  };
}