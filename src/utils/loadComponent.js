/**
 * Component Loader Utility
 * 컴포넌트를 동적으로 로드하는 유틸리티
 */

// 컴포넌트를 로드하는 함수
async function loadComponent(componentName, targetId) {
    try {
        const response = await fetch(`/src/components/${componentName}/${componentName}.html`);
        if (!response.ok) {
            throw new Error(`Failed to load ${componentName}: ${response.status}`);
        }
        const html = await response.text();
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.innerHTML = html;
        } else {
            console.error(`Target element with id "${targetId}" not found`);
        }
    } catch (error) {
        console.error(`Error loading component ${componentName}:`, error);
    }
}

// 헤더와 푸터 로드 함수
async function loadHeaderAndFooter() {
    await loadComponent('Header', 'header-container');
    await loadComponent('Footer', 'footer-container');
}

// 즉시 실행
loadHeaderAndFooter();

// 전역으로 노출 (다른 스크립트에서 사용할 수 있도록)
window.loadComponent = loadComponent;