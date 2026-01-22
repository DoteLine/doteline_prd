/**
 * 제품 이미지 경로를 자동으로 생성하는 함수
 * @param {string} productName - 제품명(예 : Rental Indoor 500x500mm)
 * @param {number} detailImageCount - 상세 이미지 갯수 (기본값 7)
 * @returns {object} - bannerImage, images, thumbnail, detailImages 경로
 *
 */
function generateProductImages(productName, detailImageCount = 7) {
    // 제품명을 폴더명으로 변환 (공백은 언더바로, 소문자)
    const folderName = productName.toLowerCase().replace(/\s+/g, '_');

    // 제품명을 파일명으로 변환 (공백은 언더바, 대소문자 유지)
    const fileName = productName.replace(/\s+/g, '_');

    // 기본 경로
    const basePath = `/resources/productpage/${folderName}`;

    // 배너 이미지
    const bannerImage = `${basePath}/${fileName}_1_head_copy.webp`

    // 대표이미지 배열 생성 (총 5개: Product_Image, Product_Image1 ~ Product_Image4)
    const images = [
        `${basePath}/${fileName}_2_Product_Image.webp`,  // 첫 번째는 숫자 없음
        `${basePath}/${fileName}_2_Product_Image1.webp`,
        `${basePath}/${fileName}_2_Product_Image2.webp`,
        `${basePath}/${fileName}_2_Product_Image3.webp`,
        `${basePath}/${fileName}_2_Product_Image4.webp`
    ];


    // 썸네일
    const thumbnail = images[0];

    // 상세이미지 배열 생성
    const detailImages = [
        `${basePath}/${fileName}_3_Product_Key_Descriptions.webp`,
    ];

    // 4-7번 이미지까지 상세이미지 중 Product_Advantages
    const advantagesCount = detailImageCount -3;
    for(let i = 0; i < advantagesCount; i++) {
        detailImages.push(`${basePath}/${fileName}_${4+i}_Product_Advantages.webp`);
    }

    // 상세이미지 중 8,9번
    detailImages.push(`${basePath}/${fileName}_${4 + advantagesCount}_Product_Specifications.webp`);
    detailImages.push(`${basePath}/${fileName}_${5 + advantagesCount}_Product_usage_photos.webp`);

    return {
        bannerImage,
        images,
        thumbnail,
        detailImages
    };
}


