/**
 * 增强功能JavaScript - 提供更丰富的交互体验
 */

class CryptoWebsiteEnhancer {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.startRealTimeUpdates();
    }

    init() {
        console.log('🚀 初始化增强功能...');
        this.addLoadingAnimations();
        this.setupNavbarEffects();
        this.initializeCounters();
        this.setupSearchFunctionality();
        this.initializeNotifications();
    }

    // 添加加载动画
    addLoadingAnimations() {
        // 为所有卡片添加淡入动画
        const cards = document.querySelectorAll('.card, .news-card, .arbitrage-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // 导航栏滚动效果
    setupNavbarEffects() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // 向下滚动时隐藏导航栏，向上滚动时显示
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }

    // 初始化数字计数器动画
    initializeCounters() {
        const counters = document.querySelectorAll('.hero-stat-number');
        
        const animateCounter = (element, target) => {
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current).toLocaleString();
            }, 20);
        };

        // 使用Intersection Observer来触发动画
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.target) || 0;
                    animateCounter(entry.target, target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    // 搜索功能
    setupSearchFunctionality() {
        // 创建搜索框
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div class="search-box">
                <input type="text" id="crypto-search" placeholder="搜索加密货币..." class="search-input">
                <button class="search-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                </button>
            </div>
            <div class="search-results" id="search-results"></div>
        `;

        // 将搜索框添加到导航栏
        const navbar = document.querySelector('.navbar .container');
        if (navbar) {
            navbar.appendChild(searchContainer);
        }

        // 搜索功能实现
        const searchInput = document.getElementById('crypto-search');
        const searchResults = document.getElementById('search-results');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                if (query.length < 2) {
                    searchResults.style.display = 'none';
                    return;
                }

                this.performSearch(query, searchResults);
            });

            // 点击外部关闭搜索结果
            document.addEventListener('click', (e) => {
                if (!searchContainer.contains(e.target)) {
                    searchResults.style.display = 'none';
                }
            });
        }
    }

    // 执行搜索
    async performSearch(query, resultsContainer) {
        try {
            // 从本地数据搜索
            const marketData = await this.loadMarketData();
            const results = marketData.filter(coin => 
                coin.name.toLowerCase().includes(query) ||
                coin.symbol.toLowerCase().includes(query) ||
                (coin.chinese_name && coin.chinese_name.includes(query))
            ).slice(0, 5);

            this.displaySearchResults(results, resultsContainer);
        } catch (error) {
            console.error('搜索失败:', error);
        }
    }

    // 显示搜索结果
    displaySearchResults(results, container) {
        if (results.length === 0) {
            container.innerHTML = '<div class="search-no-results">未找到相关结果</div>';
        } else {
            container.innerHTML = results.map(coin => `
                <div class="search-result-item" onclick="window.location.href='#${coin.id}'">
                    <img src="${coin.image}" alt="${coin.name}" class="search-coin-icon">
                    <div class="search-coin-info">
                        <div class="search-coin-name">${coin.chinese_name || coin.name}</div>
                        <div class="search-coin-symbol">${coin.symbol.toUpperCase()}</div>
                    </div>
                    <div class="search-coin-price">$${coin.current_price?.toFixed(2) || 'N/A'}</div>
                </div>
            `).join('');
        }
        container.style.display = 'block';
    }

    // 通知系统
    initializeNotifications() {
        // 创建通知容器
        const notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        notificationContainer.id = 'notification-container';
        document.body.appendChild(notificationContainer);

        // 检查价格警报
        this.checkPriceAlerts();
    }

    // 显示通知
    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    ${this.getNotificationIcon(type)}
                </div>
                <div class="notification-message">${message}</div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        container.appendChild(notification);

        // 自动移除通知
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    }

    // 获取通知图标
    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    // 价格警报检查
    async checkPriceAlerts() {
        try {
            const marketData = await this.loadMarketData();
            const alerts = this.getPriceAlerts();

            alerts.forEach(alert => {
                const coin = marketData.find(c => c.id === alert.coinId);
                if (coin && this.shouldTriggerAlert(coin, alert)) {
                    this.showNotification(
                        `${coin.chinese_name || coin.name} 价格${alert.type === 'above' ? '突破' : '跌破'} $${alert.price}`,
                        alert.type === 'above' ? 'success' : 'warning'
                    );
                }
            });
        } catch (error) {
            console.error('价格警报检查失败:', error);
        }
    }

    // 获取价格警报设置
    getPriceAlerts() {
        const alerts = localStorage.getItem('priceAlerts');
        return alerts ? JSON.parse(alerts) : [];
    }

    // 判断是否应该触发警报
    shouldTriggerAlert(coin, alert) {
        const currentPrice = coin.current_price;
        const lastTriggered = alert.lastTriggered || 0;
        const now = Date.now();

        // 避免频繁触发，至少间隔1小时
        if (now - lastTriggered < 3600000) return false;

        if (alert.type === 'above' && currentPrice >= alert.price) {
            alert.lastTriggered = now;
            this.savePriceAlerts();
            return true;
        }

        if (alert.type === 'below' && currentPrice <= alert.price) {
            alert.lastTriggered = now;
            this.savePriceAlerts();
            return true;
        }

        return false;
    }

    // 保存价格警报
    savePriceAlerts() {
        const alerts = this.getPriceAlerts();
        localStorage.setItem('priceAlerts', JSON.stringify(alerts));
    }

    // 实时更新
    startRealTimeUpdates() {
        // 每5分钟更新一次价格滚动条
        setInterval(() => {
            this.updatePriceTicker();
        }, 300000);

        // 每分钟检查一次数据更新时间
        setInterval(() => {
            this.checkDataFreshness();
        }, 60000);
    }

    // 更新价格滚动条
    async updatePriceTicker() {
        try {
            const marketData = await this.loadMarketData();
            const tickerContainer = document.querySelector('.ticker-container');
            
            if (tickerContainer && marketData.length > 0) {
                const tickerItems = marketData.slice(0, 10).map(coin => `
                    <div class="ticker-item">
                        <span class="ticker-symbol">${coin.symbol.toUpperCase()}</span>
                        <span class="ticker-price">$${coin.current_price?.toFixed(2) || 'N/A'}</span>
                        <span class="ticker-change ${(coin.price_change_percentage_24h || 0) >= 0 ? 'positive' : 'negative'}">
                            ${(coin.price_change_percentage_24h || 0).toFixed(2)}%
                        </span>
                    </div>
                `).join('');
                
                tickerContainer.innerHTML = tickerItems;
            }
        } catch (error) {
            console.error('更新价格滚动条失败:', error);
        }
    }

    // 检查数据新鲜度
    async checkDataFreshness() {
        try {
            const lastUpdated = await this.loadLastUpdated();
            const now = new Date();
            const updateTime = new Date(lastUpdated.timestamp);
            const timeDiff = now - updateTime;

            // 如果数据超过2小时未更新，显示警告
            if (timeDiff > 7200000) {
                this.showDataStaleWarning();
            }
        } catch (error) {
            console.error('检查数据新鲜度失败:', error);
        }
    }

    // 显示数据过期警告
    showDataStaleWarning() {
        const warning = document.querySelector('.data-stale-warning');
        if (warning) return; // 避免重复显示

        const warningElement = document.createElement('div');
        warningElement.className = 'data-stale-warning';
        warningElement.innerHTML = `
            <div class="alert alert-warning">
                ⚠️ 数据可能不是最新的，正在尝试更新...
                <button onclick="this.parentElement.parentElement.remove()" class="alert-close">×</button>
            </div>
        `;

        const container = document.querySelector('.main-content');
        if (container) {
            container.insertBefore(warningElement, container.firstChild);
        }
    }

    // 加载市场数据
    async loadMarketData() {
        try {
            const response = await fetch('data/enhanced-market-data.json');
            if (!response.ok) {
                // 如果增强数据不存在，尝试加载基础数据
                const fallbackResponse = await fetch('data/coins-market.json');
                return await fallbackResponse.json();
            }
            return await response.json();
        } catch (error) {
            console.error('加载市场数据失败:', error);
            return [];
        }
    }

    // 加载最后更新时间
    async loadLastUpdated() {
        try {
            const response = await fetch('data/last-updated.json');
            return await response.json();
        } catch (error) {
            console.error('加载更新时间失败:', error);
            return { timestamp: new Date().toISOString() };
        }
    }

    // 设置事件监听器
    setupEventListeners() {
        // 平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // 卡片悬停效果
        document.querySelectorAll('.card, .news-card, .arbitrage-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // 表格行点击效果
        document.querySelectorAll('.data-table tr').forEach(row => {
            row.addEventListener('click', function() {
                // 移除其他行的选中状态
                document.querySelectorAll('.data-table tr.selected').forEach(r => {
                    r.classList.remove('selected');
                });
                // 添加选中状态
                this.classList.add('selected');
            });
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K 打开搜索
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('crypto-search');
                if (searchInput) {
                    searchInput.focus();
                }
            }

            // ESC 关闭搜索结果
            if (e.key === 'Escape') {
                const searchResults = document.getElementById('search-results');
                if (searchResults) {
                    searchResults.style.display = 'none';
                }
            }
        });
    }

    // 添加价格警报
    addPriceAlert(coinId, price, type) {
        const alerts = this.getPriceAlerts();
        alerts.push({
            id: Date.now(),
            coinId,
            price,
            type,
            created: Date.now()
        });
        localStorage.setItem('priceAlerts', JSON.stringify(alerts));
        this.showNotification('价格警报已设置', 'success');
    }

    // 移除价格警报
    removePriceAlert(alertId) {
        const alerts = this.getPriceAlerts().filter(alert => alert.id !== alertId);
        localStorage.setItem('priceAlerts', JSON.stringify(alerts));
        this.showNotification('价格警报已移除', 'info');
    }

    // 切换主题
    toggleTheme() {
        const body = document.body;
        const isDark = body.classList.contains('dark-theme');
        
        if (isDark) {
            body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        }
    }

    // 初始化主题
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.body.classList.add('dark-theme');
        }
    }

    // 导出数据
    exportData(type) {
        const data = {
            timestamp: new Date().toISOString(),
            type: type,
            data: null
        };

        switch (type) {
            case 'market':
                this.loadMarketData().then(marketData => {
                    data.data = marketData;
                    this.downloadJSON(data, `market-data-${Date.now()}.json`);
                });
                break;
            case 'alerts':
                data.data = this.getPriceAlerts();
                this.downloadJSON(data, `price-alerts-${Date.now()}.json`);
                break;
        }
    }

    // 下载JSON文件
    downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// 页面加载完成后初始化增强功能
document.addEventListener('DOMContentLoaded', () => {
    window.cryptoEnhancer = new CryptoWebsiteEnhancer();
    
    // 添加一些示例数据到英雄区域的统计数字
    const heroStats = document.querySelectorAll('.hero-stat-number');
    if (heroStats.length > 0) {
        heroStats[0].dataset.target = '50';
        heroStats[1].dataset.target = '30';
        heroStats[2].dataset.target = '24';
    }
    
    console.log('✅ 增强功能初始化完成');
});

// 全局函数，供HTML调用
window.addPriceAlert = (coinId, price, type) => {
    if (window.cryptoEnhancer) {
        window.cryptoEnhancer.addPriceAlert(coinId, price, type);
    }
};

window.toggleTheme = () => {
    if (window.cryptoEnhancer) {
        window.cryptoEnhancer.toggleTheme();
    }
};

window.exportData = (type) => {
    if (window.cryptoEnhancer) {
        window.cryptoEnhancer.exportData(type);
    }
};