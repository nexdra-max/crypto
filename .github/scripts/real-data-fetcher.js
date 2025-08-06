/**
 * 真实数据获取脚本
 * 专门用于获取真实的加密货币市场数据
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 数据目录
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// CoinGecko API配置
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const REQUEST_DELAY = 1000; // 1秒延迟，避免API限制

// 主要加密货币列表
const MAIN_COINS = [
    'bitcoin', 'ethereum', 'binancecoin', 'ripple', 'cardano', 
    'solana', 'polkadot', 'dogecoin', 'avalanche-2', 'tron',
    'chainlink', 'litecoin', 'uniswap', 'polygon', 'stellar',
    'bitcoin-cash', 'monero', 'cosmos', 'ethereum-classic', 'filecoin'
];

// 主要交易所列表
const MAIN_EXCHANGES = [
    'binance', 'gdax', 'okex', 'huobi', 'kucoin', 
    'gate', 'kraken', 'bitfinex', 'gemini', 'bybit_spot'
];

/**
 * 延迟函数
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 安全的API请求
 */
async function safeApiRequest(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`📡 请求: ${url}`);
            const response = await axios.get(url, {
                timeout: 15000,
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'HodorCrypto/1.0'
                }
            });
            
            if (response.data) {
                console.log(`✅ 请求成功，数据大小: ${JSON.stringify(response.data).length} 字符`);
                return response.data;
            }
        } catch (error) {
            console.warn(`⚠️ 请求失败 (尝试 ${i + 1}/${retries}): ${error.message}`);
            if (i < retries - 1) {
                await delay(2000 * (i + 1)); // 递增延迟
            }
        }
    }
    throw new Error(`API请求失败: ${url}`);
}

/**
 * 获取真实的市场数据
 */
async function getRealMarketData() {
    console.log('🔄 开始获取真实市场数据...');
    
    try {
        // 获取市场数据
        const marketUrl = `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&ids=${MAIN_COINS.join(',')}&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=1h,24h,7d`;
        const marketData = await safeApiRequest(marketUrl);
        
        if (!Array.isArray(marketData) || marketData.length === 0) {
            throw new Error('市场数据格式错误或为空');
        }
        
        // 添加中文名称
        const enhancedMarketData = marketData.map(coin => ({
            ...coin,
            chinese_name: getChineseName(coin.id),
            last_updated_real: new Date().toISOString()
        }));
        
        // 保存市场数据
        const marketFilePath = path.join(dataDir, 'coins-market.json');
        fs.writeFileSync(marketFilePath, JSON.stringify(enhancedMarketData, null, 2));
        console.log(`✅ 市场数据已保存: ${enhancedMarketData.length} 个币种`);
        
        await delay(REQUEST_DELAY);
        return enhancedMarketData;
        
    } catch (error) {
        console.error('❌ 获取市场数据失败:', error.message);
        throw error;
    }
}

/**
 * 获取真实的交易所数据
 */
async function getRealExchangeData() {
    console.log('🔄 开始获取真实交易所数据...');
    
    try {
        const exchangeUrl = `${COINGECKO_API_URL}/exchanges`;
        const allExchanges = await safeApiRequest(exchangeUrl);
        
        if (!Array.isArray(allExchanges)) {
            throw new Error('交易所数据格式错误');
        }
        
        // 筛选主要交易所
        const mainExchanges = allExchanges.filter(exchange => 
            MAIN_EXCHANGES.includes(exchange.id)
        ).map(exchange => ({
            ...exchange,
            chinese_name: getExchangeChineseName(exchange.id),
            last_updated_real: new Date().toISOString()
        }));
        
        // 保存交易所数据
        const exchangeFilePath = path.join(dataDir, 'exchanges.json');
        fs.writeFileSync(exchangeFilePath, JSON.stringify(mainExchanges, null, 2));
        console.log(`✅ 交易所数据已保存: ${mainExchanges.length} 个交易所`);
        
        await delay(REQUEST_DELAY);
        return mainExchanges;
        
    } catch (error) {
        console.error('❌ 获取交易所数据失败:', error.message);
        throw error;
    }
}

/**
 * 生成真实的套利机会数据
 */