// 제품 데이터 관리
const productsData = {
    rental : [
        {
            id : 11, 
            name: 'Rental Indoor 500x500mm', 
            category: 'rental',
            ...generateProductImages('Rental Indoor 500x500mm', 7),
            specs: {
                options: ['P1.953', 'P2.5', 'P2.604', 'P2.976', 'P3.91'],
                tags: ['LED Screen', 'LED Display'],
                description: '익스트림 HD',
            }
        },
        {
            id : 12, 
            name: 'Rental Indoor 500x1000mm', 
            category: 'rental',
            ...generateProductImages('Rental Indoor 500x1000mm', 7),
            specs: {
                options: ['P1.953', 'P2.5', 'P2.604', 'P2.976', 'P3.91'],
                tags: ['LED Screen', 'LED Display'],
                description: '익스트림 HD',
            }
        },
        {
            id : 13, 
            name: 'Rental Outdoor 500x500mm', 
            category: 'rental',
            ...generateProductImages('Rental Outdoor 500x500mm', 7),
            specs: {
                options: ['P2.976', 'P3.91', 'P4.81'],
                tags: ['LED Screen', 'LED Display'],
                description: '익스트림 HD',
            }
        },
        {
            id : 14, 
            name: 'Rental Outdoor 500x1000mm', 
            category: 'rental',
            ...generateProductImages('Rental Outdoor 500x1000mm', 7),
            specs: {
                options: ['P2.976', 'P3.91', 'P4.81'],
                tags: ['LED Screen', 'LED Display'],
                description: '익스트림 HD',
            }
        },
        {
            id : 15,
            name: 'Rental Curved 500x1000mm',
            category: 'rental',
            ...generateProductImages('Rental Curved 500x1000mm', 7),
            specs: {
                options: ['P2.976', 'P3.91', 'P4.81'],
                tags: ['LED Screen', 'LED Display'],
                description: '익스트림 HD',
            }
        },
        {
            id : 16,
            name: 'Rental Curved 500x500mm',
            category: 'rental',
            ...generateProductImages('Rental Curved 500x500mm', 7),
            specs: {
                options: ['P2.976', 'P3.91', 'P4.81'],
                tags: ['LED Screen', 'LED Display'],
                description: '익스트림 HD',
            }
        }
    ],
    outdoor : [
        {
            id : 21,
            name: 'Outdoor Die-casting',
            category: 'outdoor',
            ...generateProductImages('Outdoor Die-casting', 7),
            specs: {
                options: ['P2.976', 'P3.91', 'P4.81'],
                tags: ['LED Screen', 'LED Display'],
                description: '익스트림 HD',
            }
        },
        {
            id : 22,
            name: 'Outdoor Simple',
            category: 'outdoor',
            ...generateProductImages('Outdoor Simple', 7),
            specs: {
                options: ['P2', 'P2.5', 'P3', 'P4', 'P5', 'P6', 'P8', 'P10'],
                tags: ['LED Screen', 'LED Display'],
                description: '익스트림 HD',
            }
        },
        {
            id : 23,
            name: 'Outdoor Standard',
            category: 'outdoor',
            ...generateProductImages('Outdoor Standard', 7),
            specs: {
                options: ['P2', 'P2.5', 'P3', 'P4', 'P5', 'P6', 'P8', 'P10'],
                tags: ['LED Screen', 'LED Display'],
                description: '익스트림 HD',
            }
        },
        {
            id : 24,
            name: 'Stadium Screen',
            category: 'outdoor',
            ...generateProductImages('Stadium Screen', 7),
            specs: {
                options: ['P4', 'P5', 'P6.67', 'P8', 'P10', 'P13.33'],
                tags: ['LED Screen', 'LED Display'],
                description: '익스트림 HD',
            }
        }
    ],
    indoor : [
        {
            id : 31,
            name: 'GOB Waterproof',
            category: 'indoor',
            ...generateProductImages('GOB Waterproof', 12),
            specs: {
                options: ['P1.25', 'P1.53', 'P1.86', 'P2', 'P2.5', 'P3.076', 'P4'],
                tags: ['LED Screen', 'LED Display'],
                description: '익스트림 HD',
            }
        },
        {
            id : 32,
            name: '16-9 Golden Ratio',
            category: 'indoor',
            ...generateProductImages('16-9 Golden Ratio', 12),
            specs: {
                options: ['P1.25', 'P1.53', 'P1.86', 'P2', 'P2.5'],
                tags: ['LED Screen', 'LED Display'],
                description: '익스트림 HD',
            }
        },
        {
            id : 33,
            name: 'Indoor Die-casting',
            category: 'indoor',
            ...generateProductImages('Indoor Die-casting', 18),
            specs: {
                options: ['P1.25', 'P1.53', 'P1.86', 'P2', 'P2.5', 'P3.076', 'P4'],
                tags: ['LED Screen', 'LED Display'],
                description: '익스트림 HD',
            }
        },
        {
            id : 34,
            name: 'Indoor Aluminum',
            category: 'indoor',
            ...generateProductImages('Indoor Aluminum', 12),
            specs: {
                options: ['P1.25', 'P1.53', 'P1.86', 'P2', 'P2.5', 'P3.076', 'P4'],
                tags: ['LED Screen', 'LED Display'],
                description: '익스트림 HD',
            }
        },
        {
            id : 35,
            name: 'Indoor Flexible',
            category: 'indoor',
            ...generateProductImages('Indoor Flexible', 12),
            specs: {
                options: ['P1.25', 'P1.53', 'P1.86', 'P2', 'P2.5', 'P3.076', 'P4'],
                tags: ['LED Screen', 'LED Display'],
                description: '익스트림 HD',
            }
        },
        {
            id : 36,
            name: 'Indoor Standard',
            category: 'indoor',
            ...generateProductImages('Indoor Standard', 12),
            specs: {
                options: ['P1.25', 'P1.53', 'P1.86', 'P2', 'P2.5', 'P3.076', 'P4'],
                tags: ['LED Screen', 'LED Display'],
                description: '익스트림 HD',
            }
        }
    
    ],
    cob : [
        {
            id : 41,
            name: 'COB_P0.7',
            category: 'cob',
            ...generateProductImages('COB_P0.7', 7),
            specs: {
                options: ['Extreme HD', '16:9 ratio', 'high gray scale'],
                tags: ['LED Screen', 'LED Display'],
                description: '익스트림 HD',
            }
        },
        {
            id : 42,
            name: 'COB_P0.9',
            category: 'cob',
            ...generateProductImages('COB_P0.9', 7),
            specs: {
                options: ['Extreme HD', '16:9 ratio', 'high gray scale'],
                tags: ['LED Screen', 'LED Display'],
                description: '익스트림 HD',
            }
        },
        {
            id : 41,
            name: 'COB_P1.2',
            category: 'cob',
            ...generateProductImages('COB_P1.2', 7),
            specs: {
                options: ['Extreme HD', '16:9 ratio', 'high gray scale'],
                tags: ['LED Screen', 'LED Display'],
                description: '익스트림 HD',
            }
        }
    ],
};

// 전체 제품 가져오기
function getAllProducts() {
    return [
        ...productsData.rental,
        ...productsData.outdoor,
        ...productsData.indoor,
        ...productsData.cob,
    ];
}

// ID로 제품 찾기
function findProductById(id) {
    const allProducts = getAllProducts();
    return allProducts.find(product => product.id === parseInt(id));
}

// 카테고리별 제품 가져오기
function getProductsByCategory(category) {
    if(category === 'all') {
        return getAllProducts();
    }
    return productsData[category] || [];
}

// 카테고리 한글명
function getCategoryName(category) {
    const categoryNames = {
        'rental' : '임대용',
        'outdoor' : '야외용',
        'indoor' : '실내용',
        'cob' : 'COB LED',
    };
    return categoryNames[category] || category;
}
