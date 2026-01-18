// URL에서 제품 ID 가져오기
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    return parseInt(id);
}

// 제품 데이터 렌더링
function renderProductDetail() {
    // 1. 제품 ID 가져오기
    const productId = getProductIdFromUrl();

    // 2. 제품 찾기
    const product = findProductById(productId);

    // 3. 제품이 없으면 에러 메시지
    if (!product) {
        const section = document.querySelector('.product-detail-section');
        section.innerHTML = `
            <div style="padding: 40px; text-align: center;">
                <h1>제품을 찾을 수 없습니다.</h1>
                <p>요청하신 제품(ID: ${productId})이 존재하지 않습니다.</p>
                <a href="/product" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #333; color: white; text-decoration: none;">목록으로 돌아가기</a>
            </div>
        `;
        return;
    }

    // 4. 배너 섹션 표시
    const bannerSection = document.getElementById('product-banner');
    const bannerBackground = bannerSection.querySelector('.banner-background');
    const bannerProductName = document.getElementById('banner-product-name');
    const bannerProductOptions = document.getElementById('banner-product-options');

    // 배너 배경 이미지 설정
    if (product.bannerImage) {
        bannerBackground.style.backgroundImage = `url('${product.bannerImage}')`;
    }

    // 배너에 제품명 표시
    bannerProductName.textContent = product.name;

    // 배너에 옵션들을 '/' 구분자로 표시
    if (product.specs && product.specs.options && product.specs.options.length > 0) {
        bannerProductOptions.textContent = product.specs.options.join(' / ');
    } else {
        bannerProductOptions.style.display = 'none';
    }

    // 5. 제품명 표시
    document.getElementById('product-name').textContent = product.name;

    // 6. 대표 이미지들 슬라이드쇼로 표시
    const mainImagesContainer = document.getElementById('main-images-container');
    const slideshowDots = document.getElementById('slideshow-dots');
    const sideImagesContainer = document.getElementById('side-images-container');

    if (product.images && product.images.length > 0) {
        mainImagesContainer.innerHTML = ''; // 초기화
        slideshowDots.innerHTML = ''; // 초기화
        sideImagesContainer.innerHTML = ''; // 초기화

        let currentSlide = 0;
        const dots = [];
        const sideImages = [];

        // 슬라이드 트랙 생성
        const slideTrack = document.createElement('div');
        slideTrack.className = 'slideshow-track';
        mainImagesContainer.appendChild(slideTrack);

        // 이미지들 생성 (최대 5개)
        const maxImages = Math.min(product.images.length, 5);
        product.images.slice(0, maxImages).forEach((img, index) => {
            const imgElement = document.createElement('img');
            imgElement.src = img;
            imgElement.alt = `대표 이미지 ${index + 1}`;

            imgElement.onerror = function() {
                console.error(`대표 이미지 ${index + 1} 로드 실패:`, img);
                this.style.display = 'none';
            };

            slideTrack.appendChild(imgElement);

            // 도트 생성
            const dot = document.createElement('span');
            dot.className = index === 0 ? 'dot active' : 'dot';
            dot.addEventListener('click', () => goToSlide(index));
            slideshowDots.appendChild(dot);
            dots.push(dot);

            // 사이드 이미지 생성
            const sideImg = document.createElement('img');
            sideImg.src = img;
            sideImg.alt = `썸네일 ${index + 1}`;
            sideImg.className = index === 0 ? 'side-image active' : 'side-image';
            sideImg.addEventListener('click', () => goToSlide(index));
            sideImagesContainer.appendChild(sideImg);
            sideImages.push(sideImg);
        });

        // 슬라이드 변경 함수
        function goToSlide(slideIndex) {
            // 모든 도트의 active 클래스 제거
            dots.forEach(dot => dot.classList.remove('active'));
            // 모든 사이드 이미지의 active 클래스 제거
            sideImages.forEach(img => img.classList.remove('active'));

            // 현재 슬라이드 업데이트
            currentSlide = slideIndex;

            // 트랙을 좌측으로 이동
            const offset = -currentSlide * 100;
            slideTrack.style.transform = `translateX(${offset}%)`;

            // 해당 도트에 active 클래스 추가
            dots[currentSlide].classList.add('active');
            // 해당 사이드 이미지에 active 클래스 추가
            sideImages[currentSlide].classList.add('active');
        }

        // 다음 슬라이드로 자동 전환
        function nextSlide() {
            const nextIndex = (currentSlide + 1) % maxImages;
            goToSlide(nextIndex);
        }

        // 3초마다 자동으로 다음 슬라이드로 전환
        let slideInterval = setInterval(nextSlide, 3000);

        // 사용자가 도트를 클릭하면 자동 전환 타이머 재시작
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 3000);
            });
        });

    } else {
        document.getElementById('main-images-section').style.display = 'none';
    }

    // 7. 옵션 표시 (배너와 같은 형식: 옵션1 / 옵션2 / 옵션3)
    const optionsText = document.getElementById('options-text');
    if (product.specs && product.specs.options && product.specs.options.length > 0) {
        optionsText.textContent = product.specs.options.join(' / ');
    } else {
        document.getElementById('options-section').style.display = 'none';
    }

    // 8. 태그 표시 (세로 정렬)
    const tagsContainer = document.getElementById('tags-container');
    if (product.specs && product.specs.tags && product.specs.tags.length > 0) {
        tagsContainer.innerHTML = ''; // 초기화
        product.specs.tags.forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.className = 'tag-item';
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });
    } else {
        document.getElementById('tags-section').style.display = 'none';
    }

    // 9. 상세 이미지들 표시
    const detailImagesContainer = document.getElementById('detail-images-container');
    if (product.detailImages && product.detailImages.length > 0) {
        detailImagesContainer.innerHTML = ''; // 초기화
        product.detailImages.forEach((img, index) => {
            const wrapper = document.createElement('div');
            wrapper.style.marginBottom = '20px';
            
            const imgElement = document.createElement('img');
            imgElement.src = img;
            imgElement.alt = `상세 이미지 ${index + 1}`;
            imgElement.style.maxWidth = '100%';
            imgElement.style.height = 'auto';
            imgElement.style.border = '1px solid #eee';
            
            imgElement.onerror = function() {
                console.error(`상세 이미지 ${index + 1} 로드 실패:`, img);
                wrapper.innerHTML = `<p style="color: red;">이미지 ${index + 1}을 불러올 수 없습니다.</p>`;
            };
            
            wrapper.appendChild(imgElement);
            detailImagesContainer.appendChild(wrapper);
        });
    } else {
        document.getElementById('detail-images-section').style.display = 'none';
    }

    // 10. 페이지 제목 변경
    document.title = `${product.name} | DOTELINE`;
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    // ProductData.js가 로드되었는지 확인
    if (typeof findProductById === 'undefined') {
        console.error('ProductData.js가 로드되지 않았습니다!');
        return;
    }
    
    renderProductDetail();
});