async function generateRealArbitrageData(marketData) {
    console.log('🔄 开始分析真实套利机会...');
    
    try {
        const arbitrageOpportunities = [];
        
        // 获取前5个币种的交易对数据
        for (const coin of MAIN_COINS.slice(0, 5)) {
            try {
                console.log(`📊 分析 ${coin} 的套利机会...`);
                
                // 获取该币种在不同交易所的价格
                const tickerUrl = `${COINGECKO_API_URL}/coins/${coin}/tickers`;
                const tickerData = await safeApiRequest(tickerUrl);
                
                if (tickerData && tickerData.tickers && Array.isArray(tickerData.tickers)) {
                    const validTickers = tickerData.tickers
                        .filter(ticker => 
                            ticker.target === 'USDT' || ticker.target === 'USD'
                        )
                        .filter(ticker => ticker.last && ticker.last > 0)
                        .slice(0, 5); // 只取前5个
                    
                    // 分析价格差异
                    for (let i = 0; i < validTickers.length; i++) {
                        for (let j = i + 1; j < validTickers.length; j++) {
                            const ticker1 = validTickers[i];
                            const ticker2 = validTickers[j];
                            
                            const price1 = parseFloat(ticker1.last);
                            const price2 = parseFloat(ticker2.last);
                            
                            if (price1 > 0 && price2 > 0) {
                                const priceDiff = Math.abs(price2 - price1);
                                const priceDiffPercentage = (priceDiff / Math.min(price1, price2)) * 100;
                                
                                if (priceDiffPercentage > 0.1) { // 只显示差异大于0.1%的机会
                                    const buyExchange = price1 < price2 ? ticker1.market.name : ticker2.market.name;
                                    const sellExchange = price1 < price2 ? ticker2.market.name : ticker1.market.name;
                                    const buyPrice = Math.min(price1, price2);
                                    const sellPrice = Math.max(price1, price2);
                                    
                                    arbitrageOpportunities.push({
                                        coin: coin,
                                        coinChineseName: getChineseName(coin),
                                        buyExchange: buyExchange,
                                        buyPrice: buyPrice,
                                        sellExchange: sellExchange,
                                        sellPrice: sellPrice,
                                        priceDiff: priceDiff,
                                        priceDiffPercentage: priceDiffPercentage.toFixed(2),
                                        timestamp: new Date().toISOString(),
                                        data_source: 'CoinGecko_Real_API'
                                    });
                                }
                            }
                        }
                    }
                }
                
                await delay(REQUEST_DELAY);
                
            } catch (error) {
                console.warn(`⚠️ 分析 ${coin} 套利机会失败:`, error.message);
                continue;
            }
        }
        
        // 按利润排序，只保留前10个
        arbitrageOpportunities.sort((a, b) => 
            parseFloat(b.priceDiffPercentage) - parseFloat(a.priceDiffPercentage)
        );
        
        const topOpportunities = arbitrageOpportunities.slice(0, 10);
        
        // 保存套利数据
        const arbitrageFilePath = path.join(dataDir, 'arbitrage-opportunities.json');
        fs.writeFileSync(arbitrageFilePath, JSON.stringify(topOpportunities, null, 2));
        console.log(`✅ 套利机会已保存: ${topOpportunities.length} 个机会`);
        
        return topOpportunities;
        
    } catch (error) {
        console.error('❌ 生成套利数据失败:', error.message);
        // 返回空数组而不是抛出错误
        return [];
    }
}

/**
 * 生成基于真实数据的新闻
 */
function generateRealBasedNews(marketData) {
    console.log('🔄 基于真实数据生成新闻...');
    
    const news = [];
    const currentTime = new Date();
    
    try {
        // 找出涨幅最大的币种
        const topGainer = marketData.reduce((prev, current) => 
            (current.price_change_percentage_24h || 0) > (prev.price_change_percentage_24h || 0) ? current : prev
        );
        
        // 找出跌幅最大的币种
        const topLoser = marketData.reduce((prev, current) => 
            (current.price_change_percentage_24h || 0) < (prev.price_change_percentage_24h || 0) ? current : prev
        );
        
        // 计算市场总市值
        const totalMarketCap = marketData.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
        
        // 生成基于真实数据的新闻
        if (topGainer.price_change_percentage_24h > 5) {
            news.push({
                id: `real_news_${Date.now()}_1`,
                title: `${getChineseName(topGainer.id)}领涨市场，24小时涨幅达${topGainer.price_change_percentage_24h.toFixed(2)}%`,
                summary: `根据最新市场数据，${getChineseName(topGainer.id)}(${topGainer.symbol.toUpperCase()})在过去24小时内表现强劲，当前价格为$${topGainer.current_price.toFixed(2)}。`,
                source: '实时市场数据',
                date: new Date().toISOString().split('T')[0],
                category: 'market_analysis',
                data_source: 'Real_Market_Data'
            });
        }
        
        if (topLoser.price_change_percentage_24h < -5) {
            news.push({
                id: `real_news_${Date.now()}_2`,
                title: `${getChineseName(topLoser.id)}遭遇回调，24小时跌幅${Math.abs(topLoser.price_change_percentage_24h).toFixed(2)}%`,
                summary: `市场数据显示，${getChineseName(topLoser.id)}(${topLoser.symbol.toUpperCase()})近期承压，当前价格为$${topLoser.current_price.toFixed(2)}。`,
                source: '实时市场数据',
                date: new Date().toISOString().split('T')[0],
                category: 'market_analysis',
                data_source: 'Real_Market_Data'
            });
        }
        
        // 市场总览新闻
        news.push({
            id: `real_news_${Date.now()}_3`,
            title: `加密货币市场总市值达${(totalMarketCap / 1e12).toFixed(2)}万亿美元`,
            summary: `根据最新统计，当前加密货币市场总市值为${(totalMarketCap / 1e9).toFixed(0)}亿美元，比特币市值占比${((marketData[0]?.market_cap || 0) / totalMarketCap * 100).toFixed(1)}%。`,
            source: '市场数据统计',
            date: new Date().toISOString().split('T')[0],
            category: 'market_overview',
            data_source: 'Real_Market_Data'
        });
        
        // 保存新闻数据
        const newsFilePath = path.join(dataDir, 'news.json');
        fs.writeFileSync(newsFilePath, JSON.stringify(news, null, 2));
        console.log(`✅ 基于真实数据的新闻已保存: ${news.length} 条`);
        
        return news;
        
    } catch (error) {
        console.error('❌ 生成新闻失败:', error.message);
        return [];
    }
}

