if (window.location.pathname === '/') {
    var script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    script.onload = function () {
        console.log('jQuery ready');

        $('.carousel-container').remove();
        $('.custom-carousel-style').remove();

        const SWIPE_THRESHOLD = 40;
        let currentIndex = 0;
        let startX = 0;
        let endX = 0;

        const init = async () => {
            await fetchData();
            builHtml();
            buildCss();
            setEventListeners();
        };

        const calculateDiscount = (original, discounted) => {
            const discount = 100 * (original - discounted) / original;
            return discount.toFixed(0);
        };

        const buildProducts = () => {
            const products = JSON.parse(localStorage.getItem('carousel-data')) || [];
            const favorites = JSON.parse(localStorage.getItem('carousel-favorites')) || [];

            const productCards = products.map(product => {
                const isFavourite = favorites.includes(Number(product.id));

                const icon = isFavourite
                    ? `
                        <img class='carousel-favorite-icon-filled' src='https://www.e-bebek.com/assets/svg/added-favorite.svg' alt=favorite-icon>
                        <img class='carousel-favorite-icon-hover' src='https://www.e-bebek.com/assets/svg/added-favorite-hover.svg' alt=favorite-icon>
                    `
                    : ` 
                        <img class='carousel-favorite-icon-default' src='https://www.e-bebek.com/assets/svg/default-favorite.svg' alt=favorite-icon>
                        <img class='carousel-favorite-icon-hover' src='https://www.e-bebek.com/assets/svg/default-hover-favorite.svg' alt=favorite-icon>
                    `;

                const discount = calculateDiscount(product.original_price, product.price);

                const productPrice = discount !== '0'
                    ? `
                        <div class='carousel-product-card-discount-container'>
                            <span class='carousel-product-card-old-price'>${String(product.original_price).replace('.', ',')}</span>
                            <span class='carousel-product-card-discount-badge'>
                                %${discount}
                            </span>
                        </div>
                        <span class='carousel-product-card-price carousel-product-card-discount-price'>${String(product.price).replace('.', ',')} TL</span>
                    `
                    : `
                        <span class='carousel-product-card-price'>${String(product.original_price).replace('.', ',')} TL</span>
                    `;



                return `
                <div class='carousel-slider-item'>
                    <div class='carousel-product-card' product-id=${product.id}>
                        <a class='carousel-product-card-anchor' href=${product.url} target='_blank'>
                            <img class='carousel-product-card-img' src=${product.img} alt=${product.name}>

                            <div class='carousel-product-card-description'>
                                <h2 class='carousel-product-card-title'>
                                    <b>${product.brand} - </b>
                                    <span>${product.name}</span>
                                </h2>

                                <div class='product-rating'>
                                    <i class="fas fa-star product-rating-star"></i>
                                    <i class="fas fa-star product-rating-star"></i>
                                    <i class="fas fa-star product-rating-star"></i>
                                    <i class="fas fa-star product-rating-star"></i>
                                    <i class="fas fa-star product-rating-star"></i>
                                </div>

                                <div class='carousel-product-card-price-container'>
                                    ${productPrice}
                                </div>
                            </div>

                            <div class='carousel-favorite-badge'>
                                ${icon}
                            </div>
                        </a>

                        <div class='carousel-product-card-action'>
                            <button class='carousel-product-card-button'>Sepete Ekle</button>
                        </div>
                    </div>
                </div>
            `;
            }).join('');

            return productCards;
        }

        const builHtml = () => {
            const productCards = buildProducts();

            const html = `
            <div class='carousel-container'>
                <div class='carousel-header'>
                    <h2 class='carousel-header-title'>Beğenebileceğinizi düşündüklerimiz</h2>
                </div>
                <div class='carousel-content'>
                    <div class='carousel-wrapper'>
                        <div class='carousel-slider'>
                            ${productCards}
                        </div>
                    </div>
                    <button class='slider-button slider-prev'></button>
                    <button class='slider-button slider-next'></button>
                </div>
            </div>
        `;

            $('eb-product-carousel:first').before(html);
        };

        const buildCss = () => {
            const css = `
            .carousel-container {
                max-width: 1320px;
                height: max-content;
                background-color: #fff;
                padding: 0px 15px;
                margin-bottom: 50px;
            }

            .carousel-header {
                padding: 25px 67px;
                border-top-left-radius: 35px;
                border-top-right-radius: 35px;
                background-color: #fef6eb;
            }
            
            .carousel-header-title {
                color: #f28e00;
                font-family: Quicksand-Bold;
                font-weight: 700;
                font-size: 3rem;
                line-height: 1.11;
                margin: 0;
            }

            .carousel-content {
                box-shadow: 15px 15px 30px 0 #ebebeb80;
                background-color: #fff;
                border-bottom-left-radius: 35px;
                border-bottom-right-radius: 35px;
                position: relative;
            }

            .carousel-wrapper {
                overflow: hidden;
                padding: 20px 0;
                border-radius: 40px;
            }

            .carousel-slider {
                width: max-content;
                display: flex;
                transition: transform 0.25s ease;
            }

            .carousel-slider-item {
                height: max-content;
                width: 242px;
                margin-right: 20px;
            }

            .carousel-product-card {
                border: 1px solid #ededed;
                display: flex;
                flex-direction: column;
                padding: 5px;
                margin-left: 3px;
                font-family: Poppins, "cursive";
                border-radius: 10px;
                font-size: 12px;
                position: relative;
                width: 100%;
            }

            .carousel-product-card:hover {
                box-shadow: 0 0 0 0 #00000030, inset 0 0 0 3px #f28e00;
            }

            .carousel-product-card-anchor {
                height: max-content;
                text-decoration: none;
                cursor: pointer;
                color: #7d7d7d;
                display: flex;
                flex-direction: column;
            }

            .carousel-product-card-anchor:hover {
                color: #7d7d7d;
            }

            .carousel-product-card-img {
                height: 203px;
                width: 230px;
                object-fit: contain;
                margin-bottom: 65px;
            }
            
            .carousel-product-card-description {
                padding: 0px 17px 13px;
                margin-bottom: 70px;
            }

            .carousel-product-card-title {
                margin-bottom: 10px;
                font-weight: 500;
                font-size: 1.2rem;
                height: 42px;
            }

            .product-rating {
                height: max-content;
                padding: 5px 0 15px;
                margin-bottom: 4.8px
            }

            .product-rating-star {
                font-size: 14px;
                color: #e9e9e9;
                margin-right: 5px;
            }

            .carousel-product-card-price-container {
                position: relative;
                display: flex;
                justify-content: flex-end;
                flex-direction: column;
                height: 43px;
            }

            .carousel-product-card-discount-container {
                display: flex;
                align-items: center;
            }

            .carousel-product-card-old-price {
                font-size: 1.4rem;
                font-weight: 500;
                text-decoration: line-through;
            }

            .carousel-product-card-discount-badge {
                color: #00a365;
                font-size: 18px;
                font-weight: 700;
                display: inline-flex;
                justify-content: center;
                margin-left: .5rem;
            }

            .carousel-product-card-discount-price {
                color: #00a365;
            }
                
            .carousel-product-card-price {
                font-size: 2.2rem;
                font-weight: 600;
            }
                 
            .carousel-product-card-action {
                padding: 0 17px 13px;
                display: flex;
                justify-content: flex-end;
                flex-direction: column;
                height: 56px;
            }

            .carousel-product-card-button {
                padding: 15px 20px;
                border-radius: 37.5px;
                background-color: #fff7ec;
                color: #f28e00;
                font-family: Poppins, "cursive";
                font-size: 1.4rem;
                font-weight: 700;
                width: 100%;
                margin-top: 19px;
                transition: color .15s ease-in-out, background-color .15s ease-in-out;
            }

            .carousel-product-card-button:hover {
                background-color: #f28e00;
                color: #fff;
            }

            .carousel-favorite-badge {
                right: 15px;
                top: 10px;
                position: absolute;
                cursor: pointer;
                background-color: #fff;
                border-radius: 50%;
                box-shadow: 0 2px 4px 0 #00000024;
                width: 50px;
                height: 50px;
            }

            .carousel-favorite-badge:hover .carousel-favorite-icon-default {
                display: none;
            }

            .carousel-favorite-badge:hover .carousel-favorite-icon-filled {
                display: none;
            }

            .carousel-favorite-badge:hover .carousel-favorite-icon-hover {
                display: block;
                transition: opacity .3s ease-in-out;
            }

            .carousel-favorite-icon-default {
                width: 25px;
                height: 25px;
                position: absolute;
                top: 13px;
                right: 12px;
                transition: opacity .3s ease-in-out;
            }

            .carousel-favorite-icon-hover {
                display: none;
            }

            .carousel-favorite-icon-filled {
                display: block;
                transition: opacity .3s ease-in-out;
            }

            .carousel-favorite-icon-filled:hover {
                display: none;
            }

            .slider-button {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                position: absolute;
                bottom: 50%;
                top: auto;
                background-color: #fef6eb !important;
                background-position: 18px !important;
                border: 1px solid transparent;
            }

            .slider-prev {
                background: url(https://cdn06.e-bebek.com/assets/svg/prev.svg) no-repeat;
                left: -65px;
            }

            .slider-prev:hover {
                background-color: #fff !important;
                border: 1px solid #f28e00;
            }

            .slider-next {
                background: url(https://cdn06.e-bebek.com/assets/svg/next.svg) no-repeat;
                right: -65px;
            }

            .slider-next:hover {
                background-color: #fff !important;
                border: 1px solid #f28e00;
            }

            @media screen and (max-width: 415px) {
                .carousel-product-card-discount-badge {
                    font-size: 12px;
                }
            }
            
            @media screen and (max-width: 480px) {
                .carousel-container {
                    margin-bottom: 0;
                }

                .carousel-header {
                    padding: 0 22px 0 10px;
                    background-color: #fff;
                }

                .carousel-header-title {
                    font-size: 2.2rem;
                    line-height: 1.5;
                }

                .carousel-content {
                    box-shadow: none;
                }

                .carousel-wrapper {
                    border-radius: 0;
                    padding: 20px 0 30px;
                }

                .carousel-slider-item {
                    margin-bottom: 16px;
                }

                .carousel-product-card {
                    padding: 8px;
                }

                .carousel-product-card-img {
                    height: 150px;
                    width: 100%;
                }

                .product-rating-star {
                    font-size: 11px;
                }

                .carousel-product-card-price {
                    font-size: 1.8rem;
                }

                .carousel-product-card-action {
                    padding: 0 10px 10px;
                }

                .carousel-product-card-button {
                    padding: 10px;
                }
            }

            @media screen and (max-width: 575px) {
                .carousel-container {
                    max-width: 100vw;
                }

                .carousel-slider-item {
                    width: calc((100vw - 50px) / 2);
                }
            }
            
            @media screen and (min-width: 576px) {
                .carousel-container {
                    max-width: 540px;
                }
                    
                .carousel-slider-item {
                    width: 245px;
                }
            }

            @media screen and (min-width: 768px) {
                .carousel-container {
                    max-width: 720px;
                }

                .carousel-slider-item {
                    width: 335px;
                }
            }

            @media screen and (max-width: 991px) {
                .carousel-favorite-badge, .carousel-favorite-icon-filled, .carousel-favorite-icon-hover {
                    width: 42px;
                    height: 42px;
                }

                .carousel-favorite-icon-default {
                    top: 11px ;
                    width: 20px;
                    height: 20px;
                }
            }

            @media screen and (min-width: 992px) {
                .carousel-container {
                    max-width: 960px;
                }
                    
                .carousel-slider-item {
                    width: 296.667px;
                }
            }

            @media screen and (min-width: 1280px) {
                .carousel-container {
                    max-width: 1180px;
                }

                .carousel-slider-item {
                    width: 272.5px;
                }
            }

            @media screen and (min-width: 1480px) {
                .carousel-container {
                    max-width: 1296px;
                }
                
                .carousel-slider-item {
                    width: 237.2px;
                }
            }
                
            @media screen and (min-width: 1580px) {
                .carousel-container {
                    max-width: 1320px;
                }

                .carousel-slider-item {
                    width: 242px;
                }
            }
        `;

            $('<style>').addClass('custom-carousel-style').html(css).appendTo('head');
        };

        const getDisplayCount = () => {
            const width = $(window).width();
            if (width >= 1480) return 5;
            if (width >= 1280) return 4;
            if (width >= 992) return 3;
            return 2;
        };

        let displayCount = getDisplayCount();

        const setEventListeners = () => {
            $(document).on('click', '.carousel-favorite-badge', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const favorites = JSON.parse(localStorage.getItem('carousel-favorites')) || [];
                const productId = Number($(e.target).closest('.carousel-product-card').attr('product-id'));

                if (!productId) {
                    console.log('No product found');
                    return;
                }

                const favoriteIndex = favorites.indexOf(productId);

                if (favoriteIndex !== -1) {
                    favorites.splice(favoriteIndex, 1);
                } else {
                    favorites.push(productId);
                }

                localStorage.setItem('carousel-favorites', JSON.stringify(favorites));

                const favoriteBadge = $(e.target).closest('.carousel-favorite-badge');

                const icon = favorites.includes(productId)
                    ? `
                    <img class='carousel-favorite-icon-filled' src='https://www.e-bebek.com/assets/svg/added-favorite.svg' alt=favorite-icon>
                    <img class='carousel-favorite-icon-hover' src='https://www.e-bebek.com/assets/svg/added-favorite-hover.svg' alt=favorite-icon>
                `
                    : ` 
                    <img class='carousel-favorite-icon-default' src='https://www.e-bebek.com/assets/svg/default-favorite.svg' alt=favorite-icon>
                    <img class='carousel-favorite-icon-hover' src='https://www.e-bebek.com/assets/svg/default-hover-favorite.svg' alt=favorite-icon>
                `
                favoriteBadge.html(icon);
            });

            $(window).on('resize', () => {
                displayCount = getDisplayCount();
            });

            $(document).on('click', '.slider-prev', () => moveSlider(-1));
            $(document).on('click', '.slider-next', () => moveSlider(1));

            $(document).on('touchstart', '.carousel-slider', (e) => {
                startX = e.originalEvent.touches[0].clientX;
            });
            $(document).on('touchmove', '.carousel-slider', (e) => {
                endX = e.originalEvent.touches[0].clientX;
            });
            $(document).on('touchend', '.carousel-slider', () => {
                const diff = startX - endX;

                if (diff > SWIPE_THRESHOLD) {
                    moveSlider(1);

                } else if (diff < -SWIPE_THRESHOLD) {
                    moveSlider(-1);
                }

                startX = 0;
                endX = 0;
            });
        };

        const moveSlider = (direction) => {
            const itemsCount = 8;
            const slider = $('.carousel-slider');
            const sliderWidth = $('.carousel-slider-item').outerWidth(true);

            if (direction === 1 && currentIndex < itemsCount - displayCount) {
                currentIndex++;
                slider.css('transform', `translateX(-${currentIndex * sliderWidth}px)`);

            } else if (direction === -1 && currentIndex > 0) {
                currentIndex--;
                slider.css('transform', `translateX(-${currentIndex * sliderWidth}px)`);
            }
        };

        const fetchData = async () => {
            const data = JSON.parse(localStorage.getItem('carousel-data')) || [];

            if (!data || data.length === 0) {
                const productDdata = await fetch('https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json');
                const products = await productDdata.json();

                localStorage.setItem('carousel-data', JSON.stringify(products));
            }
        };

        init();
    };

    document.head.appendChild(script);

} else {
    console.log('Wrong Page');
}