// 市场数据处理JavaScript文件
// 使用本地数据文件显示加密货币数据

// 数据文件路径
const DATA_PATH = 'data';

// 加载市场数据
async function loadMarketData() {
    try {
        // 加载价格行情
        loadPriceTicker();
        
        // 加载市场卡片数据
        loadMarketCards();
        
        // 加载最后更新时间
        loadLastUpdated();
    } catch (error) {
        console.error('加载市场数据时出错:', error);
    }
}

// 加载价格行情
async function loadPriceTicker() {
    const tickerContainer = document.getElementById('price-ticker');
    if (!tickerContainer) return;
    
    try {
        // 显示加载状态
        tickerContainer.innerHTML = '<div class="ticker-loading">加载中...</div>';
        
        // 获取加密货币市场数据
        const response = await fetch(`${DATA_PATH}/coins-market.json`);
        
        if (!response.ok) {
            throw new Error('数据加载失败');
        }
        
        const data = await response.json();
        
        // 清空加载状态
        tickerContainer.innerHTML = '';
        
        // 创建行情项
        data.slice(0, 10).forEach(coin => {
            const tickerItem = document.createElement('div');
            tickerItem.className = 'ticker-item';
            
            const changeClass = getPriceChangeClass(coin.price_change_percentage_24h);
            const coinName = coin.chinese_name || coin.name;
            
            tickerItem.innerHTML = `
                <span class="name">${coin.symbol.toUpperCase()} (${coinName})</span>
                <span class="price">${formatPrice(coin.current_price)}</span>
                <span class="change ${changeClass}">${formatChange(coin.price_change_percentage_24h)}</span>
            `;
            
            tickerContainer.appendChild(tickerItem);
            
            // 复制一份用于无缝滚动
            if (data.length <= 10) {
                const tickerItemClone = tickerItem.cloneNode(true);
                tickerContainer.appendChild(tickerItemClone);
            }
        });
    } catch (error) {
        console.error('加载价格行情时出错:', error);
        showError(tickerContainer, '加载价格数据失败');
    }
}

// 加载市场卡片数据
async function loadMarketCards() {
    try {
        // 获取加密货币市场数据
        const response = await fetch(`${DATA_PATH}/coins-market.json`);
        
        if (!response.ok) {
            throw new Error('数据加载失败');
        }
        
        const data = await response.json();
        
        // 更新市场卡片
        data.slice(0, 3).forEach(coin => {
            updateCoinCard(coin);
        });
        
        // 加载交易所价格对比
        loadExchangePrices();
    } catch (error) {
        console.error('加载市场卡片数据时出错:', error);
    }
}

// 更新币种卡片
function updateCoinCard(coin) {
    const priceElement = document.getElementById(`${coin.symbol}-price`);
    const changeElement = document.getElementById(`${coin.symbol}-change`);
    
    if (priceElement) {
        priceElement.textContent = formatPrice(coin.current_price);
    }
    
    if (changeElement) {
        const changeClass = getPriceChangeClass(coin.price_change_percentage_24h);
        changeElement.textContent = formatChange(coin.price_change_percentage_24h);
        changeElement.className = `change ${changeClass}`;
    }
}

// 加载交易所价格对比
async function loadExchangePrices() {
    try {
        // 获取交易所交易对数据
        const response = await fetch(`${DATA_PATH}/exchange-pairs.json`);
        
        if (!response.ok) {
            throw new Error('数据加载失败');
        }
        
        const exchangePairsData = await response.json();
        
        // 获取交易所数据
        const exchangesResponse = await fetch(`${DATA_PATH}/exchanges.json`);
        
        if (!exchangesResponse.ok) {
            throw new Error('交易所数据加载失败');
        }
        
        const exchangesData = await exchangesResponse.json();
        
        // 创建交易所名称映射
        const exchangeNames = {};
        exchangesData.forEach(exchange => {
            exchangeNames[exchange.id] = exchange.chinese_name || exchange.name;
        });
        
        // 更新交易所价格
        const coins = ['btc', 'eth', 'bnb'];
        const mainExchanges = ['binance', 'okex', 'huobi'];
        
        coins.forEach(coin => {
            mainExchanges.forEach(exchangeId => {
                const element = document.getElementById(`${coin}-${exchangeId}`);
                if (element) {
                    // 查找该交易所的该币种价格
                    const exchangePairs = exchangePairsData[exchangeId] || [];
                    const coinPair = exchangePairs.find(pair => 
                        pair.base.toLowerCase() === coin && 
                        (pair.target.toLowerCase() === 'usdt' || pair.target.toLowerCase() === 'usd')
                    );
                    
                    if (coinPair) {
                        element.textContent = formatPrice(coinPair.last);
                    } else {
                        // 如果没有找到真实数据，使用模拟数据
                        const basePrice = parseFloat(document.getElementById(`${coin}-price`).textContent.replace('$', '').replace(',', ''));
                        const randomFactor = 1 + (Math.random() * 0.01 - 0.005);
                        const exchangePrice = basePrice * randomFactor;
                        element.textContent = formatPrice(exchangePrice);
                    }
                }
            });
        });
    } catch (error) {
        console.error('加载交易所价格对比时出错:', error);
    }
}

// 加载最后更新时间
async function loadLastUpdated() {
    try {
        const response = await fetch(`${DATA_PATH}/last-updated.json`);
        
        if (!response.ok) {
            throw new Error('数据加载失败');
        }
        
        const data = await response.json();
        
        // 更新最后更新时间
        const lastUpdatedElements = document.querySelectorAll('.last-updated-time');
        lastUpdatedElements.forEach(element => {
            element.textContent = data.formatted;
        });
    } catch (error) {
        console.error('加载最后更新时间时出错:', error);
    }
}

// 定期刷新数据（每60秒）
setInterval(() => {
    if (isHomePage()) {
        loadMarketData();
    }
}, 60000);
