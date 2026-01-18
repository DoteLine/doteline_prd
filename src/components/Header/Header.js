/**
 * Header Component JavaScript
 * 중복 선언 방지를 위해 모든 함수와 변수를 window 객체에 할당합니다.
 */

// 1. 파비콘 동적 추가
window.initFavicon = function() {
    if (document.querySelector('link[rel="icon"]')) return;
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = '/resources/icon/favicon.ico?v=1';
    document.head.appendChild(favicon);
};
window.initFavicon();

// 2. Header 초기화 실행기
window.initHeader = function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (!mobileMenuBtn || !mobileMenu) {
        return false;
    }

    // 중복 등록 방지를 위해 기존 버튼 복제 후 교체
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

    window.initSolutionsDropdown();
    window.initMobileSolutionsDropdown();
    window.initContactForm();
    window.initMobileProductsDropdown();

    return true;
};

// 3. 솔루션 드롭다운 (Desktop)
window.initSolutionsDropdown = function() {
    const dropdownMenu = document.getElementById('solutionsDropdown');
    if (!dropdownMenu) return;

    if (typeof window.getAllSolutions !== 'function') {
        setTimeout(window.initSolutionsDropdown, 100);
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
};

// 4. 모바일 솔루션 드롭다운
window.initMobileSolutionsDropdown = function() {
    const mobileDropdownTrigger = document.getElementById('mobileSolutionsTrigger');
    const mobileDropdownMenu = document.getElementById('mobileSolutionsDropdown');

    if (!mobileDropdownTrigger || !mobileDropdownMenu) return;

    if (typeof window.getAllSolutions !== 'function') {
        setTimeout(window.initMobileSolutionsDropdown, 100);
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

    mobileDropdownTrigger.onclick = function(e) {
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
            mobileDropdownMenu.classList.toggle('active', !isOpen);
            mobileDropdownTrigger.classList.toggle('active', !isOpen);
        }
    };
};

// 5. 모바일 제품 드롭다운
window.initMobileProductsDropdown = function() {
    const mobileDropdownTrigger = document.getElementById('mobileProductsTrigger');
    const mobileDropdownMenu = document.getElementById('mobileProductsDropdown');

    if (!mobileDropdownTrigger || !mobileDropdownMenu) return;

    mobileDropdownTrigger.onclick = function(e) {
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
            mobileDropdownMenu.classList.toggle('active', !isOpen);
            mobileDropdownTrigger.classList.toggle('active', !isOpen);
        }
    };
};

// 6. 문의하기 폼 초기화
window.initContactForm = function() {
    const contactBadgeBtn = document.getElementById('contactBadgeBtn');
    const mobileContactBtn = document.getElementById('mobileContactBtn');
    const contactDropdown = document.getElementById('contactDropdown');
    const contactDropdownClose = document.getElementById('contactDropdownClose');
    const contactModal = document.getElementById('contactModal');
    const contactModalClose = document.getElementById('contactModalClose');
    const contactModalOverlay = document.getElementById('contactModalOverlay');
    const contactForm = document.getElementById('contactForm');
    const contactFormMobile = document.getElementById('contactFormMobile');

    if (contactBadgeBtn) {
        contactBadgeBtn.onclick = () => contactDropdown.classList.toggle('active');
    }

    if (mobileContactBtn) {
        mobileContactBtn.onclick = () => {
            const mobileMenu = document.getElementById('mobileMenu');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            if (mobileMenu) mobileMenu.classList.remove('active');
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
            contactModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
    }

    if (contactDropdownClose) contactDropdownClose.onclick = () => contactDropdown.classList.remove('active');
    if (contactModalClose) contactModalClose.onclick = () => {
        contactModal.classList.remove('active');
        document.body.style.overflow = '';
    };
    if (contactModalOverlay) contactModalOverlay.onclick = () => {
        contactModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // 카운터 설정
    const setupCounter = (textarea, displayId) => {
        const display = document.getElementById(displayId);
        if (textarea && display) {
            textarea.oninput = () => { display.textContent = textarea.value.length; };
        }
    };
    setupCounter(document.getElementById('contactMessage'), 'charCount');
    setupCounter(document.getElementById('contactMessageMobile'), 'charCountMobile');

    if (contactForm) {
        contactForm.onsubmit = (e) => { e.preventDefault(); window.handleContactFormSubmit(contactForm, false); };
    }
    if (contactFormMobile) {
        contactFormMobile.onsubmit = (e) => { e.preventDefault(); window.handleContactFormSubmit(contactFormMobile, true); };
    }
};

// 7. 메일 전송 처리
window.handleContactFormSubmit = async function(form, isMobile) {
    const submitBtn = form.querySelector('.form-submit-btn');
    const messageDiv = form.querySelector('.form-message');
    const formData = new FormData(form);
    const name = formData.get('name').trim();
    const phone = formData.get('phone').trim();
    const message = formData.get('message').trim();

    if (!name || !phone || !message) {
        window.showMessage(messageDiv, '모든 필드를 입력해주세요.', 'error');
        return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
        await window.sendEmailViaEmailJS(name, phone, message);
        await window.sendLogToServer('success');
        window.showMessage(messageDiv, '문의가 성공적으로 전송되었습니다!', 'success');
        form.reset();

        setTimeout(() => {
            if (!isMobile) contactDropdown.classList.remove('active');
            else { contactModal.classList.remove('active'); document.body.style.overflow = ''; }
            messageDiv.style.display = 'none';
        }, 2000);
    } catch (error) {
        await window.sendLogToServer('error', error.message);
        window.showMessage(messageDiv, '전송 중 오류가 발생했습니다.', 'error');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
};

window.sendEmailViaEmailJS = async function(name, phone, message) {
    const config = window.EMAILJS_CONFIG || {};

    // [중요] 디버깅 로그 추가: 브라우저 콘솔에서 이 값이 제대로 찍히는지 확인하세요!
    console.log("EmailJS 전송 시도 데이터:", {
        serviceID: config.SERVICE_ID,
        templateID: config.TEMPLATE_ID,
        publicKey: config.PUBLIC_KEY
    });

    if (typeof emailjs === 'undefined') throw new Error('EmailJS SDK가 로드되지 않았습니다.');

    // config 값이 비어있거나 '{{' 가 포함되어 있다면 에러
    if (!config.SERVICE_ID || config.SERVICE_ID.includes('{{')) {
        throw new Error('EmailJS 설정값이 서버로부터 주입되지 않았습니다.');
    }

    return emailjs.send(config.SERVICE_ID, config.TEMPLATE_ID, {
        from_name: name,
        from_phone: phone,
        message: message,
        to_email: 'phyun7007@gmail.com'
    }, config.PUBLIC_KEY);
};

window.sendLogToServer = async function(status, error = null) {
    try {
        await fetch('/api/log/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, error }),
        });
    } catch (err) {}
};

window.showMessage = function(messageDiv, text, type) {
    if (!messageDiv) return;
    messageDiv.textContent = text;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.display = 'block';
};

// 8. 초기화 실행부
window.startInit = function() {
    const maxRetries = 20;
    let retries = 0;
    const retryInterval = setInterval(() => {
        if (window.initHeader() || retries >= maxRetries) {
            clearInterval(retryInterval);
        }
        retries++;
    }, 100);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.startInit);
} else {
    window.startInit();
}