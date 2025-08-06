// 增强版加密货币功能模块
class EnhancedCryptoFeatures {
    constructor() {
        this.init();
        this.setupRealTimeFeatures();
        this.initAdvancedAnalytics();
    }

    init() {
        // 初始化高级功能
        this.setupMarketAlerts();
        this.initTradingSignals();
        this.setupPortfolioTracker();
        this.initNewsAggregator();
        this.setupPriceAlerts();
    }

    // 市场警报系统
    setupMarketAlerts() {
        const alertsContainer = document.getElementById('marketAlerts');
        if (!alertsContainer) return;

        const alerts = [
            {
                type: 'bullish',
                coin: 'BTC',
                message: '比特币突破关键阻力位 $97,000',
                time: '2分钟前',
                confidence: 85
            },
            {
                type: 'bearish',
                coin: 'ETH',
                message: '以太坊面临支撑位测试 $3,400',
                time: '5分钟前',
                confidence: 72
            },
            {
                type: 'neutral',
                coin: 'BNB',
                message: 'BNB在区间内震荡，等待突破',
                time: '8分钟前',
                confidence: 68
            }
        ];

        alertsContainer.innerHTML = alerts.map(alert => `
            <div class="alert-item ${alert.type}">
                <div class="alert-header">
                    <span class="alert-coin">${alert.coin}</span>
                    <span class="alert-confidence">${alert.confidence}%</span>
                </div>
                <div class="alert-message">${alert.message}</div>
                <div class="alert-time">${alert.time}</div>
            </div>
        `).join('');
    }

    // 交易信号生成
    initTradingSignals() {
        const signalsContainer = document.getElementById('tradingSignals');
        if (!signalsContainer) return;

        const signals = [
            {
                coin: 'BTC',
                signal: 'BUY',
                strength: 'STRONG',
                entry: '$97,234',
                target: '$102,000',
                stopLoss: '$94,500',
                rsi: 65,
                macd: 'BULLISH'
            },
            {
                coin: 'ETH',
                signal: 'HOLD',
                strength: 'MEDIUM',
                entry: '$3,456',
                target: '$3,800',
                stopLoss: '$3,200',
                rsi: 45,
                macd: 'NEUTRAL'
            },
            {
                coin: 'BNB',
                signal: 'BUY',
                strength: 'MEDIUM',
                entry: '$678',
                target: '$720',
                stopLoss: '$650',
                rsi: 58,
                macd: 'BULLISH'
            }
        ];

        signalsContainer.innerHTML = signals.map(signal => `
            <div class="signal-card ${signal.signal.toLowerCase()}">
                <div class="signal-header">
                    <h4>${signal.coin}</h4>
                    <span class="signal-badge ${signal.signal.toLowerCase()}">${signal.signal}</span>
                </div>
                <div class="signal-strength">${signal.strength} 信号</div>
                <div class="signal-details">
                    <div class="signal-row">
                        <span>入场价:</span>
                        <span>${signal.entry}</span>
                    </div>
                    <div class="signal-row">
                        <span>目标价:</span>
                        <span class="target">${signal.target}</span>
                    </div>
                    <div class="signal-row">
                        <span>止损价:</span>
                        <span class="stop-loss">${signal.stopLoss}</span>
                    </div>
                </div>
                <div class="signal-indicators">
                    <span class="indicator">RSI: ${signal.rsi}</span>
                    <span class="indicator">MACD: ${signal.macd}</span>
                </div>
            </div>
        `).join('');
    }

