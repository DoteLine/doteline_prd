// 솔루션 섹션 렌더링 - Scroll-driven Card Stack Animation
function renderSolutions() {
  const solutionsContainer = document.getElementById('solutions-container');
  if (!solutionsContainer) return;

  // 1~4번 솔루션 가져오기 (SolutionData.js에서 전역 함수 사용)
  const solutions = [1, 2, 3, 4].map(id => ({
    id,
    ...window.findSolutionById(id)
  }));

  // 전체 래퍼 생성
  const solutionsHTML = `
    <section id="solutions" class="solutions-stack-wrapper">
      <div class="solutions-header">
        <h2 class="solutions-main-title">Explore Dotline's solution</h2>
        <p class="solutions-main-description">다양한 산업 분야에 최적화된 도트라인의 LED 솔루션을 만나보세요. 옥외광고판, 렌탈 이벤트, 상업 소매, 회의실 등 고객의 니즈에 맞춘 맞춤형 디스플레이 솔루션을 제공합니다.</p>
      </div>
      <div class="solutions-stack-container">
        ${solutions.map((solution, index) => `
          <div class="solution-card-stack" data-index="${index}" style="--index: ${index};">
            <div class="solution-card-stack__inner">
              <div class="solution-card-stack__image">
                <img src="${solution.thumbnail}" alt="${solution.headline}" loading="lazy">
              </div>
              <div class="solution-card-stack__content">
                <span class="solution-card-stack__label">${solution.label}</span>
                <h2 class="solution-card-stack__title">${solution.headline}</h2>
                <p class="solution-card-stack__description">${solution.description}</p>
                <a href="/src/pages/Solutions/SolutionDetail.html?id=${solution.id}" class="solution-card-stack__cta">
                  <span>자세히 보기</span>
                </a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;

  solutionsContainer.innerHTML = solutionsHTML;
}

// 스크롤 애니메이션 초기화
function initScrollAnimation() {
  const observerOptions = {
    threshold: 0.15,
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

  // 솔루션 섹션 애니메이션 (별도 관찰자)
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

// 앵커 링크 부드러운 스크롤 (메인 페이지)
function initSmoothScroll() {
  const mainPageLinks = document.querySelectorAll(
    '.hero-buttons a[href^="#"], .header-menu a[href^="#"]'
  );

  mainPageLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = 80;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// FAQ 초기화 함수
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length === 0) {
        console.warn('FAQ items not found');
        return;
    }

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (!question || !answer) {
            console.warn('FAQ question or answer not found', item);
            return;
        }

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // 한 번에 하나만 열리도록 하려면 아래 주석 해제 (One-open policy)
            /*
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = null;
                    }
                }
            });
            */

            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = null;
            } else {
                item.classList.add('active');
                // scrollHeight를 이용해 실제 컨텐츠 높이만큼 확장
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
}

// 기능 초기화 함수를 별도로 분리
async function setupMainPage() {
    // StoreSection 컴포넌트 로드
    await loadComponent('StoreSection', 'storeLocation-container');

    // 솔루션 섹션 먼저 렌더링
    renderSolutions();

    // 렌더링 완료 후 애니메이션 및 기타 기능 초기화
    setTimeout(() => {
        initScrollAnimation();
        initSmoothScroll();
        initFAQ();
    }, 100);
}

// DOM이 준비되면 실행
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMainPage);
} else {
    // DOM이 이미 준비된 경우 즉시 실행
    setupMainPage();
}
