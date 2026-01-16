
// ===============================================
// 주력상품 (FEATURED PRODUCTS) 데이터
// ===============================================
const featuredProductsData = {
    // 1. Hero 이미지
    hero: {
        image: '/resources/featured/hero.jpg',
        alt: '주력상품 메인 이미지'
    },
    // 2. 첫 번째 텍스트 섹션
    text1: {
        title: '최고의 LED 디스플레이 솔루션',
        description: '도트라인은 최첨단 기술과 혁신적인 디자인으로 고객의 니즈에 맞는 최적의 LED 디스플레이를 제공합니다. 다양한 환경에서 탁월한 성능을 발휘하는 주력 제품들을 소개합니다.'
    },
    // 3. 3등분 섹션 (왼쪽 이미지, 오른쪽 위 텍스트, 오른쪽 아래 이미지)
    threeSplit: {
        leftImage: {
            src: '/resources/featured/three-left.jpg',
            alt: '3등분 왼쪽 이미지'
        },
        rightText: {
            title: '뛰어난 화질',
            description: '고해상도 디스플레이로 선명하고 생생한 영상을 구현합니다.'
        },
        rightImage: {
            src: '/resources/featured/three-right.jpg',
            alt: '3등분 오른쪽 아래 이미지'
        }
    },
    // 4. 4등분 섹션
    fourSplit: [
        { type: 'image', src: '/resources/featured/four-1.jpg', alt: '4등분 이미지 1' },
        { type: 'text', title: '다양한 설치 환경', description: '실내외 어디서든 최적의 성능을 발휘합니다.' },
        { type: 'text', title: '에너지 효율', description: '저전력 고효율 설계로 운영 비용을 절감합니다.' },
        { type: 'image', src: '/resources/featured/four-2.jpg', alt: '4등분 이미지 2' }
    ],
    // 5. 두 번째 텍스트 섹션
    text2: {
        title: '신뢰할 수 있는 파트너',
        description: '도트라인은 설계부터 설치, 유지보수까지 원스톱 서비스를 제공합니다. 고객 만족을 최우선으로 생각하며, 최고의 품질과 서비스로 보답하겠습니다.'
    },
    // 6. 왼쪽 이미지 + 오른쪽 텍스트 (secondHero 스타일)
    secondHero1: {
        image: {
            src: '/resources/featured/second-hero-1.jpg',
            alt: '세컨드 히어로 이미지 1'
        },
        title: '맞춤형 솔루션',
        description: '고객의 요구사항에 맞춘 맞춤형 LED 디스플레이 솔루션을 제공합니다. 공간의 특성과 용도에 최적화된 제품을 설계하고 설치합니다.'
    },
    // 7. 전체 이미지
    fullImage: {
        src: '/resources/featured/full-image.jpg',
        alt: '전체 이미지'
    },
    // 8. 왼쪽 이미지 + 오른쪽 텍스트 (secondHero 스타일)
    secondHero2: {
        image: {
            src: '/resources/featured/second-hero-2.jpg',
            alt: '세컨드 히어로 이미지 2'
        },
        title: '기술 지원 서비스',
        description: '전문 기술팀이 24시간 대기하여 신속한 기술 지원을 제공합니다. 설치 후에도 지속적인 관리와 유지보수 서비스를 통해 최상의 상태를 유지합니다.'
    }
};

// 주력상품 HTML 생성
const createFeaturedProductsHTML = () => {
    const data = featuredProductsData;

    return `
        <!-- 1. Hero 이미지 -->
        <section class="featured-hero">
            <img src="${data.hero.image}" alt="${data.hero.alt}">
        </section>

        <!-- 2. 첫 번째 텍스트 섹션 -->
        <section class="featured-text">
            <div class="featured-text__container">
                <h2 class="featured-text__title">${data.text1.title}</h2>
                <p class="featured-text__description">${data.text1.description}</p>
            </div>
        </section>

        <!-- 3. 3등분 섹션 -->
        <section class="featured-three-split">
            <div class="featured-three-split__left">
                <img src="${data.threeSplit.leftImage.src}" alt="${data.threeSplit.leftImage.alt}">
            </div>
            <div class="featured-three-split__right">
                <div class="featured-three-split__text">
                    <h3>${data.threeSplit.rightText.title}</h3>
                    <p>${data.threeSplit.rightText.description}</p>
                </div>
                <div class="featured-three-split__image">
                    <img src="${data.threeSplit.rightImage.src}" alt="${data.threeSplit.rightImage.alt}">
                </div>
            </div>
        </section>

        <!-- 4. 4등분 섹션 -->
        <section class="featured-four-split">
            ${data.fourSplit.map(item => {
                if (item.type === 'image') {
                    return `
                        <div class="featured-four-split__item">
                            <img src="${item.src}" alt="${item.alt}">
                        </div>
                    `;
                } else {
                    return `
                        <div class="featured-four-split__item featured-four-split__item--text">
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                        </div>
                    `;
                }
            }).join('')}
        </section>

        <!-- 5. 두 번째 텍스트 섹션 -->
        <section class="featured-text">
            <div class="featured-text__container">
                <h2 class="featured-text__title">${data.text2.title}</h2>
                <p class="featured-text__description">${data.text2.description}</p>
            </div>
        </section>

        <!-- 6. 왼쪽 이미지 + 오른쪽 텍스트 -->
        <section class="featured-second-hero">
            <div class="featured-second-hero__container">
                <div class="featured-second-hero__image">
                    <img src="${data.secondHero1.image.src}" alt="${data.secondHero1.image.alt}">
                </div>
                <div class="featured-second-hero__content">
                    <h2 class="featured-second-hero__title">${data.secondHero1.title}</h2>
                    <p class="featured-second-hero__description">${data.secondHero1.description}</p>
                </div>
            </div>
        </section>

        <!-- 7. 전체 이미지 -->
        <section class="featured-full-image">
            <img src="${data.fullImage.src}" alt="${data.fullImage.alt}">
        </section>

        <!-- 8. 왼쪽 이미지 + 오른쪽 텍스트 -->
        <section class="featured-second-hero">
            <div class="featured-second-hero__container">
                <div class="featured-second-hero__image">
                    <img src="${data.secondHero2.image.src}" alt="${data.secondHero2.image.alt}">
                </div>
                <div class="featured-second-hero__content">
                    <h2 class="featured-second-hero__title">${data.secondHero2.title}</h2>
                    <p class="featured-second-hero__description">${data.secondHero2.description}</p>
                </div>
            </div>
        </section>
    `;
};