    // 投资组合追踪器
    setupPortfolioTracker() {
        const portfolioContainer = document.getElementById('portfolioTracker');
        if (!portfolioContainer) return;

        const portfolio = {
            totalValue: 125430.50,
            dayChange: 2.34,
            dayChangeValue: 2876.45,
            holdings: [
                { coin: 'BTC', amount: 1.25, value: 121543.20, percentage: 45.2, change: 2.34 },
                { coin: 'ETH', amount: 15.8, value: 54617.84, percentage: 32.1, change: -1.23 },
                { coin: 'BNB', amount: 45.2, value: 30686.28, percentage: 18.0, change: 0.56 },
                { coin: 'XRP', amount: 2500, value: 5850.00, percentage: 4.7, change: -2.45 }
            ]
        };

        portfolioContainer.innerHTML = `
            <div class="portfolio-summary">
                <div class="portfolio-total">
                    <h3>投资组合总值</h3>
                    <div class="total-value">$${portfolio.totalValue.toLocaleString()}</div>
                    <div class="total-change ${portfolio.dayChange >= 0 ? 'positive' : 'negative'}">
                        ${portfolio.dayChange >= 0 ? '+' : ''}${portfolio.dayChange}% 
                        (${portfolio.dayChange >= 0 ? '+' : ''}$${portfolio.dayChangeValue.toLocaleString()})
                    </div>
                </div>
                <div class="portfolio-chart">
                    <canvas id="portfolioChart" width="200" height="100"></canvas>
                </div>
            </div>
            <div class="portfolio-holdings">
                ${portfolio.holdings.map(holding => `
                    <div class="holding-item">
                        <div class="holding-info">
                            <span class="holding-coin">${holding.coin}</span>
                            <span class="holding-amount">${holding.amount}</span>
                        </div>
                        <div class="holding-value">
                            <span class="value">$${holding.value.toLocaleString()}</span>
                            <span class="percentage">${holding.percentage}%</span>
                        </div>
                        <div class="holding-change ${holding.change >= 0 ? 'positive' : 'negative'}">
                            ${holding.change >= 0 ? '+' : ''}${holding.change}%
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // 新闻聚合器
    initNewsAggregator() {
        const newsContainer = document.getElementById('cryptoNews');
        if (!newsContainer) return;

        const news = [
            {
                title: '比特币ETF资金流入创历史新高',
                source: 'CoinDesk',
                time: '30分钟前',
                category: '市场动态',
                sentiment: 'bullish',
                impact: 'high'
            },
            {
                title: '以太坊Layer2生态TVL突破500亿美元',
                source: 'The Block',
                time: '1小时前',
                category: '技术发展',
                sentiment: 'bullish',
                impact: 'medium'
            },
            {
                title: '美联储官员暗示可能调整利率政策',
                source: 'Reuters',
                time: '2小时前',
                category: '宏观经济',
                sentiment: 'neutral',
                impact: 'high'
            },
            {
                title: 'DeFi协议遭受闪电贷攻击损失200万美元',
                source: 'CryptoSlate',
                time: '3小时前',
                category: '安全事件',
                sentiment: 'bearish',
                impact: 'low'
            }
        ];

        newsContainer.innerHTML = news.map(item => `
            <div class="news-item ${item.sentiment}">
                <div class="news-header">
                    <span class="news-category">${item.category}</span>
                    <span class="news-impact ${item.impact}">${item.impact.toUpperCase()}</span>
                </div>
                <h4 class="news-title">${item.title}</h4>
                <div class="news-meta">
                    <span class="news-source">${item.source}</span>
                    <span class="news-time">${item.time}</span>
                </div>
                <div class="news-sentiment">
                    <span class="sentiment-indicator ${item.sentiment}"></span>
                    <span class="sentiment-text">${this.getSentimentText(item.sentiment)}</span>
                </div>
            </div>
        `).join('');
    }

    getSentimentText(sentiment) {
        const sentiments = {
            'bullish': '看涨',
            'bearish': '看跌',
            'neutral': '中性'
        };
        return sentiments[sentiment] || '中性';
    }

    // 价格警报系统
    setupPriceAlerts() {
        const alertsContainer = document.getElementById('priceAlerts');
        if (!alertsContainer) return;

        alertsContainer.innerHTML = `
            <div class="price-alert-form">
                <h4>设置价格警报</h4>
                <div class="alert-inputs">
                    <select id="alertCoin" class="alert-select">
                        <option value="BTC">Bitcoin (BTC)</option>
                        <option value="ETH">Ethereum (ETH)</option>
                        <option value="BNB">BNB (BNB)</option>
                        <option value="XRP">XRP (XRP)</option>
                    </select>
                    <input type="number" id="alertPrice" placeholder="目标价格" class="alert-input">
                    <select id="alertType" class="alert-select">
                        <option value="above">高于</option>
                        <option value="below">低于</option>
                    </select>
                    <button id="addAlert" class="alert-btn">添加警报</button>
                </div>
            </div>
            <div class="active-alerts">
                <h4>活跃警报</h4>
                <div class="alert-list" id="alertList">
                    <div class="alert-item">
                        <span class="alert-coin">BTC</span>
                        <span class="alert-condition">高于 $100,000</span>
                        <span class="alert-status active">活跃</span>
                        <button class="remove-alert">×</button>
                    </div>
                    <div class="alert-item">
                        <span class="alert-coin">ETH</span>
                        <span class="alert-condition">低于 $3,000</span>
                        <span class="alert-status active">活跃</span>
                        <button class="remove-alert">×</button>
                    </div>
                </div>
            </div>
        `;

        // 添加警报功能
        document.getElementById('addAlert')?.addEventListener('click', () => {
            const coin = document.getElementById('alertCoin').value;
            const price = document.getElementById('alertPrice').value;
            const type = document.getElementById('alertType').value;
            
            if (price) {
                this.addPriceAlert(coin, price, type);
            }
        });
    }

    addPriceAlert(coin, price, type) {
        const alertList = document.getElementById('alertList');
        const alertItem = document.createElement('div');
        alertItem.className = 'alert-item';
        alertItem.innerHTML = `
            <span class="alert-coin">${coin}</span>
            <span class="alert-condition">${type === 'above' ? '高于' : '低于'} $${price}</span>
            <span class="alert-status active">活跃</span>
            <button class="remove-alert">×</button>
        `;
        
        alertList.appendChild(alertItem);
        
        // 清空输入
        document.getElementById('alertPrice').value = '';
        
        // 添加删除功能
        alertItem.querySelector('.remove-alert').addEventListener('click', () => {
            alertItem.remove();
        });
    }

    // 实时功能设置
    setupRealTimeFeatures() {
        // 每10秒更新市场警报
        setInterval(() => {
            this.updateMarketAlerts();
        }, 10000);

        // 每30秒更新交易信号
        setInterval(() => {
            this.updateTradingSignals();
        }, 30000);

        // 每分钟更新投资组合
        setInterval(() => {
            this.updatePortfolio();
        }, 60000);

        // 每5分钟更新新闻
        setInterval(() => {
            this.updateNews();
        }, 300000);
    }

    updateMarketAlerts() {
        // 模拟实时警报更新
        console.log('更新市场警报...');
    }

    updateTradingSignals() {
        // 模拟交易信号更新
        console.log('更新交易信号...');
    }

    updatePortfolio() {
        // 模拟投资组合更新
        console.log('更新投资组合...');
    }

    updateNews() {
        // 模拟新闻更新
        console.log('更新加密货币新闻...');
    }

    // 高级分析功能
    initAdvancedAnalytics() {
        this.setupTechnicalIndicators();
        this.setupMarketSentiment();
        this.setupVolumeAnalysis();
    }

    setupTechnicalIndicators() {
        const indicatorsContainer = document.getElementById('technicalIndicators');
        if (!indicatorsContainer) return;

        const indicators = {
            RSI: { value: 65.4, signal: 'NEUTRAL', color: 'orange' },
            MACD: { value: 1.23, signal: 'BULLISH', color: 'green' },
            'Bollinger Bands': { value: 'UPPER', signal: 'OVERBOUGHT', color: 'red' },
            'Moving Average': { value: 'ABOVE', signal: 'BULLISH', color: 'green' }
        };

        indicatorsContainer.innerHTML = Object.entries(indicators).map(([name, data]) => `
            <div class="indicator-item">
                <div class="indicator-name">${name}</div>
                <div class="indicator-value" style="color: ${data.color}">${data.value}</div>
                <div class="indicator-signal ${data.signal.toLowerCase()}">${data.signal}</div>
            </div>
        `).join('');
    }

    setupMarketSentiment() {
        const sentimentContainer = document.getElementById('marketSentiment');
        if (!sentimentContainer) return;

        const sentiment = {
            fearGreedIndex: 72,
            socialSentiment: 68,
            newsAnalysis: 75,
            technicalAnalysis: 65
        };

        sentimentContainer.innerHTML = `
            <div class="sentiment-overview">
                <h4>市场情绪分析</h4>
                <div class="sentiment-gauge">
                    <div class="gauge-container">
                        <div class="gauge-fill" style="width: ${sentiment.fearGreedIndex}%"></div>
                        <div class="gauge-value">${sentiment.fearGreedIndex}</div>
                    </div>
                    <div class="gauge-label">恐惧贪婪指数</div>
                </div>
            </div>
            <div class="sentiment-details">
                <div class="sentiment-item">
                    <span>社交媒体情绪</span>
                    <div class="sentiment-bar">
                        <div class="bar-fill" style="width: ${sentiment.socialSentiment}%"></div>
                        <span class="bar-value">${sentiment.socialSentiment}%</span>
                    </div>
                </div>
                <div class="sentiment-item">
                    <span>新闻分析</span>
                    <div class="sentiment-bar">
                        <div class="bar-fill" style="width: ${sentiment.newsAnalysis}%"></div>
                        <span class="bar-value">${sentiment.newsAnalysis}%</span>
                    </div>
                </div>
                <div class="sentiment-item">
                    <span>技术分析</span>
                    <div class="sentiment-bar">
                        <div class="bar-fill" style="width: ${sentiment.technicalAnalysis}%"></div>
                        <span class="bar-value">${sentiment.technicalAnalysis}%</span>
                    </div>
                </div>
            </div>
        `;
    }

    setupVolumeAnalysis() {
        const volumeContainer = document.getElementById('volumeAnalysis');
        if (!volumeContainer) return;

        const volumeData = [
            { exchange: 'Binance', volume: 15.2, percentage: 35.2 },
            { exchange: 'Coinbase', volume: 8.7, percentage: 20.1 },
            { exchange: 'Kraken', volume: 6.3, percentage: 14.6 },
            { exchange: 'OKX', volume: 5.1, percentage: 11.8 },
            { exchange: 'Others', volume: 7.9, percentage: 18.3 }
        ];

        volumeContainer.innerHTML = `
            <h4>交易量分析</h4>
            <div class="volume-list">
                ${volumeData.map(item => `
                    <div class="volume-item">
                        <div class="volume-exchange">${item.exchange}</div>
                        <div class="volume-bar">
                            <div class="bar-fill" style="width: ${item.percentage}%"></div>
                        </div>
                        <div class="volume-data">
                            <span class="volume-amount">${item.volume}B</span>
                            <span class="volume-percentage">${item.percentage}%</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// 页面加载完成后初始化增强功能
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedCrypto = new EnhancedCryptoFeatures();
});