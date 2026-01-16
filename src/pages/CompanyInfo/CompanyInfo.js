/**
 * Company Info Page Script
 * 회사 소개 페이지 관련 JavaScript
 * 스크롤 애니메이션 처리
 */

/**
 * 스크롤 애니메이션 초기화
 */
function initScrollAnimation() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // .section-animate 클래스를 가진 모든 섹션을 관찰
    const sections = document.querySelectorAll('.section-animate');
    sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * 이미지 로딩 처리
 */
function handleImageLoading() {
    const images = document.querySelectorAll('.company-image');

    images.forEach((img, index) => {
        const wrapper = img.parentElement;

        // 모든 이미지에 대해 로딩 상태 추가 (캐시된 경우에도 표시)
        wrapper.classList.add('loading');

        // 로딩 스피너 표시
        Loading.show(wrapper, {
            text: 'DoteLine'
        });

        // 이미지가 이미 로드된 경우 (캐시)
        if (img.complete && img.naturalHeight !== 0) {
            // 짧은 지연 후 로딩 제거 (애니메이션을 볼 수 있도록)
            setTimeout(() => {
                wrapper.classList.remove('loading');
                wrapper.classList.add('loaded');
                Loading.hide(wrapper);
            }, 500 + index * 100); // 순차적으로 제거
        } else {
            // 이미지 로드 완료 시
            img.addEventListener('load', function() {
                wrapper.classList.remove('loading');
                wrapper.classList.add('loaded');
                Loading.hide(wrapper);
            });
        }

        // 이미지 로드 에러 시
        img.addEventListener('error', function() {
            console.error(`이미지 로드 실패: ${this.src}`);
            wrapper.classList.remove('loading');
            Loading.hide(wrapper);

            this.parentElement.style.backgroundColor = '#f1f5f9';
            this.style.display = 'none';

            // 에러 메시지 표시
            const errorMsg = document.createElement('div');
            errorMsg.style.cssText = 'padding: 2rem; text-align: center; color: #64748b;';
            errorMsg.textContent = '이미지를 불러올 수 없습니다.';
            this.parentElement.appendChild(errorMsg);
        });
    });
}

/**
 * 페이지 초기화
 */
function initPage() {
    initScrollAnimation();
    handleImageLoading();
    console.log('Company Info page loaded successfully');
}

// 페이지 로드 완료 후 실행
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    initPage();
}