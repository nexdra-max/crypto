// Ultra Modern Crypto Website JavaScript
class UltraModernCrypto {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.loadRealData();
        this.startDataRefresh();
    }

    init() {
        // 隐藏加载屏幕
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        }, 2000);

        // 初始化导航栏滚动效果
        this.initNavbarScroll();
        
        // 初始化粒子效果
        this.initParticles();
        
        // 初始化统计数字动画
        this.initCounterAnimation();
        
        // 初始化返回顶部按钮
        this.initBackToTop();
        
        // 初始化主题切换
        this.initThemeToggle();
    }

    setupEventListeners() {
        // 导航栏切换
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // 市场数据刷新
        const refreshBtn = document.getElementById('refreshMarket');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadRealData();
                this.animateRefreshButton(refreshBtn);
            });
        }

        // 标签页切换
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn);
            });
        });

        // 平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    initNavbarScroll() {
        const navbar = document.getElementById('navbar');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // 隐藏/显示导航栏
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
        });
    }

    initParticles() {
        const particlesContainer = document.getElementById('heroParticles');
        if (!particlesContainer) return;

        // 创建粒子
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: rgba(99, 102, 241, ${Math.random() * 0.5 + 0.2});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s infinite linear;
            `;
            particlesContainer.appendChild(particle);
        }

        // 添加粒子动画CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    initCounterAnimation() {
        const counters = document.querySelectorAll('[data-target]');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
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

    initBackToTop() {
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

    initThemeToggle() {
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

    async loadRealData() {
        try {
            // 显示加载状态
            this.showLoadingState();

            // 首先尝试从本地数据文件加载
            let data;
            try {
                const localResponse = await fetch('./data/real-market-data.json');
                if (localResponse.ok) {
                    data = await localResponse.json();
                    console.log('从本地数据加载成功');
                }
            } catch (localError) {
                console.log('本地数据加载失败，尝试API');
            }

            // 如果本地数据不可用，尝试API
            if (!data) {
                try {
                    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,ripple,cardano,solana,polkadot,chainlink,polygon,avalanche-2&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h', {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                        }
                    });
                    
                    if (response.ok) {
                        data = await response.json();
                        console.log('从API加载成功');
                    }
                } catch (apiError) {
                    console.log('API加载失败，使用备用数据');
                }
            }

            // 如果都失败了，使用备用数据
            if (!data) {
                data = this.getFallbackData();
                console.log('使用备用数据');
            }
            
            // 更新价格滚动条
            this.updatePriceTicker(data);
            
            // 更新英雄区域卡片
            this.updateHeroCryptoCards(data);
            
            // 更新市场网格
            this.updateMarketGrid(data);
            
            // 更新最后更新时间
            this.updateLastUpdateTime();
            
            // 隐藏加载状态
            this.hideLoadingState();

        } catch (error) {
            console.error('加载数据失败:', error);
            // 使用备用数据
            const fallbackData = this.getFallbackData();
            this.updatePriceTicker(fallbackData);
            this.updateHeroCryptoCards(fallbackData);
            this.updateMarketGrid(fallbackData);
            this.hideLoadingState();
        }
    }

    getFallbackData() {
        return [
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
            },
            {
                id: "polygon",
                symbol: "matic",
                name: "Polygon",
                image: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
                current_price: 1.23,
                market_cap: 12345678901,
                market_cap_rank: 9,
                total_volume: 987654321,
                price_change_percentage_24h: 2.67
            },
            {
                id: "avalanche-2",
                symbol: "avax",
                name: "Avalanche",
                image: "https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png",
                current_price: 45.67,
                market_cap: 18234567890,
                market_cap_rank: 10,
                total_volume: 1876543210,
                price_change_percentage_24h: -1.34
            }
        ];
    }

    updatePriceTicker(data) {
        const tickerContent = document.getElementById('tickerContent');
        if (!tickerContent) return;

        tickerContent.innerHTML = data.slice(0, 8).map(coin => `
            <div class="ticker-item">
                <span class="coin-name">${coin.symbol.toUpperCase()}</span>
                <span class="coin-price">$${this.formatPrice(coin.current_price)}</span>
                <span class="coin-change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
                    ${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%
                </span>
            </div>
        `).join('');
    }

    updateHeroCryptoCards(data) {
        const heroCryptoCards = document.getElementById('heroCryptoCards');
        if (!heroCryptoCards) return;

        const topCoins = data.slice(0, 4);
        heroCryptoCards.innerHTML = topCoins.map(coin => `
            <div class="crypto-card">
                <div class="card-header">
                    <img src="${coin.image}" alt="${coin.name}" class="coin-icon">
                    <div class="card-info">
                        <h4>${coin.name}</h4>
                        <span class="coin-symbol">${coin.symbol.toUpperCase()}</span>
                    </div>
                </div>
                <div class="card-data">
                    <div class="price">$${this.formatPrice(coin.current_price)}</div>
                    <div class="change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
                        ${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%
                    </div>
                </div>
                <div class="card-stats">
                    <div class="stat">
                        <span class="label">市值</span>
                        <span class="value">$${this.formatLargeNumber(coin.market_cap)}</span>
                    </div>
                    <div class="stat">
                        <span class="label">24h成交量</span>
                        <span class="value">$${this.formatLargeNumber(coin.total_volume)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateMarketGrid(data) {
        const marketGrid = document.getElementById('marketGrid');
        if (!marketGrid) return;

        marketGrid.innerHTML = data.map((coin, index) => `
            <div class="market-card" style="animation-delay: ${index * 0.1}s">
                <div class="market-header">
                    <div class="market-icon">
                        <img src="${coin.image}" alt="${coin.name}">
                    </div>
                    <div class="market-info">
                        <h3>${coin.name}</h3>
                        <span class="market-symbol">${coin.symbol.toUpperCase()}</span>
                    </div>
                    <div class="market-rank">#${coin.market_cap_rank}</div>
                </div>
                <div class="market-price">$${this.formatPrice(coin.current_price)}</div>
                <div class="market-change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
                    ${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%
                </div>
                <div class="market-stats">
                    <div class="stat">
                        <span class="label">市值</span>
                        <span class="value">$${this.formatLargeNumber(coin.market_cap)}</span>
                    </div>
                    <div class="stat">
                        <span class="label">24h成交量</span>
                        <span class="value">$${this.formatLargeNumber(coin.total_volume)}</span>
                    </div>
                </div>
                <div class="market-chart">
                    <canvas class="mini-chart" data-prices="${coin.price_change_percentage_24h}"></canvas>
                </div>
            </div>
        `).join('');

        // 初始化迷你图表
        this.initMiniCharts();
    }

    initMiniCharts() {
        const charts = document.querySelectorAll('.mini-chart');
        charts.forEach(chart => {
            const ctx = chart.getContext('2d');
            const change = parseFloat(chart.dataset.prices);
            
            // 生成模拟价格数据
            const data = this.generateMockPriceData(change);
            
            this.drawMiniChart(ctx, data, change >= 0);
        });
    }

    generateMockPriceData(change) {
        const points = 20;
        const data = [];
        let value = 100;
        
        for (let i = 0; i < points; i++) {
            const randomChange = (Math.random() - 0.5) * 5;
            const trendChange = (change / points) * 0.5;
            value += randomChange + trendChange;
            data.push(Math.max(value, 50));
        }
        
        return data;
    }

    drawMiniChart(ctx, data, isPositive) {
        const canvas = ctx.canvas;
        const width = canvas.width = 100;
        const height = canvas.height = 40;
        
        ctx.clearRect(0, 0, width, height);
        
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        
        // 绘制线条
        ctx.beginPath();
        ctx.strokeStyle = isPositive ? '#22c55e' : '#ef4444';
        ctx.lineWidth = 2;
        
        data.forEach((point, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((point - min) / range) * height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // 绘制填充区域
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, isPositive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    switchTab(activeBtn) {
        // 移除所有活动状态
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 添加活动状态到当前按钮
        activeBtn.classList.add('active');
        
        // 这里可以添加切换内容的逻辑
        const tab = activeBtn.dataset.tab;
        console.log('切换到标签页:', tab);
    }

    animateRefreshButton(btn) {
        const icon = btn.querySelector('i');
        icon.style.animation = 'spin 1s linear';
        
        setTimeout(() => {
            icon.style.animation = '';
        }, 1000);
    }

    updateLastUpdateTime() {
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (lastUpdateElement) {
            const now = new Date();
            lastUpdateElement.textContent = now.toLocaleTimeString('zh-CN');
        }
    }

    showLoadingState() {
        const marketGrid = document.getElementById('marketGrid');
        if (marketGrid) {
            marketGrid.style.opacity = '0.5';
        }
    }

    hideLoadingState() {
        const marketGrid = document.getElementById('marketGrid');
        if (marketGrid) {
            marketGrid.style.opacity = '1';
        }
    }

    showErrorState() {
        const marketGrid = document.getElementById('marketGrid');
        if (marketGrid) {
            marketGrid.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>数据加载失败</h3>
                    <p>请检查网络连接或稍后重试</p>
                    <button class="btn btn-primary" onclick="window.cryptoApp.loadRealData()">
                        <i class="fas fa-sync-alt"></i>
                        重新加载
                    </button>
                </div>
            `;
        }
    }

    startDataRefresh() {
        // 每30秒自动刷新数据
        setInterval(() => {
            this.loadRealData();
        }, 30000);
    }

    formatPrice(price) {
        if (price >= 1) {
            return price.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        } else {
            return price.toFixed(6);
        }
    }

    formatLargeNumber(num) {
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
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.cryptoApp = new UltraModernCrypto();
});

// 添加一些实用的工具函数
window.CryptoUtils = {
    // 计算投资回报率
    calculateROI: (initialInvestment, currentValue) => {
        return ((currentValue - initialInvestment) / initialInvestment) * 100;
    },

    // 计算仓位大小
    calculatePositionSize: (accountBalance, riskPercentage, entryPrice, stopLoss) => {
        const riskAmount = accountBalance * (riskPercentage / 100);
        const priceRisk = Math.abs(entryPrice - stopLoss);
        return riskAmount / priceRisk;
    },

    // 格式化百分比
    formatPercentage: (value, decimals = 2) => {
        return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
    },

    // 生成随机颜色
    generateRandomColor: () => {
        const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
};

// 添加全局错误处理
window.addEventListener('error', (event) => {
    console.error('全局错误:', event.error);
});

// 添加未处理的Promise拒绝处理
window.addEventListener('unhandledrejection', (event) => {
    console.error('未处理的Promise拒绝:', event.reason);
    event.preventDefault();
});