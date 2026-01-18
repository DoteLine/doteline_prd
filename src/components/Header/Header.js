/**
 * Header Component JavaScript
 * - 모바일 메뉴 토글 기능
 * - 솔루션 드롭다운 동적 생성
 */

/**
 * 파비콘 동적 추가 (모든 페이지에 적용)
 */
function initFavicon() {
  // 이미 파비콘이 있으면 스킵
  if (document.querySelector('link[rel="icon"]')) return;

  const favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.href = '/resources/icon/favicon.ico?v=1';
  document.head.appendChild(favicon);
}

// 페이지 로드 시 파비콘 설정
initFavicon();

// Header 컴포넌트가 로드된 후 실행되도록 함수로 감싸기
function initHeader() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!mobileMenuBtn || !mobileMenu) {
    console.warn('Header elements not found, retrying...');
    return false;
  }

  // 기존 이벤트 리스너 제거 (중복 방지)
  const newMobileMenuBtn = mobileMenuBtn.cloneNode(true);
  mobileMenuBtn.parentNode.replaceChild(newMobileMenuBtn, mobileMenuBtn);

  // 메뉴 토글 기능
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

  // 메뉴 링크 클릭시 메뉴 닫기 (솔루션 드롭다운 트리거 제외)
  const mobileMenuLinks = mobileMenu.querySelectorAll('.menu-link:not(.mobile-dropdown-trigger)');
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      newMobileMenuBtn.classList.remove('active');
    });
  });

  // 솔루션 드롭다운 초기화
  initSolutionsDropdown();

  // 모바일 솔루션 드롭다운 토글
  initMobileSolutionsDropdown();

  // 문의하기 기능 초기화
  initContactForm();

  // 모바일 제품 드롭다운 토글
  initMobileProductsDropdown();

  return true;
}

/**
 * 솔루션 드롭다운 동적 생성 (Desktop)
 */
