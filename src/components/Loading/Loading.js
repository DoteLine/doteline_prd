/**
 * Loading Component
 * 재사용 가능한 로딩 인디케이터 컴포넌트
 */

class Loading {
    /**
     * 로딩 스피너 생성
     * @param {HTMLElement} targetElement - 로딩 스피너를 표시할 부모 요소
     * @param {Object} options - 옵션 설정
     * @param {string} options.text - 로딩 텍스트 (기본값: 'Loading')
     * @returns {HTMLElement} 생성된 로딩 요소
     */
    static show(targetElement, options = {}) {
        // 기존 로딩 스피너가 있으면 제거
        this.hide(targetElement);

        // 로딩 컨테이너 생성
        const loadingContainer = document.createElement('div');
        loadingContainer.className = 'loading-container';
        loadingContainer.setAttribute('data-loading', 'true');

        // 로딩 애니메이션 요소 생성
        const loader = document.createElement('div');
        loader.className = 'loader';

        // 9개의 square 생성
        for (let i = 1; i <= 9; i++) {
            const square = document.createElement('div');
            square.className = 'square';
            square.id = `sq${i}`;
            loader.appendChild(square);
        }

        loadingContainer.appendChild(loader);
        targetElement.appendChild(loadingContainer);

        return loadingContainer;
    }

    /**
     * 로딩 스피너 제거
     * @param {HTMLElement} targetElement - 로딩 스피너를 제거할 부모 요소
     */
    static hide(targetElement) {
        const existingLoader = targetElement.querySelector('[data-loading="true"]');
        if (existingLoader) {
            existingLoader.remove();
        }
    }

    /**
     * 전체 페이지 로딩 오버레이 표시
     * @param {Object} options - 옵션 설정
     * @param {string} options.text - 로딩 텍스트 (기본값: 'Loading')
     * @param {string} options.backgroundColor - 배경색
     * @returns {HTMLElement} 생성된 오버레이 요소
     */
    static showOverlay(options = {}) {
        const {
            backgroundColor = 'rgba(0, 0, 0, 0.8)'
        } = options;

        // 기존 오버레이가 있으면 제거
        this.hideOverlay();

        // 오버레이 생성
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.setAttribute('data-loading-overlay', 'true');
        overlay.style.backgroundColor = backgroundColor;

        // 로딩 애니메이션 요소 생성
        const loader = document.createElement('div');
        loader.className = 'loader';

        // 9개의 square 생성
        for (let i = 1; i <= 9; i++) {
            const square = document.createElement('div');
            square.className = 'square';
            square.id = `sq${i}`;
            loader.appendChild(square);
        }

        overlay.appendChild(loader);
        document.body.appendChild(overlay);

        return overlay;
    }

    /**
     * 전체 페이지 로딩 오버레이 제거
     */
    static hideOverlay() {
        const existingOverlay = document.querySelector('[data-loading-overlay="true"]');
        if (existingOverlay) {
            existingOverlay.remove();
        }
    }
}

// 전역으로 사용 가능하도록 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Loading;
}