/**
 * Solutions Main Page JavaScript
 * Handles navigation to detail pages and scroll animations
 */

// Navigate to detail page
function goToDetail(solutionId) {
    // URL 파라미터로 solution ID 전달
    window.location.href = `/src/pages/Solutions/SolutionDetail.html?id=${solutionId}`;
}

// Make goToDetail available globally
window.goToDetail = goToDetail;

// 솔루션 섹션 HTML 생성
function createSolutionSection(solution, index) {
    // 홀수 번호: text-left (텍스트 왼쪽, 이미지 오른쪽)
    // 짝수 번호: image-left (이미지 왼쪽, 텍스트 오른쪽)
    const variant = index % 2 === 0 ? 'text-left' : 'image-left';

    if (variant === 'text-left') {
        return `
            <section class="solution-section" data-variant="text-left">
                <div class="solution-section__container">
                    <div class="solution-section__content">
                        <span class="solution-section__label">${solution.label}</span>
                        <h2 class="solution-section__headline">${solution.headline}</h2>
                        <p class="solution-section__description">
                            ${solution.description}
                        </p>
                        <button class="solution-section__cta" onclick="goToDetail(${solution.id})">자세히 보기</button>
                    </div>
                    <div class="solution-section__image image-wrapper">
                        <img src="${solution.thumbnail}" alt="${solution.headline}" loading="lazy">
                    </div>
                </div>
            </section>
        `;
    } else {
        return `
            <section class="solution-section" data-variant="image-left">
                <div class="solution-section__container">
                    <div class="solution-section__image image-wrapper">
                        <img src="${solution.thumbnail}" alt="${solution.headline}" loading="lazy">
                    </div>
                    <div class="solution-section__content">
                        <span class="solution-section__label">${solution.label}</span>
                        <h2 class="solution-section__headline">${solution.headline}</h2>
                        <p class="solution-section__description">
                            ${solution.description}
                        </p>
                        <button class="solution-section__cta" onclick="goToDetail(${solution.id})">자세히 보기</button>
                    </div>
                </div>
            </section>
        `;
    }
}

// 솔루션 목록 렌더링
function renderSolutions() {
    const solutionsMain = document.querySelector('.solutions-main');
    if (!solutionsMain) return;

    const solutions = window.getAllSolutions();

    // 솔루션 섹션 HTML 생성
    const solutionSectionsHTML = solutions.map((solution, index) =>
        createSolutionSection(solution, index)
    ).join('');

    // Hero 섹션 뒤에 솔루션 섹션들 추가
    const heroSection = solutionsMain.querySelector('.solutions-hero');
    if (heroSection) {
        heroSection.insertAdjacentHTML('afterend', solutionSectionsHTML);
    }
}

/**
 * 이미지 로딩 처리
 */
function handleImageLoading() {
    const images = document.querySelectorAll('.solution-image');

    images.forEach((img, index) => {
        const wrapper = img.parentElement;

        // 모든 이미지에 대해 로딩 상태 추가
        wrapper.classList.add('loading');

        // 로딩 스피너 표시
        Loading.show(wrapper);

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

// 스크롤 애니메이션 초기화
function initSolutionScrollAnimation() {
    // 솔루션 섹션 애니메이션
    const solutionObserverOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const solutionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 한 번만 애니메이션 실행
                entry.target.classList.add('animate-in');
                // 애니메이션 완료 후 관찰 중지
                solutionObserver.unobserve(entry.target);
            }
        });
    }, solutionObserverOptions);

    // .solution-section 클래스를 가진 모든 섹션을 관찰
    const solutionSections = document.querySelectorAll('.solution-section');
    solutionSections.forEach(section => {
        solutionObserver.observe(section);
    });
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 솔루션 목록 렌더링
    renderSolutions();

    // 이미지 로딩 처리
    handleImageLoading();

    // 애니메이션 초기화
    initSolutionScrollAnimation();
});