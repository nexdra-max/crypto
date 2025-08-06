// Market Page Specific JavaScript
class MarketPage {
    constructor() {
        this.coins = [];
        this.filteredCoins = [];
        this.currentTab = 'all';
        this.searchTerm = '';
        this.autoRefreshEnabled = true;
        this.refreshInterval = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadMarketData();
        this.startAutoRefresh();
        
        // 隐藏加载屏幕
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        }, 1500);
    }

    setupEventListeners() {
        // 标签页切换
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
                this.updateActiveTab(btn);
            });
        });

        // 搜索功能
        const searchInput = document.getElementById('coinSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.filterAndDisplayCoins();
            });
        }

        // 刷新按钮
        const refreshBtn = document.getElementById('refreshMarket');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadMarketData();
                this.animateRefreshButton(refreshBtn);
            });
        }

        // 自动刷新开关
        const autoRefreshCheckbox = document.getElementById('autoRefresh');
        if (autoRefreshCheckbox) {
            autoRefreshCheckbox.addEventListener('change', (e) => {
                this.autoRefreshEnabled = e.target.checked;
                if (this.autoRefreshEnabled) {
                    this.startAutoRefresh();
                } else {
                    this.stopAutoRefresh();
                }
            });
        }

        // 投资计算器
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                this.calculateInvestment();
            });
        }

        // 收益计算器
        const profitCalculateBtn = document.getElementById('profitCalculateBtn');
        if (profitCalculateBtn) {
            profitCalculateBtn.addEventListener('click', () => {
                this.calculateProfit();
            });
        }
    }

    async loadMarketData() {
        try {
            this.showLoadingState();

            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h,24h,7d');
            
            if (!response.ok) {
                throw new Error('API请求失败');
            }

            const data = await response.json();
            this.coins = data;
            this.filterAndDisplayCoins();
            this.updateMarketStats();
            this.updateTickerData();
            this.updateHotCoins();
            this.updateMarketTrend();
            this.updateLastUpdateTime();
            
            this.hideLoadingState();

        } catch (error) {
            console.error('加载市场数据失败:', error);
            this.showErrorState();
        }
    }

    filterAndDisplayCoins() {
        let filtered = [...this.coins];

        // 搜索过滤
        if (this.searchTerm) {
            filtered = filtered.filter(coin => 
                coin.name.toLowerCase().includes(this.searchTerm) ||
                coin.symbol.toLowerCase().includes(this.searchTerm)
            );
        }

        // 标签页过滤
        switch (this.currentTab) {
            case 'gainers':
                filtered = filtered.filter(coin => coin.price_change_percentage_24h > 0)
                                 .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
                break;
            case 'losers':
                filtered = filtered.filter(coin => coin.price_change_percentage_24h < 0)
                                 .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
                break;
            case 'volume':
                filtered = filtered.sort((a, b) => b.total_volume - a.total_volume);
                break;
            default:
                filtered = filtered.sort((a, b) => a.market_cap_rank - b.market_cap_rank);
        }

        this.filteredCoins = filtered;
        this.displayMarketTable();
    }

    displayMarketTable() {
        const marketTable = document.getElementById('marketTable');
        if (!marketTable) return;

        if (this.filteredCoins.length === 0) {
            marketTable.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>未找到匹配的币种</h3>
                    <p>请尝试其他搜索关键词</p>
                </div>
            `;
            return;
        }

        marketTable.innerHTML = this.filteredCoins.map((coin, index) => `
            <div class="market-row" style="animation-delay: ${index * 0.05}s">
                <div class="cell rank">
                    <span class="rank-number">#${coin.market_cap_rank || '--'}</span>
                </div>
                
                <div class="cell coin">
                    <div class="coin-info">
                        <img src="${coin.image}" alt="${coin.name}" class="coin-icon" loading="lazy">
                        <div class="coin-details">
                            <div class="coin-name">${coin.name}</div>
                            <div class="coin-symbol">${coin.symbol.toUpperCase()}</div>
                        </div>
                    </div>
                </div>
                
                <div class="cell price">
                    <div class="price-value">$${this.formatPrice(coin.current_price)}</div>
                </div>
                
                <div class="cell change-24h">
                    <div class="change-value ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
                        <i class="fas fa-arrow-${coin.price_change_percentage_24h >= 0 ? 'up' : 'down'}"></i>
                        ${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h?.toFixed(2) || 0}%
                    </div>
                </div>
                
                <div class="cell volume">
                    <div class="volume-value">$${this.formatLargeNumber(coin.total_volume)}</div>
                </div>
                
                <div class="cell market-cap">
                    <div class="market-cap-value">$${this.formatLargeNumber(coin.market_cap)}</div>
                </div>
                
                <div class="cell chart">
                    <canvas class="sparkline-chart" data-sparkline="${coin.sparkline_in_7d?.price?.join(',') || ''}" width="100" height="40"></canvas>
                </div>
            </div>
        `).join('');

        // 绘制走势图
        this.drawSparklines();
    }

    drawSparklines() {
        const charts = document.querySelectorAll('.sparkline-chart');
        charts.forEach(chart => {
            const sparklineData = chart.dataset.sparkline;
            if (!sparklineData) return;

            const prices = sparklineData.split(',').map(Number).filter(n => !isNaN(n));
            if (prices.length === 0) return;

            const ctx = chart.getContext('2d');
            const width = chart.width;
            const height = chart.height;

            ctx.clearRect(0, 0, width, height);

            const min = Math.min(...prices);
            const max = Math.max(...prices);
            const range = max - min || 1;

            // 确定颜色
            const firstPrice = prices[0];
            const lastPrice = prices[prices.length - 1];
            const isPositive = lastPrice >= firstPrice;
            const color = isPositive ? '#22c55e' : '#ef4444';

            // 绘制线条
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;

            prices.forEach((price, index) => {
                const x = (index / (prices.length - 1)) * width;
                const y = height - ((price - min) / range) * height;

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
        });
    }

    switchTab(tab) {
        this.currentTab = tab;
        this.filterAndDisplayCoins();
    }

    updateActiveTab(activeBtn) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    updateMarketStats() {
        if (this.coins.length === 0) return;

        const totalMarketCap = this.coins.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
        const totalMarketCapElement = document.getElementById('totalMarketCap');
        if (totalMarketCapElement) {
            totalMarketCapElement.textContent = `$${this.formatLargeNumber(totalMarketCap)}`;
        }

        const totalCoinsElement = document.getElementById('totalCoins');
        if (totalCoinsElement) {
            totalCoinsElement.textContent = `${this.coins.length}+`;
        }
    }

    updateTickerData() {
        const tickerContent = document.getElementById('tickerContent');
        if (!tickerContent || this.coins.length === 0) return;

        const topCoins = this.coins.slice(0, 10);
        tickerContent.innerHTML = topCoins.map(coin => `
            <div class="ticker-item">
                <span class="coin-name">${coin.symbol.toUpperCase()}</span>
                <span class="coin-price">$${this.formatPrice(coin.current_price)}</span>
                <span class="coin-change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
                    ${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h?.toFixed(2) || 0}%
                </span>
            </div>
        `).join('');
    }

    updateHotCoins() {
        const hotCoinsContainer = document.getElementById('hotCoins');
        if (!hotCoinsContainer || this.coins.length === 0) return;

        const hotCoins = this.coins
            .filter(coin => coin.price_change_percentage_24h > 5)
            .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
            .slice(0, 5);

        if (hotCoins.length === 0) {
            hotCoinsContainer.innerHTML = '<p class="no-hot-coins">暂无热门币种</p>';
            return;
        }

        hotCoinsContainer.innerHTML = hotCoins.map(coin => `
            <div class="hot-coin-item">
                <img src="${coin.image}" alt="${coin.name}" class="hot-coin-icon">
                <div class="hot-coin-info">
                    <div class="hot-coin-name">${coin.name}</div>
                    <div class="hot-coin-change positive">+${coin.price_change_percentage_24h.toFixed(2)}%</div>
                </div>
            </div>
        `).join('');
    }

    updateMarketTrend() {
        const marketTrendElement = document.getElementById('marketTrend');
        const trendDescriptionElement = document.getElementById('trendDescription');
        
        if (!marketTrendElement || !trendDescriptionElement || this.coins.length === 0) return;

        const positiveCoins = this.coins.filter(coin => coin.price_change_percentage_24h > 0).length;
        const totalCoins = this.coins.length;
        const positivePercentage = (positiveCoins / totalCoins) * 100;

        let trend, description, trendClass;
        if (positivePercentage > 60) {
            trend = '看涨';
            description = `${positivePercentage.toFixed(1)}%的币种上涨，市场情绪乐观`;
            trendClass = 'bullish';
        } else if (positivePercentage > 40) {
            trend = '震荡';
            description = `市场涨跌参半，${positivePercentage.toFixed(1)}%的币种上涨`;
            trendClass = 'neutral';
        } else {
            trend = '看跌';
            description = `${(100 - positivePercentage).toFixed(1)}%的币种下跌，市场情绪谨慎`;
            trendClass = 'bearish';
        }

        marketTrendElement.textContent = trend;
        marketTrendElement.className = `trend-value ${trendClass}`;
        trendDescriptionElement.textContent = description;

        // 绘制趋势图表
        this.drawTrendChart(positivePercentage);
    }

    drawTrendChart(positivePercentage) {
        const canvas = document.getElementById('trendChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        // 绘制饼图
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;

        const positiveAngle = (positivePercentage / 100) * 2 * Math.PI;

        // 绘制正面部分
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, positiveAngle);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = '#22c55e';
        ctx.fill();

        // 绘制负面部分
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, positiveAngle, 2 * Math.PI);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = '#ef4444';
        ctx.fill();

        // 添加标签
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`${positivePercentage.toFixed(1)}%`, centerX, centerY + 4);
    }

    calculateInvestment() {
        const investAmount = parseFloat(document.getElementById('investAmount').value);
        const coinSelect = document.getElementById('coinSelect').value;
        
        if (!investAmount || investAmount <= 0) {
            alert('请输入有效的投资金额');
            return;
        }

        const selectedCoin = this.coins.find(coin => coin.id === coinSelect);
        if (!selectedCoin) {
            alert('未找到选中的币种数据');
            return;
        }

        const buyAmount = investAmount / selectedCoin.current_price;
        const currentValue = buyAmount * selectedCoin.current_price;

        document.getElementById('buyAmount').textContent = `${buyAmount.toFixed(6)} ${selectedCoin.symbol.toUpperCase()}`;
        document.getElementById('currentValue').textContent = `$${currentValue.toFixed(2)}`;
    }

    calculateProfit() {
        const buyPrice = parseFloat(document.getElementById('buyPrice').value);
        const sellPrice = parseFloat(document.getElementById('sellPrice').value);
        const quantity = parseFloat(document.getElementById('quantity').value);

        if (!buyPrice || !sellPrice || !quantity || buyPrice <= 0 || sellPrice <= 0 || quantity <= 0) {
            alert('请输入有效的价格和数量');
            return;
        }

        const profitAmount = (sellPrice - buyPrice) * quantity;
        const profitRate = ((sellPrice - buyPrice) / buyPrice) * 100;

        document.getElementById('profitAmount').textContent = `$${profitAmount.toFixed(2)}`;
        document.getElementById('profitRate').textContent = `${profitRate >= 0 ? '+' : ''}${profitRate.toFixed(2)}%`;
        
        // 更新颜色
        const profitAmountElement = document.getElementById('profitAmount');
        const profitRateElement = document.getElementById('profitRate');
        
        if (profitAmount >= 0) {
            profitAmountElement.style.color = '#22c55e';
            profitRateElement.style.color = '#22c55e';
        } else {
            profitAmountElement.style.color = '#ef4444';
            profitRateElement.style.color = '#ef4444';
        }
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

    startAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        this.refreshInterval = setInterval(() => {
            if (this.autoRefreshEnabled) {
                this.loadMarketData();
            }
        }, 30000); // 30秒刷新一次
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    showLoadingState() {
        const marketTable = document.getElementById('marketTable');
        if (marketTable) {
            marketTable.style.opacity = '0.5';
        }
    }

    hideLoadingState() {
        const marketTable = document.getElementById('marketTable');
        if (marketTable) {
            marketTable.style.opacity = '1';
        }
    }

    showErrorState() {
        const marketTable = document.getElementById('marketTable');
        if (marketTable) {
            marketTable.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>数据加载失败</h3>
                    <p>请检查网络连接或稍后重试</p>
                    <button class="btn btn-primary" onclick="window.marketPage.loadMarketData()">
                        <i class="fas fa-sync-alt"></i>
                        重新加载
                    </button>
                </div>
            `;
        }
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

// 页面加载完成后初始化市场页面
document.addEventListener('DOMContentLoaded', () => {
    window.marketPage = new MarketPage();
});