function initSolutionsDropdown() {
  const dropdownMenu = document.getElementById('solutionsDropdown');

  if (!dropdownMenu) {
    console.warn('Solutions dropdown not found');
    return;
  }

  // SolutionData가 로드되었는지 확인
  if (typeof window.getAllSolutions !== 'function') {
    console.warn('SolutionData not loaded yet, retrying...');
    setTimeout(initSolutionsDropdown, 100);
    return;
  }

  // 모든 솔루션 가져오기
  const solutions = window.getAllSolutions();

  // 드롭다운 아이템 생성
  const dropdownHTML = solutions.map((solution, index) => {
    // 구분선 추가 (4개마다)
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
 * 모바일 솔루션 드롭다운 초기화
 */
function initMobileSolutionsDropdown() {
  const mobileDropdownTrigger = document.getElementById('mobileSolutionsTrigger');
  const mobileDropdownMenu = document.getElementById('mobileSolutionsDropdown');

  if (!mobileDropdownTrigger || !mobileDropdownMenu) {
    console.warn('Mobile solutions dropdown not found');
    return;
  }

  // SolutionData가 로드되었는지 확인
  if (typeof window.getAllSolutions !== 'function') {
    console.warn('SolutionData not loaded yet, retrying...');
    setTimeout(initMobileSolutionsDropdown, 100);
    return;
  }

  // 모든 솔루션 가져오기
  const solutions = window.getAllSolutions();

  // 모바일 드롭다운 아이템 생성
  const mobileDropdownHTML = solutions.map(solution => `
    <li>
      <a href="/src/pages/Solutions/SolutionDetail.html?id=${solution.id}" class="mobile-dropdown-item">
        <span class="mobile-dropdown-item-label">${solution.label}</span>
        <span class="mobile-dropdown-item-title">${solution.headline}</span>
      </a>
    </li>
  `).join('');

  mobileDropdownMenu.innerHTML = mobileDropdownHTML;

    // 모바일 드롭다운 토글 기능 (텍스트 클릭 시 페이지 이동, 그 외 클릭 시 드롭다운)
    mobileDropdownTrigger.addEventListener('click', (e) => {
        const target = e.target;
        const clickedOnText = target.classList.contains('mobile-dropdown-text');

        if (clickedOnText) {
            // 텍스트 클릭: 페이지로 이동 (기본 링크 동작)
            // 모바일 메뉴 닫기
            const mobileMenu = document.getElementById('mobileMenu');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            if (mobileMenu && mobileMenuBtn) {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        } else {
            // 화살표나 공백 클릭: 드롭다운 토글
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

    // 모바일 드롭다운 아이템 클릭 시 메뉴 닫기
    const mobileDropdownItems = mobileDropdownMenu.querySelectorAll('.mobile-dropdown-item');
    mobileDropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            // 드롭다운 닫기
            mobileDropdownMenu.classList.remove('active');
            mobileDropdownTrigger.classList.remove('active');

            // 전체 모바일 메뉴도 닫기
            const mobileMenu = document.getElementById('mobileMenu');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            if (mobileMenu && mobileMenuBtn) {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    });
}

/**
 * 모바일 제품 드롭다운 초기화
 */
function initMobileProductsDropdown() {
    const mobileDropdownTrigger = document.getElementById('mobileProductsTrigger');
    const mobileDropdownMenu = document.getElementById('mobileProductsDropdown');

    if (!mobileDropdownTrigger || !mobileDropdownMenu) {
        console.warn('Mobile products dropdown not found');
        return;
    }

    // 모바일 드롭다운 토글 기능 (텍스트 클릭 시 페이지 이동, 그 외 클릭 시 드롭다운)
    mobileDropdownTrigger.addEventListener('click', (e) => {
        const target = e.target;
        const clickedOnText = target.classList.contains('mobile-dropdown-text');

        if (clickedOnText) {
            // 텍스트 클릭: 페이지로 이동 (기본 링크 동작)
            // 모바일 메뉴 닫기
            const mobileMenu = document.getElementById('mobileMenu');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            if (mobileMenu && mobileMenuBtn) {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        } else {
            // 화살표나 공백 클릭: 드롭다운 토글
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

    // 모바일 드롭다운 아이템 클릭 시 메뉴 닫기
  const mobileDropdownItems = mobileDropdownMenu.querySelectorAll('.mobile-dropdown-item');
  mobileDropdownItems.forEach(item => {
    item.addEventListener('click', () => {
      // 드롭다운 닫기
      mobileDropdownMenu.classList.remove('active');
      mobileDropdownTrigger.classList.remove('active');

      // 전체 모바일 메뉴도 닫기
      const mobileMenu = document.getElementById('mobileMenu');
      const mobileMenuBtn = document.getElementById('mobileMenuBtn');
      if (mobileMenu && mobileMenuBtn) {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
      }
    });
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

  const charCountElement = document.getElementById('charCount');
  const charCountMobileElement = document.getElementById('charCountMobile');
  const messageTextarea = document.getElementById('contactMessage');
  const messageTextareaMobile = document.getElementById('contactMessageMobile');

  if (!contactBadgeBtn && !mobileContactBtn) {
    console.warn('Contact buttons not found');
    return;
  }

  // 데스크톱 문의하기 버튼 클릭 (드롭다운 토글)
  if (contactBadgeBtn) {
    contactBadgeBtn.addEventListener('click', () => {
      contactDropdown.classList.toggle('active');
    });
  }

  // 모바일 메뉴 내 문의하기 버튼 클릭 (모달 열기)
  if (mobileContactBtn) {
    mobileContactBtn.addEventListener('click', () => {
      // 모바일 메뉴 닫기
      const mobileMenu = document.getElementById('mobileMenu');
      const mobileMenuBtn = document.getElementById('mobileMenuBtn');
      if (mobileMenu) mobileMenu.classList.remove('active');
      if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');

      // 모달 열기
      contactModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  // 드롭다운 닫기 버튼
  if (contactDropdownClose) {
    contactDropdownClose.addEventListener('click', () => {
      contactDropdown.classList.remove('active');
    });
  }

  // 모달 닫기 버튼
  if (contactModalClose) {
    contactModalClose.addEventListener('click', () => {
      contactModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // 모달 오버레이 클릭 시 닫기
  if (contactModalOverlay) {
    contactModalOverlay.addEventListener('click', () => {
      contactModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // 외부 클릭 시 드롭다운 닫기
  document.addEventListener('click', (e) => {
    if (!contactBadgeBtn.contains(e.target) && !contactDropdown.contains(e.target)) {
      contactDropdown.classList.remove('active');
    }
  });

  // 글자 수 카운터 (데스크톱)
  if (messageTextarea && charCountElement) {
    messageTextarea.addEventListener('input', () => {
      charCountElement.textContent = messageTextarea.value.length;
    });
  }

  // 글자 수 카운터 (모바일)
  if (messageTextareaMobile && charCountMobileElement) {
    messageTextareaMobile.addEventListener('input', () => {
      charCountMobileElement.textContent = messageTextareaMobile.value.length;
    });
  }

  // 폼 제출 (데스크톱)
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleContactFormSubmit(contactForm, false);
    });
  }

  // 폼 제출 (모바일)
  if (contactFormMobile) {
    contactFormMobile.addEventListener('submit', (e) => {
      e.preventDefault();
      handleContactFormSubmit(contactFormMobile, true);
    });
  }
}

/**
 * 서버에 로그 전송
 * @param {string} status - 'success' 또는 'error'
 * @param {string} error - 에러 메시지 (옵션)
 */
async function sendLogToServer(status, error = null) {
    try {
        await fetch('/api/log/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status, error }),
        });
    } catch (err) {
        console.error('로그 전송 실패:', err);
    }
}

/**
 * 문의하기 폼 제출 처리
 * @param {HTMLFormElement} form - 제출할 폼
 * @param {boolean} isMobile - 모바일 여부
 */
async function handleContactFormSubmit(form, isMobile) {
  const submitBtn = form.querySelector('.form-submit-btn');
  const messageDiv = form.querySelector('.form-message');

  // 폼 데이터 가져오기
  const formData = new FormData(form);
  const name = formData.get('name').trim();
  const phone = formData.get('phone').trim();
  const message = formData.get('message').trim();

  // 유효성 검사
  if (!name || !phone || !message) {
    showMessage(messageDiv, '모든 필드를 입력해주세요.', 'error');
    return;
  }

  // 전화번호 형식 검사 (간단한 검증)
  const phoneRegex = /^[0-9-+() ]+$/;
  if (!phoneRegex.test(phone)) {
    showMessage(messageDiv, '올바른 전화번호 형식을 입력해주세요.', 'error');
    return;
  }

  // 로딩 상태
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  try {
    // EmailJS로 이메일 전송
    await sendEmailViaEmailJS(name, phone, message);

    // 성공 로그 전송
    await sendLogToServer('success');

    // 성공 메시지
    showMessage(messageDiv, '문의가 성공적으로 전송되었습니다!', 'success');

    // 폼 초기화
    form.reset();
    if (!isMobile) {
      document.getElementById('charCount').textContent = '0';
    } else {
      document.getElementById('charCountMobile').textContent = '0';
    }

    // 2초 후 드롭다운/모달 닫기
    setTimeout(() => {
      if (!isMobile) {
        document.getElementById('contactDropdown').classList.remove('active');
      } else {
        document.getElementById('contactModal').classList.remove('active');
        document.body.style.overflow = '';
      }
      messageDiv.classList.remove('success');
      messageDiv.style.display = 'none';
    }, 2000);

  } catch (error) {
    console.error('Error sending email:', error);
    
    // 실패 로그 전송
    await sendLogToServer('error', error.message || 'Unknown error');

    showMessage(messageDiv, '전송 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
  } finally {
    // 로딩 상태 해제
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }
}

/**
 * EmailJS를 통해 이메일 전송
 * @param {string} name - 이름
 * @param {string} phone - 전화번호
 * @param {string} message - 문의 내용
 */
async function sendEmailViaEmailJS(name, phone, message) {
  // 환경변수에서 EmailJS 설정 로드
  const SERVICE_ID = window.EMAILJS_CONFIG?.SERVICE_ID;
  const TEMPLATE_ID = window.EMAILJS_CONFIG?.TEMPLATE_ID;
  const PUBLIC_KEY = window.EMAILJS_CONFIG?.PUBLIC_KEY;

  // EmailJS가 로드되지 않았을 경우
  if (typeof emailjs === 'undefined') {
    throw new Error('EmailJS가 로드되지 않았습니다.');
  }

  // 환경변수가 설정되지 않은 경우
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.error('환경변수 누락:', {
      SERVICE_ID: SERVICE_ID || '❌ 누락',
      TEMPLATE_ID: TEMPLATE_ID || '❌ 누락',
      PUBLIC_KEY: PUBLIC_KEY ? '✅ 설정됨' : '❌ 누락'
    });
    throw new Error('EmailJS 환경변수가 설정되지 않았습니다. .env 파일을 확인해주세요.');
  }

  // 이메일 전송
  const templateParams = {
    from_name: name,
    from_phone: phone,
    message: message,
    to_email: 'phyun7007@gmail.com'
  };

  return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
}

/**
 * 메시지 표시
 * @param {HTMLElement} messageDiv - 메시지를 표시할 요소
 * @param {string} text - 메시지 텍스트
 * @param {string} type - 메시지 타입 (success/error)
 */
function showMessage(messageDiv, text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `form-message ${type}`;
  messageDiv.style.display = 'block';
}

// DOM이 로드될 때까지 대기하고 초기화 시도
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Header가 로드될 때까지 재시도
    const maxRetries = 10;
    let retries = 0;
    const retryInterval = setInterval(() => {
      if (initHeader() || retries >= maxRetries) {
        clearInterval(retryInterval);
      }
      retries++;
    }, 100);
  });
} else {
  // 이미 DOMContentLoaded가 실행된 경우
  const maxRetries = 10;
  let retries = 0;
  const retryInterval = setInterval(() => {
    if (initHeader() || retries >= maxRetries) {
      clearInterval(retryInterval);
    }
    retries++;
  }, 100);
}