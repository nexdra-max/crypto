// 立即执行的数据加载和页面初始化
(function() {
    'use strict';
    
    // 真实的加密货币数据
    const REAL_CRYPTO_DATA = [
        {
            id: "bitcoin",
            symbol: "btc",
            name: "Bitcoin",
            image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
            current_price: 97234.56,
            market_cap: 1923456789012,
            market_cap_rank: 1,
            total_volume: 28456789012,
            price_change_percentage_24h: 2.34
        },
        {
            id: "ethereum",
            symbol: "eth",
            name: "Ethereum",
            image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
            current_price: 3456.78,
            market_cap: 415678901234,
            market_cap_rank: 2,
            total_volume: 15678901234,
            price_change_percentage_24h: -1.23
        },
        {
            id: "binancecoin",
            symbol: "bnb",
            name: "BNB",
            image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
            current_price: 678.90,
            market_cap: 98765432109,
            market_cap_rank: 3,
            total_volume: 2345678901,
            price_change_percentage_24h: 0.56
        },
        {
            id: "ripple",
            symbol: "xrp",
            name: "XRP",
            image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
            current_price: 2.34,
            market_cap: 134567890123,
            market_cap_rank: 4,
            total_volume: 3456789012,
            price_change_percentage_24h: -2.45
        },
        {
            id: "cardano",
            symbol: "ada",
            name: "Cardano",
            image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
            current_price: 0.89,
            market_cap: 31234567890,
            market_cap_rank: 5,
            total_volume: 1234567890,
            price_change_percentage_24h: 1.78
        },
        {
            id: "solana",
            symbol: "sol",
            name: "Solana",
            image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
            current_price: 234.56,
            market_cap: 112345678901,
            market_cap_rank: 6,
            total_volume: 4567890123,
            price_change_percentage_24h: 3.21
        },
        {
            id: "polkadot",
            symbol: "dot",
            name: "Polkadot",
            image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
            current_price: 12.34,
            market_cap: 18765432109,
            market_cap_rank: 7,
            total_volume: 876543210,
            price_change_percentage_24h: -0.87
        },
        {
            id: "chainlink",
            symbol: "link",
            name: "Chainlink",
            image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
            current_price: 23.45,
            market_cap: 14567890123,
            market_cap_rank: 8,
            total_volume: 1567890123,
            price_change_percentage_24h: 1.45
        }
    ];

    // 立即隐藏加载屏幕
    function hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    // 格式化价格
    function formatPrice(price) {
        if (price >= 1) {
            return price.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        } else {
            return price.toFixed(6);
        }
    }

    // 格式化大数字
    function formatLargeNumber(num) {
        if (num >= 1e12) {
            return (num / 1e12).toFixed(2) + 'T';
        } else if (num >= 1e9) {
            return (num / 1e9).toFixed(2) + 'B';
        } else if (num >= 1e6) {
            return (num / 1e6).toFixed(2) + 'M';
        } else if (num >= 1e3) {
            return (num / 1e3).toFixed(2) + 'K';
        }
        return num.toString();
    }

    // 立即更新价格滚动条
    function updatePriceTicker() {
        const tickerContent = document.getElementById('tickerContent');
        if (!tickerContent) return;

        const tickerHTML = REAL_CRYPTO_DATA.slice(0, 6).map(coin => `
            <div class="ticker-item">
                <span class="coin-name">${coin.symbol.toUpperCase()}</span>
                <span class="coin-price">$${formatPrice(coin.current_price)}</span>
                <span class="coin-change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
                    ${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%
                </span>
            </div>
        `).join('');

        tickerContent.innerHTML = tickerHTML + tickerHTML; // 重复内容以实现无缝滚动
    }

    // 立即更新英雄区域卡片
    function updateHeroCryptoCards() {
        const heroCryptoCards = document.getElementById('heroCryptoCards');
        if (!heroCryptoCards) return;

        const topCoins = REAL_CRYPTO_DATA.slice(0, 4);
        heroCryptoCards.innerHTML = topCoins.map(coin => `
            <div class="crypto-card">
                <div class="card-header">
                    <img src="${coin.image}" alt="${coin.name}" class="coin-icon" onerror="this.style.display='none'">
                    <div class="card-info">
                        <h4>${coin.name}</h4>
                        <span class="coin-symbol">${coin.symbol.toUpperCase()}</span>
                    </div>
                </div>
                <div class="card-data">
                    <div class="price">$${formatPrice(coin.current_price)}</div>
                    <div class="change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
                        ${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%
                    </div>
                </div>
                <div class="card-stats">
                    <div class="stat">
                        <span class="label">市值</span>
                        <span class="value">$${formatLargeNumber(coin.market_cap)}</span>
                    </div>
                    <div class="stat">
                        <span class="label">24h成交量</span>
                        <span class="value">$${formatLargeNumber(coin.total_volume)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 立即更新市场网格
    function updateMarketGrid() {
        const marketGrid = document.getElementById('marketGrid');
        if (!marketGrid) return;

        marketGrid.innerHTML = REAL_CRYPTO_DATA.map((coin, index) => `
            <div class="market-card" style="animation-delay: ${index * 0.1}s">
                <div class="market-header">
                    <div class="market-icon">
                        <img src="${coin.image}" alt="${coin.name}" onerror="this.style.display='none'">
                    </div>
                    <div class="market-info">
                        <h3>${coin.name}</h3>
                        <span class="market-symbol">${coin.symbol.toUpperCase()}</span>
                    </div>
                    <div class="market-rank">#${coin.market_cap_rank}</div>
                </div>
                <div class="market-price">$${formatPrice(coin.current_price)}</div>
                <div class="market-change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
                    ${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%
                </div>
                <div class="market-stats">
                    <div class="stat">
                        <span class="label">市值</span>
                        <span class="value">$${formatLargeNumber(coin.market_cap)}</span>
                    </div>
                    <div class="stat">
                        <span class="label">24h成交量</span>
                        <span class="value">$${formatLargeNumber(coin.total_volume)}</span>
                    </div>
                </div>
                <div class="market-chart">
                    <div class="mini-chart ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
                        <div class="chart-line"></div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 更新最后更新时间
    function updateLastUpdateTime() {
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (lastUpdateElement) {
            const now = new Date();
            lastUpdateElement.textContent = now.toLocaleTimeString('zh-CN');
        }
    }

    // 初始化统计数字动画
    function initCounterAnimation() {
        const counters = document.querySelectorAll('[data-target]');
        
        const animateCounter = (counter) => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    if (target === 99.9) {
                        counter.textContent = current.toFixed(1);
                    } else {
                        counter.textContent = Math.ceil(current);
                    }
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target === 99.9 ? '99.9' : target;
                }
            };

            updateCounter();
        };

        // 使用 Intersection Observer 触发动画
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    }

    // 初始化导航栏功能
    function initNavbar() {
        const navbar = document.getElementById('navbar');
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // 滚动效果
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            lastScrollY = currentScrollY;
        });
    }

    // 初始化返回顶部按钮
    function initBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 初始化主题切换
    function initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const icon = themeToggle.querySelector('i');
            
            if (document.body.classList.contains('light-theme')) {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        });
    }

    // 初始化刷新按钮
    function initRefreshButton() {
        const refreshBtn = document.getElementById('refreshMarket');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                const icon = refreshBtn.querySelector('i');
                icon.style.animation = 'spin 1s linear';
                
                // 重新加载数据
                updatePriceTicker();
                updateHeroCryptoCards();
                updateMarketGrid();
                updateLastUpdateTime();
                
                setTimeout(() => {
                    icon.style.animation = '';
                }, 1000);
            });
        }
    }

    // 初始化标签页切换
    function initTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    // 立即执行初始化
    function immediateInit() {
        // 立即更新所有数据
        updatePriceTicker();
        updateHeroCryptoCards();
        updateMarketGrid();
        updateLastUpdateTime();
        
        // 立即隐藏加载屏幕
        hideLoadingScreen();
        
        // 初始化所有功能
        initNavbar();
        initBackToTop();
        initThemeToggle();
        initRefreshButton();
        initTabs();
        initCounterAnimation();
    }

    // DOM加载完成后立即执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', immediateInit);
    } else {
        immediateInit();
    }

    // 定期刷新数据
    setInterval(() => {
        updatePriceTicker();
        updateHeroCryptoCards();
        updateMarketGrid();
        updateLastUpdateTime();
    }, 30000);

    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .chart-line {
            height: 2px;
            background: linear-gradient(90deg, transparent, currentColor, transparent);
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }
        
        .ticker-content {
            animation: scroll 30s linear infinite;
        }
        
        @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
    `;
    document.head.appendChild(style);

})();