// 주력상품 렌더링
const renderFeaturedProducts = () => {
    const productsSection = document.querySelector('.products-section-new');
    if (!productsSection) return;

    productsSection.innerHTML = `
        <div class="featured-container">
            ${createFeaturedProductsHTML()}
        </div>
    `;
};



// 제품 카드 HTML 생성
const createProductCard = (product) => {
    console.log('check product', product)
    return `
        <div class="product-card-new" data-category="${product.category}" data-product-id="${product.id}" onclick="goToProductDetail(${product.id})"> 
            <div class="product-image-placeholder">
                <div class="product-image">
                    <img src="${product.thumbnail}" alt="${product.name}" />
                </div>
            </div>
            <div class="product-title-new">
                <h3>${product.name}</h3>
                <p class="product-options">${product.specs.options.join(', ')}</p>
            </div>
        </div>
    `;
};


// 제품 상세 페이지로 이동
window.goToProductDetail = function(productId) {
    window.location.href = `/productDetail?id=${productId}`;
};


// 제품 목록 렌더링
const renderProducts = (category = 'all') => {
    const productsSection = document.querySelector('.products-section-new');
    if(!productsSection) return;

    // 일반 제품 그리드 구조로 복원
    productsSection.innerHTML = `
        <div class="container">
            <div class="product-grid-new"></div>
        </div>
    `;

    const productsGrid = productsSection.querySelector('.product-grid-new');
    const products = getProductsByCategory(category);

    if(products.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">해당 카테고리의 제품이 없습니다.</p>';
        return;
    }

    productsGrid.innerHTML = products.map(product => createProductCard(product)).join('');
}

// 버튼 활성화 상태 변경
const updateActiveButton = (clickedButton) => {
    // 모든 카테고리 버튼 (category-btn, category-btn2 모두)
    const allButtons = document.querySelectorAll('.category-group .category-btn, .category-group .category-btn2');
    allButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.removeAttribute('aria-current');
    });

    clickedButton.classList.add('active');
    clickedButton.setAttribute('aria-current', 'page');
};


// 카테고리 필터링 이벤트 설정
const initCategoryFilter = () => {
    const categoryGroup = document.querySelector('.category-group');
    if(!categoryGroup) return;

    const buttons = categoryGroup.querySelectorAll('.category-btn');
    const featuredButton = categoryGroup.querySelector('.category-btn2');

    const categoryMap = {
        '전체' : 'all',
        '임대' : 'rental',
        '야외' : 'outdoor',
        '실내' : 'indoor',
        'COB LED' : 'cob',
    };

    // 일반 카테고리 버튼 이벤트
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            const buttonText = button.textContent.trim();
            const category = categoryMap[buttonText];

            updateActiveButton(button);
            renderProducts(category);
        });
    });

    // 주력상품 버튼 이벤트
    if (featuredButton) {
        featuredButton.addEventListener('click', (e) => {
            e.preventDefault();
            updateActiveButton(featuredButton);
            renderFeaturedProducts();
        });
    }
}


// URL 해시에서 카테고리 가져오기
const getCategoryFromHash = () => {
    const hash = window.location.hash;
    if (!hash) return null;

    // #category-rental -> rental
    const hashMap = {
        '#category-rental': 'rental',
        '#category-outdoor': 'outdoor',
        '#category-indoor': 'indoor',
        '#category-cob': 'cob',
        '#category-all': 'all'
    };

    return hashMap[hash] || null;
};

// 카테고리 ID로 버튼 찾기
const findButtonByCategory = (category) => {
    const idMap = {
        'rental': 'category-rental',
        'outdoor': 'category-outdoor',
        'indoor': 'category-indoor',
        'cob': 'category-cob',
        'all': 'category-all'
    };

    const buttonId = idMap[category];
    return buttonId ? document.getElementById(buttonId) : null;
};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    // URL 해시에서 카테고리 확인
    const hashCategory = getCategoryFromHash();

    if (hashCategory) {
        // 해시에 카테고리가 있으면 해당 카테고리 표시
        const button = findButtonByCategory(hashCategory);
        if (button) {
            updateActiveButton(button);
        }
        renderProducts(hashCategory);
    } else {
        // 해시가 없으면 전체 제품 표시
        renderProducts('all');
    }

    // 카테고리 필터 이벤트 설정
    initCategoryFilter();
});

// 해시 변경 시 카테고리 업데이트
window.addEventListener('hashchange', () => {
    const hashCategory = getCategoryFromHash();
    if (hashCategory) {
        const button = findButtonByCategory(hashCategory);
        if (button) {
            updateActiveButton(button);
        }
        renderProducts(hashCategory);
    }
});