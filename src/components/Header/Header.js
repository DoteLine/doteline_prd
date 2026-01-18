/**
 * Header Component JavaScript
 * - 모바일 메뉴 토글 기능
 * - 솔루션 드롭다운 동적 생성
 */

/**
 * 파비콘 동적 추가
 */
function initFavicon() {
    if (document.querySelector('link[rel="icon"]')) return;
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = '/resources/icon/favicon.ico?v=1';
    document.head.appendChild(favicon);
}

initFavicon();

/**
 * Header 초기화 실행기
 */
function initHeader() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (!mobileMenuBtn || !mobileMenu) {
        return false;
    }

    const newMobileMenuBtn = mobileMenuBtn.cloneNode(true);
    mobileMenuBtn.parentNode.replaceChild(newMobileMenuBtn, mobileMenuBtn);

    newMobileMenuBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('active');
        if (isOpen) {
            mobileMenu.classList.remove('active');
            newMobileMenuBtn.classList.remove('active');
        } else {
            mobileMenu.classList.add('active');
            newMobileMenuBtn.classList.add('active');
        }
    });

    const mobileMenuLinks = mobileMenu.querySelectorAll('.menu-link:not(.mobile-dropdown-trigger)');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            newMobileMenuBtn.classList.remove('active');
        });
    });

    initSolutionsDropdown();
    initMobileSolutionsDropdown();
    initContactForm();
    initMobileProductsDropdown();

    return true;
}

/**
 * 솔루션 드롭다운 (Desktop)
 */
function initSolutionsDropdown() {
    const dropdownMenu = document.getElementById('solutionsDropdown');
    if (!dropdownMenu) return;

    if (typeof window.getAllSolutions !== 'function') {
        setTimeout(initSolutionsDropdown, 100);
        return;
    }

    const solutions = window.getAllSolutions();
    const dropdownHTML = solutions.map((solution, index) => {
        const divider = (index === 4) ? '<div class="dropdown-divider"></div>' : '';
        return `
      ${divider}
      <a href="/src/pages/Solutions/SolutionDetail.html?id=${solution.id}" class="dropdown-item">
        <span class="dropdown-item-label">${solution.label}</span>
        <span class="dropdown-item-title">${solution.headline}</span>
      </a>
    `;
    }).join('');

    dropdownMenu.innerHTML = dropdownHTML;
}

/**
 * 모바일 솔루션 드롭다운
 */
