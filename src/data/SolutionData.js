/**
 * 솔루션 데이터 관리
 * id, heroImage, products 등 솔루션 상세 정보 관리
 */

/**
 * 솔루션 이미지 경로를 자동으로 생성하는 함수
 * @param {string} folderName - 폴더명 (예: 'outdoor_billboard')
 * @param {Array} productList - 제품 목록 [{fileName: string, title: string}, ...]
 * @returns {object} - thumbnail, heroImage, secondHeroImage, products 경로
 */
function generateSolutionImages(folderName, productList) {
    const basePath = `/resources/solutionpage/${folderName}`;

    // 기본 이미지 경로
    const thumbnail = `${basePath}/Cover.jpg`;
    const heroImage = `${basePath}/Hero.jpg`;
    const secondHeroImage = `${basePath}/Second_Hero.jpg`;

    // 제품 이미지 배열 생성
    const products = productList.map(product => ({
        image: `${basePath}/concept/${product.fileName}`,
        title: product.title
    }));

    return {
        thumbnail,
        heroImage,
        secondHeroImage,
        products
    };
}

// 솔루션 데이터
const solutionsData = [
    {
        id: 1,
        label: 'Solution 01',
        headline: '옥외광고판',
        heroTitle: '옥외광고판',
        description: '디지털 옥외 광고는 디지털 광고판과 옥외 간판을 비롯하여 다양한 상업 지역과 공공장소등 거의 모든 곳에서 활용되는 광범위한 콘텐츠를 포괄합니다.',
        secondHeroTitle: '3D 스크린',
        secondHeroDescription: '옥외 대형 스크린 무감각 3D는 초고화질 무감각 3D 디스플레이 단말기와 LED디스플레이의 결합, 그리고 디지털 콘텐츠와 무감각 3D 기술의 혁신적인 결합을 통해 시각적 효과와 예술적 아름움을 겸비한 새로운 광고 모델을 창출합니다.',
        productsTitle: '옥외광고판 제품',
        ...generateSolutionImages('outdoor_billboard', [
            { fileName: '1Video_Wall.jpg', title: '비디오 월' },
            { fileName: '2Curtain_Wall_Screen.jpg', title: '커튼 월 스크린' },
            { fileName: '3Wall_Screen.jpg', title: '벽면 스크린' },
            { fileName: '4Angle_Adjustment_Screen.jpg', title: '각도 조절 스크린' },
            { fileName: '5An_Advertising_Screen.jpg', title: '광고 스크린' },
            { fileName: '6Pillar_Screen.jpg', title: '기둥형 스크린' },
            { fileName: '7A_Fixed_Screen.jpg', title: '고정형 스크린' },
            { fileName: '8High_Tower_Screen.jpg', title: '하이 타워 스크린' },
            { fileName: '9An_Advertising_Bulletin_Board_Screen.jpg', title: '광고 게시판' },
            { fileName: '10Facade_Screen.jpg', title: '파사드 스크린' },
            { fileName: '11A_Street_Lamp_Screen.jpg', title: '가로등 스크린' },
            { fileName: '12A_Stadium_Screen.jpg', title: '경기장 스크린' }
        ])
    },
    {
        id: 2,
        label: 'Solution 02',
        headline: '렌탈 및 이벤트',
        heroTitle: '렌탈 및 이벤트',
        description: '각종 행사 및 전시회, 무대 설치, 공연, 콘서트, 대규모 회의 등에서 시청각적 경험을 향상시키기 위해 사용됩니다.',
        secondHeroTitle: '곡면 LED 스크린 대여',
        secondHeroDescription: '곡면 LED 디스플레이는 공연 예술 현장, 파빌리온, 과학 기술 박물관, 야외 미디어 등 다양한 분야에서 활용될 수 있습니다.',
        productsTitle: '렌탈 및 이벤트',
        ...generateSolutionImages('rental_event', [
            { fileName: '1A_Long_Axis_Screen.jpg', title: '장축 스크린' },
            { fileName: '2Curved Screen.jpg', title: '곡면 스크린' },
            { fileName: '3Event_Screen.jpg', title: '이벤트 스크린' },
            { fileName: '4Event_Screen.jpg', title: '무대 스크린' },
            { fileName: '5Concert_Screen.jpg', title: '콘서트 스크린' }
        ])
    },
    {
        id: 3,
        label: 'Solution 03',
        headline: '상업 및 소매',
        heroTitle: '상업 및 소매',
        description: '백화점, 소매점, 유흥업소, 기업체 등 다양한 상업 시설에서 많은 사람들을 끌어들이기 위해 사용됩니다.',
        secondHeroTitle: '쇼핑몰 LED 스크린',
        secondHeroDescription: '쇼핑몰 LED 디스플레이는 상품 가격, 행사 정보 표시뿐만 아니라 동적 광고 등을 재생하는 데에도 사용될 수 있습니다.',
        productsTitle: '상업 및 소매',
        ...generateSolutionImages('commercial_retail', [
            { fileName: '1Glass_Curtain_Wall_Screen.jpg', title: '유리 커튼월 스크린' },
            { fileName: '2Shopping_Mall Atrium_Screen.jpg', title: '백화점 아트리움 스크린' },
            { fileName: '3Shop_Show_Window_Screen.jpg', title: '상업지구 쇼윈도우 스크린' },
            { fileName: '4A_Stair_Screen.jpg', title: '계단 스크린' },
            { fileName: '5A_Shopping_Mall_Advertising_Screen.jpg', title: '백화점 광고 스크린' },
            { fileName: '6A_Circular_Screen.jpg', title: '백화점 라운드 스크린' }
        ])
    },
    {
        id: 4,
        label: 'Solution 04',
        headline: '회의실',
        heroTitle: '컨퍼런스 룸',
        description: '모든 종류의 현대 비즈니스 활동 및 스마트 회의실에서 사용되며, 회의를 위한 새로운 소통 및 디스플레이 방식을 제공합니다.',
        secondHeroTitle: 'COB 회의용 LED 스크린',
        secondHeroDescription: '회의실 LED 디스플레이는 현대 기업 및 조직의 회의 환경에서 중요한 역할을 합니다.',
        productsTitle: '회의실',
        ...generateSolutionImages('conference_room', [
            { fileName: '1A_Conference_Screen.jpg', title: '회의용 스크린' },
            { fileName: '2Large_Screen_HD_Conference_Screen.jpg', title: '대화면 HD 회의용 스크린' },
            { fileName: '3A_Large_Conference_Room_Screen.jpg', title: '대형 회의실 스크린' }
        ])
    },
    {
        id: 5,
        label: 'Solution 05',
        headline: '전시회',
        heroTitle: '전시회',
        description: '각종 전시관, 과학 기술 박물관, 일반 박물관, 전시관 등에서 사용되며, 눈길을 사로잡는 오브제가 되었습니다.',
        secondHeroTitle: '독창적인 모양의 LED 스크린',
        secondHeroDescription: '독특한 형태는 전시장에 풍부한 아름다움을 더합니다.',
        productsTitle: '전시회',
        ...generateSolutionImages('exhibition', [
            { fileName: '1Single_Wall_Screen.jpg', title: '단일 벽면 스크린' },
            { fileName: '2Multi_Wall_screen.jpg', title: '다중 벽면 스크린' },
            { fileName: '3A_Customized_Screen.jpg', title: '맞춤형 커스텀 스크린' },
            { fileName: '4Sky_Screen.jpg', title: '스카이 스크린' },
            { fileName: '5_Creative Screen.jpg', title: '크리에이티브 스크린' }
        ]),
        // 예외: secondHeroImage가 다른 패턴
        secondHeroImage: '/resources/solutionpage/exhibition/SecondHero.jpg'
    },
    {
        id: 6,
        label: 'Solution 06',
        headline: '스포츠',
        heroTitle: '스포츠',
        description: '주요 스포츠 경기장에서 라이브 이벤트, 즉시 득점, 광고 연동 등을 통해 경기에 시각적인 즐거움을 더하기 위해 사용됩니다.',
        secondHeroTitle: '스포츠 경기장 LED 스크린',
        secondHeroDescription: '경기장 주변에 설치되어 경기장 주변에 광고를 게재하는 데 사용됩니다.',
        productsTitle: '스포츠',
        ...generateSolutionImages('sports', [
            { fileName: '1A_Stadium_Broadcast_Screen.jpg', title: '경기장 방송 스크린' },
            { fileName: '2Stadium_Fence_Screen.jpg', title: '경기장 펜스 스크린' },
            { fileName: '3Stadium_Relay_Screen.jpg', title: '경기장 중계 스크린' }
        ]),
        // 예외: secondHeroImage가 다른 패턴
        secondHeroImage: '/resources/solutionpage/sports/SecondHero.jpg'
    },
    {
        id: 7,
        label: 'Solution 07',
        headline: '대중교통',
        heroTitle: '대중교통',
        description: '공항, 기차역, 지하철역, 버스 터미널, 고속도로 등 교통 관련 분야에서 사용되며 교통정보 및 광고를 게재할 수 있습니다.',
        secondHeroTitle: '지하철 광고 LED 스크린',
        secondHeroDescription: '지하철 LED 전광판은 유동 인구가 많은 최적의 위치에 설치되어 고화질 영상과 넓은 시야각을 제공합니다.',
        productsTitle: '대중교통',
        ...generateSolutionImages('transportation', [
            { fileName: '1Subway_Wall_Screen.jpg', title: '지하철 벽면 스크린' },
            { fileName: '2Subway_Advertising_Screen.jpg', title: '지하철 광고 스크린' },
            { fileName: '3Freeway_Screen.jpg', title: '고속도로 스크린' },
            { fileName: '4Bus_stop_screen.jpg', title: '버스 정류장 스크린' }
        ]),
        // 예외: secondHeroImage가 다른 패턴
        secondHeroImage: '/resources/solutionpage/transportation/SecondHero.jpg'
    },
    {
        id: 8,
        label: 'Solution 08',
        headline: '방송 및 영화',
        heroTitle: '방송 및 영화',
        description: '방송실, 라디오 및 텔레비전 방송 현장, 영화 및 기타 분야에서 더 나은 배경 화면 효과와 시청각적 즐거움을 위해 사용됩니다.',
        secondHeroTitle: '미디어 라이브 LED 디스플레이',
        secondHeroDescription: '이 제품은 높은 밝기와 낮은 회색조, 끊김 없는 화면 전환 등의 특징을 갖추고 있습니다.',
        productsTitle: '방송 및 영화',
        ...generateSolutionImages('broadcast_film', [
            { fileName: '1A_Screen_On_A_Movie_Set.jpg', title: '영화 세트장 스크린' },
            { fileName: '2A_Screen_On_A_Broadcast_Set.jpg', title: '방송 세트장 스크린' },
            { fileName: '3News_Desk_Screen.jpg', title: '뉴스데스크 스크린' }
        ]),
        // 예외: secondHeroImage가 다른 패턴
        secondHeroImage: '/resources/solutionpage/broadcast_film/SecondHero.jpg'
    }
];

