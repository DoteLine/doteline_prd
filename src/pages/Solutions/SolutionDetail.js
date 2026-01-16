/**
 * Solution Detail Page JavaScript
 * Handles dynamic content loading and pagination
 */

// ========================================
// State Management
// ========================================

let currentPage = 1;
const itemsPerPage = 9;
let currentSolutionData = null;

// ========================================
// Utility Functions
// ========================================

/**
 * Get URL parameter by name
 */
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * Scroll to top smoothly
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ========================================
// Content Rendering Functions
// ========================================

/**
 * Load hero section content
 */
function loadHeroSection(data) {
    const heroSection = document.getElementById('heroSection');
    const heroTitle = document.getElementById('heroTitle');

    heroSection.style.backgroundImage = `url('${data.heroImage}')`;
    heroTitle.textContent = data.heroTitle;
}

/**
 * Load second hero section content
 */
function loadSecondHeroSection(data) {
    const secondHeroImage = document.getElementById('secondHeroImage');
    const secondHeroTitle = document.getElementById('secondHeroTitle');
    const secondHeroDescription = document.getElementById('secondHeroDescription');

    secondHeroImage.src = data.secondHeroImage;
    secondHeroImage.alt = data.secondHeroTitle;
    secondHeroTitle.textContent = data.secondHeroTitle;
    secondHeroDescription.textContent = data.secondHeroDescription;

    // 이미지 로딩 처리
    handleSecondHeroImageLoading(secondHeroImage);
}

/**
 * Load products section title
 */
function loadProductsTitle(data) {
    const productsTitle = document.getElementById('productsTitle');
    productsTitle.textContent = data.productsTitle || '관련 제품';
}

/**
 * Render products for current page
 */
function renderProducts(products, page) {
    const productsGrid = document.getElementById('productsGrid');
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageProducts = products.slice(startIndex, endIndex);

    productsGrid.innerHTML = '';

    pageProducts.forEach((product, index) => {
        const productCard = document.createElement('article');
        productCard.className = 'product-card';
        productCard.style.opacity = '0';
        productCard.style.transform = 'translateY(20px)';

        productCard.innerHTML = `
            <div class="product-card__image image-wrapper">
                <img src="${product.image}" alt="${product.title}" loading="lazy" />
            </div>
            <div class="product-card__content">
                <h3 class="product-card__title" style="text-align: center;">${product.title}</h3>
            </div>
        `;

        productsGrid.appendChild(productCard);

        // Entrance animation
        setTimeout(() => {
            productCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            productCard.style.opacity = '1';
            productCard.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // 제품 이미지 로딩 처리
    handleProductImagesLoading();
}

/**
 * Render pagination controls
 */
function renderPagination(totalProducts, currentPage) {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    // Hide pagination if only one page
    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }

    pagination.style.display = 'flex';
    pagination.innerHTML = '';

    // Previous button
    const prevButton = createPaginationButton('이전', currentPage === 1, () => {
        if (currentPage > 1) {
            changePage(currentPage - 1);
        }
    });
    prevButton.classList.add('pagination-button--prev');
    prevButton.setAttribute('aria-label', '이전 페이지');
    pagination.appendChild(prevButton);

    // Page number buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = createPaginationButton(i.toString(), false, () => {
            changePage(i);
        });

        if (i === currentPage) {
            pageButton.classList.add('active');
            pageButton.setAttribute('aria-current', 'page');
        }

        pageButton.setAttribute('aria-label', `${i}페이지`);
        pagination.appendChild(pageButton);
    }

    // Next button
    const nextButton = createPaginationButton('다음', currentPage === totalPages, () => {
        if (currentPage < totalPages) {
            changePage(currentPage + 1);
        }
    });
    nextButton.classList.add('pagination-button--next');
    nextButton.setAttribute('aria-label', '다음 페이지');
    pagination.appendChild(nextButton);
}

/**
 * Create pagination button element
 */
function createPaginationButton(text, disabled, onClick) {
    const button = document.createElement('button');
    button.className = 'pagination-button';
    button.textContent = text;
    button.disabled = disabled;
    button.addEventListener('click', onClick);
    return button;
}

/**
 * Change to specified page
 */
function changePage(page) {
    currentPage = page;
    renderProducts(currentSolutionData.products, currentPage);
    renderPagination(currentSolutionData.products.length, currentPage);
    scrollToTop();
}

// ========================================
// Image Loading Handlers
// ========================================

/**
 * Handle second hero image loading
 */
function handleSecondHeroImageLoading(img) {
    const wrapper = img.parentElement;

    // 로딩 상태 추가
    wrapper.classList.add('loading');

    // 로딩 스피너 표시
    Loading.show(wrapper);

    // 이미지가 이미 로드된 경우 (캐시)
    if (img.complete && img.naturalHeight !== 0) {
        setTimeout(() => {
            wrapper.classList.remove('loading');
            wrapper.classList.add('loaded');
            Loading.hide(wrapper);
        }, 500);
    } else {
        // 이미지 로드 완료 시
        img.addEventListener('load', function() {
            wrapper.classList.remove('loading');
            wrapper.classList.add('loaded');
            Loading.hide(wrapper);
        });

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
    }
}

/**
 * Handle product images loading
 */
function handleProductImagesLoading() {
    const images = document.querySelectorAll('.product-card__image img');

    images.forEach((img, index) => {
        const wrapper = img.parentElement;

        // 로딩 상태 추가
        wrapper.classList.add('loading');

        // 로딩 스피너 표시
        Loading.show(wrapper);

        // 이미지가 이미 로드된 경우 (캐시)
        if (img.complete && img.naturalHeight !== 0) {
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
        }
    });
}

// ========================================
// Initialization
// ========================================

/**
 * Initialize page with solution data
 */
function initializePage() {
    const solutionId = getUrlParameter('id');

    const solutionData = window.findSolutionById(solutionId);

    if (!solutionData) {
        // Redirect to solutions main if invalid ID
        window.location.href = '/src/pages/Solutions/SolutionsMain.html';
        return;
    }

    currentSolutionData = solutionData;

    // Load all sections
    loadHeroSection(currentSolutionData);
    loadSecondHeroSection(currentSolutionData);
    loadProductsTitle(currentSolutionData);
    renderProducts(currentSolutionData.products, currentPage);
    renderPagination(currentSolutionData.products.length, currentPage);

    // Update page title
    document.title = `${currentSolutionData.heroTitle} - DoteLine`;
}

// ========================================
// Event Listeners
// ========================================

document.addEventListener('DOMContentLoaded', initializePage);