/**
 * 获取中文名称
 */
function getChineseName(coinId) {
    const names = {
        'bitcoin': '比特币',
        'ethereum': '以太坊',
        'binancecoin': '币安币',
        'ripple': '瑞波币',
        'cardano': '卡尔达诺',
        'solana': '索拉纳',
        'polkadot': '波卡',
        'dogecoin': '狗狗币',
        'avalanche-2': '雪崩',
        'tron': '波场',
        'chainlink': '链接',
        'litecoin': '莱特币',
        'uniswap': 'Uniswap',
        'polygon': 'Polygon',
        'stellar': '恒星币',
        'bitcoin-cash': '比特币现金',
        'monero': '门罗币',
        'cosmos': 'Cosmos',
        'ethereum-classic': '以太坊经典',
        'filecoin': '文件币'
    };
    return names[coinId] || coinId.toUpperCase();
}

/**
 * 获取交易所中文名称
 */
function getExchangeChineseName(exchangeId) {
    const names = {
        'binance': '币安',
        'gdax': 'Coinbase',
        'okex': '欧易',
        'huobi': '火币',
        'kucoin': '库币',
        'gate': 'Gate.io',
        'kraken': 'Kraken',
        'bitfinex': 'Bitfinex',
        'gemini': 'Gemini',
        'bybit_spot': 'Bybit'
    };
    return names[exchangeId] || exchangeId;
}

/**
 * 主函数
 */
async function main() {
    console.log('🚀 开始获取真实加密货币数据...');
    console.log('⏰ 开始时间:', new Date().toISOString());
    
    try {
        // 获取真实市场数据
        const marketData = await getRealMarketData();
        
        // 获取真实交易所数据
        const exchangeData = await getRealExchangeData();
        
        // 生成真实套利数据
        const arbitrageData = await generateRealArbitrageData(marketData);
        
        // 生成基于真实数据的新闻
        const newsData = generateRealBasedNews(marketData);
        
        // 更新最后更新时间
        const lastUpdated = {
            timestamp: new Date().toISOString(),
            formatted: new Date().toLocaleString('zh-CN', {
                timeZone: 'Asia/Shanghai',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }),
            data_source: 'CoinGecko_Real_API',
            total_coins: marketData.length,
            total_exchanges: exchangeData.length,
            total_arbitrage_opportunities: arbitrageData.length,
            total_news: newsData.length
        };
        
        const lastUpdatedPath = path.join(dataDir, 'last-updated.json');
        fs.writeFileSync(lastUpdatedPath, JSON.stringify(lastUpdated, null, 2));
        
        console.log('✅ 真实数据获取完成!');
        console.log(`📊 数据统计:`);
        console.log(`   - 币种数据: ${marketData.length} 个`);
        console.log(`   - 交易所数据: ${exchangeData.length} 个`);
        console.log(`   - 套利机会: ${arbitrageData.length} 个`);
        console.log(`   - 新闻数据: ${newsData.length} 条`);
        console.log('⏰ 完成时间:', new Date().toISOString());
        
        return {
            success: true,
            marketData,
            exchangeData,
            arbitrageData,
            newsData,
            lastUpdated
        };
        
    } catch (error) {
        console.error('❌ 真实数据获取失败:', error.message);
        console.error('📋 错误详情:', error.stack);
        
        // 创建错误报告
        const errorReport = {
            timestamp: new Date().toISOString(),
            error: error.message,
            stack: error.stack,
            data_source: 'Error_Report'
        };
        
        const errorPath = path.join(dataDir, 'error-report.json');
        fs.writeFileSync(errorPath, JSON.stringify(errorReport, null, 2));
        
        process.exit(1);
    }
}

// 执行主函数
if (require.main === module) {
    main();
}

module.exports = { main, getRealMarketData, getRealExchangeData };