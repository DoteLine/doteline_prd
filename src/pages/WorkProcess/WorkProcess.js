/**
 * Work Process Page Script
 * 작업 과정 페이지 관련 JavaScript
 * 바운스 애니메이션 + 스크롤 애니메이션 + 이미지 로딩 처리
 */

/**
 * 바운스 애니메이션 초기화
 * Hero 타이틀 텍스트를 글자 단위로 span 래핑하여 stagger delay 바운스 적용
 */
function initBounceAnimation() {
    const titleEl = document.getElementById('bounceTitle');
    if (!titleEl) return;

    const text = titleEl.textContent;
    titleEl.textContent = '';

    let charIndex = 0;
    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        if (text[i] === ' ') {
            span.innerHTML = '&nbsp;';
            span.className = 'bounce-letter';
            span.style.animationDelay = `${0.4 + charIndex * 0.05}s`;
            charIndex++;
        } else {
            span.textContent = text[i];
            span.className = 'bounce-letter';
            span.style.animationDelay = `${0.4 + charIndex * 0.05}s`;
            charIndex++;
        }
        titleEl.appendChild(span);
    }
}

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

    const sections = document.querySelectorAll('.section-animate');
    sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * 이미지 로딩 처리
 */
function handleImageLoading() {
    const images = document.querySelectorAll('.step-image');

    images.forEach((img, index) => {
        const wrapper = img.parentElement;

        wrapper.classList.add('loading');

        Loading.show(wrapper, {
            text: 'DoteLine'
        });

        if (img.complete && img.naturalHeight !== 0) {
            setTimeout(() => {
                wrapper.classList.remove('loading');
                wrapper.classList.add('loaded');
                Loading.hide(wrapper);
            }, 500 + index * 100);
        } else {
            img.addEventListener('load', function() {
                wrapper.classList.remove('loading');
                wrapper.classList.add('loaded');
                Loading.hide(wrapper);
            });
        }

        img.addEventListener('error', function() {
            console.error(`이미지 로드 실패: ${this.src}`);
            wrapper.classList.remove('loading');
            Loading.hide(wrapper);

            this.parentElement.style.backgroundColor = '#f1f5f9';
            this.style.display = 'none';

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
    initBounceAnimation();
    initScrollAnimation();
    handleImageLoading();
}

// 페이지 로드 완료 후 실행
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    initPage();
}