function initMobileSolutionsDropdown() {
    const mobileDropdownTrigger = document.getElementById('mobileSolutionsTrigger');
    const mobileDropdownMenu = document.getElementById('mobileSolutionsDropdown');

    if (!mobileDropdownTrigger || !mobileDropdownMenu) return;

    if (typeof window.getAllSolutions !== 'function') {
        setTimeout(initMobileSolutionsDropdown, 100);
        return;
    }

    const solutions = window.getAllSolutions();
    const mobileDropdownHTML = solutions.map(solution => `
    <li>
      <a href="/src/pages/Solutions/SolutionDetail.html?id=${solution.id}" class="mobile-dropdown-item">
        <span class="mobile-dropdown-item-label">${solution.label}</span>
        <span class="mobile-dropdown-item-title">${solution.headline}</span>
      </a>
    </li>
  `).join('');

    mobileDropdownMenu.innerHTML = mobileDropdownHTML;

    mobileDropdownTrigger.addEventListener('click', (e) => {
        const target = e.target;
        const clickedOnText = target.classList.contains('mobile-dropdown-text');

        if (clickedOnText) {
            const mobileMenu = document.getElementById('mobileMenu');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            if (mobileMenu && mobileMenuBtn) {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        } else {
            e.preventDefault();
            e.stopPropagation();
            const isOpen = mobileDropdownMenu.classList.contains('active');
            if (isOpen) {
                mobileDropdownMenu.classList.remove('active');
                mobileDropdownTrigger.classList.remove('active');
            } else {
                mobileDropdownMenu.classList.add('active');
                mobileDropdownTrigger.classList.add('active');
            }
        }
    });
}

/**
 * 모바일 제품 드롭다운
 */
function initMobileProductsDropdown() {
    const mobileDropdownTrigger = document.getElementById('mobileProductsTrigger');
    const mobileDropdownMenu = document.getElementById('mobileProductsDropdown');

    if (!mobileDropdownTrigger || !mobileDropdownMenu) return;

    mobileDropdownTrigger.addEventListener('click', (e) => {
        const target = e.target;
        const clickedOnText = target.classList.contains('mobile-dropdown-text');

        if (clickedOnText) {
            const mobileMenu = document.getElementById('mobileMenu');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            if (mobileMenu && mobileMenuBtn) {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        } else {
            e.preventDefault();
            e.stopPropagation();
            const isOpen = mobileDropdownMenu.classList.contains('active');
            if (isOpen) {
                mobileDropdownMenu.classList.remove('active');
                mobileDropdownTrigger.classList.remove('active');
            } else {
                mobileDropdownMenu.classList.add('active');
                mobileDropdownTrigger.classList.add('active');
            }
        }
    });
}

/**
 * 문의하기 폼 초기화
 */
function initContactForm() {
    const contactBadgeBtn = document.getElementById('contactBadgeBtn');
    const mobileContactBtn = document.getElementById('mobileContactBtn');
    const contactDropdown = document.getElementById('contactDropdown');
    const contactDropdownClose = document.getElementById('contactDropdownClose');
    const contactModal = document.getElementById('contactModal');
    const contactModalClose = document.getElementById('contactModalClose');
    const contactModalOverlay = document.getElementById('contactModalOverlay');

    const contactForm = document.getElementById('contactForm');
    const contactFormMobile = document.getElementById('contactFormMobile');

    const messageTextarea = document.getElementById('contactMessage');
    const messageTextareaMobile = document.getElementById('contactMessageMobile');

    if (contactBadgeBtn) {
        contactBadgeBtn.addEventListener('click', () => {
            contactDropdown.classList.toggle('active');
        });
    }

    if (mobileContactBtn) {
        mobileContactBtn.addEventListener('click', () => {
            const mobileMenu = document.getElementById('mobileMenu');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            if (mobileMenu) mobileMenu.classList.remove('active');
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
            contactModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (contactDropdownClose) {
        contactDropdownClose.addEventListener('click', () => contactDropdown.classList.remove('active'));
    }
    if (contactModalClose) {
        contactModalClose.addEventListener('click', () => {
            contactModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    if (contactModalOverlay) {
        contactModalOverlay.addEventListener('click', () => {
            contactModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    document.addEventListener('click', (e) => {
        if (contactBadgeBtn && !contactBadgeBtn.contains(e.target) && contactDropdown && !contactDropdown.contains(e.target)) {
            contactDropdown.classList.remove('active');
        }
    });

    const setupCounter = (textarea, displayId) => {
        const display = document.getElementById(displayId);
        if (textarea && display) {
            textarea.addEventListener('input', () => { display.textContent = textarea.value.length; });
        }
    };

    setupCounter(messageTextarea, 'charCount');
    setupCounter(messageTextareaMobile, 'charCountMobile');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleContactFormSubmit(contactForm, false);
        });
    }
    if (contactFormMobile) {
        contactFormMobile.addEventListener('submit', (e) => {
            e.preventDefault();
            handleContactFormSubmit(contactFormMobile, true);
        });
    }
}

async function sendLogToServer(status, error = null) {
    try {
        await fetch('/api/log/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, error }),
        });
    } catch (err) {
        console.error('로그 전송 실패:', err);
    }
}

async function handleContactFormSubmit(form, isMobile) {
    const submitBtn = form.querySelector('.form-submit-btn');
    const messageDiv = form.querySelector('.form-message');

    const formData = new FormData(form);
    const name = formData.get('name').trim();
    const phone = formData.get('phone').trim();
    const message = formData.get('message').trim();

    if (!name || !phone || !message) {
        showMessage(messageDiv, '모든 필드를 입력해주세요.', 'error');
        return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
        await sendEmailViaEmailJS(name, phone, message);
        await sendLogToServer('success');
        showMessage(messageDiv, '문의가 성공적으로 전송되었습니다!', 'success');
        form.reset();

        const countId = isMobile ? 'charCountMobile' : 'charCount';
        if (document.getElementById(countId)) document.getElementById(countId).textContent = '0';

        setTimeout(() => {
            if (!isMobile) {
                document.getElementById('contactDropdown').classList.remove('active');
            } else {
                document.getElementById('contactModal').classList.remove('active');
                document.body.style.overflow = '';
            }
            messageDiv.style.display = 'none';
        }, 2000);

    } catch (error) {
        console.error('전송 실패:', error);
        await sendLogToServer('error', error.message);
        showMessage(messageDiv, '전송 중 오류가 발생했습니다.', 'error');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

/**
 * [중요] EmailJS 환경 변수를 안전하게 읽어오는 함수
 */
async function sendEmailViaEmailJS(name, phone, message) {
    // index.html에서 주입된 전역 변수를 우선적으로 참조합니다.
    const config = window.EMAILJS_CONFIG || {};

    const SERVICE_ID = config.SERVICE_ID;
    const TEMPLATE_ID = config.TEMPLATE_ID;
    const PUBLIC_KEY = config.PUBLIC_KEY;

    if (typeof emailjs === 'undefined') {
        throw new Error('EmailJS SDK가 로드되지 않았습니다.');
    }

    // 치환 여부 확인 ({{ }} 패턴이 남아있으면 누락으로 간주)
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY || SERVICE_ID.includes('{{')) {
        console.error('환경변수 상태:', config);
        throw new Error('EmailJS 설정값이 누락되었습니다. (서버 치환 실패)');
    }

    const templateParams = {
        from_name: name,
        from_phone: phone,
        message: message,
        to_email: 'phyun7007@gmail.com'
    };

    return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
}

function showMessage(messageDiv, text, type) {
    if (!messageDiv) return;
    messageDiv.textContent = text;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.display = 'block';
}

/**
 * 초기화 실행 (지연 실행 방어 로직)
 */
const startInit = () => {
    const maxRetries = 20;
    let retries = 0;
    const retryInterval = setInterval(() => {
        // initHeader가 true를 반환(성공)하면 중단
        if (initHeader() || retries >= maxRetries) {
            clearInterval(retryInterval);
        }
        retries++;
    }, 100);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startInit);
} else {
    startInit();
}