// window 객체에 할당 (기존 호환성 유지)
window.solutionsData = solutionsData.reduce((acc, solution) => {
    acc[solution.id] = solution;
    return acc;
}, {});

// ============================================
// 헬퍼 함수
// ============================================

/**
 * 전체 솔루션 목록 가져오기
 * @returns {Array} 솔루션 배열
 */
function getAllSolutions() {
    return solutionsData.map(solution => ({
        id: solution.id,
        ...solution
    }));
}

/**
 * ID로 솔루션 찾기
 * @param {number|string} id - 솔루션 ID
 * @returns {object|null} 솔루션 객체 또는 null
 */
function findSolutionById(id) {
    return solutionsData.find(solution => solution.id === parseInt(id)) || null;
}

/**
 * 전체 솔루션 ID 목록 가져오기
 * @returns {Array} ID 배열
 */
function getAllSolutionIds() {
    return solutionsData.map(solution => solution.id);
}

/**
 * 솔루션 존재 여부 확인
 * @param {number|string} id - 솔루션 ID
 * @returns {boolean} 존재 여부
 */
function solutionExists(id) {
    return solutionsData.some(solution => solution.id === parseInt(id));
}

/**
 * 솔루션 개수 가져오기
 * @returns {number} 솔루션 개수
 */
function getSolutionCount() {
    return solutionsData.length;
}

// window 객체에 함수 할당 (전역 접근용)
window.findSolutionById = findSolutionById;
window.getAllSolutions = getAllSolutions;
window.getAllSolutionIds = getAllSolutionIds;
window.solutionExists = solutionExists;
window.getSolutionCount = getSolutionCount;
