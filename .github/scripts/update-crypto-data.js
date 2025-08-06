/**
 * 加密货币数据更新脚本
 * 
 * 该脚本通过CoinGecko API获取最新的加密货币数据，
 * 并将其保存到项目的data目录中，以便网站使用。
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

// 确保data目录存在
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// CoinGecko API端点
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
// 可选的API密钥
const API_KEY = process.env.COINGECKO_API_KEY || '';

// API请求配置
const apiConfig = {
    headers: {}
};

// 如果有API密钥，添加到请求头
if (API_KEY) {
    apiConfig.headers['x-cg-pro-api-key'] = API_KEY;
}

// 主要加密货币ID列表 - 全球前30大加密货币
const MAIN_COINS = [
    'bitcoin', 'ethereum', 'binancecoin', 'ripple', 'cardano', 
    'solana', 'polkadot', 'dogecoin', 'avalanche-2', 'tron',
    'chainlink', 'litecoin', 'uniswap', 'polygon', 'stellar',
    'bitcoin-cash', 'monero', 'cosmos', 'ethereum-classic', 'filecoin',
    'near', 'algorand', 'vechain', 'hedera-hashgraph', 'internet-computer',
    'eos', 'theta-token', 'axie-infinity', 'decentraland', 'the-sandbox'
];

// 主要交易所ID列表 - 全球前30大交易所
const MAIN_EXCHANGES = [
    'binance', 'gdax', 'okex', 'huobi', 'kucoin', 
    'gate', 'kraken', 'bitfinex', 'gemini', 'bybit_spot',
    'bitstamp', 'bittrex', 'bithumb', 'upbit', 'mexc',
    'bitget', 'crypto_com', 'phemex', 'coinex', 'poloniex',
    'wazirx', 'lbank', 'bitmart', 'whitebit', 'digifinex',
    'bkex', 'latoken', 'hotbit', 'xt', 'p2pb2b'
];

/**
 * 获取主要加密货币的市场数据
 */
async function getCoinsMarketData() {
    try {
        console.log('获取加密货币市场数据...');
        
        // 由于API限制，可能需要分批获取数据
        const batchSize = 15; // CoinGecko免费API每次最多查询约25个币种
        const batches = [];
        
        for (let i = 0; i < MAIN_COINS.length; i += batchSize) {
            const batchCoins = MAIN_COINS.slice(i, i + batchSize);
            batches.push(batchCoins);
        }
        
        let allCoinsData = [];
        
        for (const [index, batch] of batches.entries()) {
            console.log(`获取第 ${index + 1}/${batches.length} 批币种数据...`);
            
            const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
                params: {
                    vs_currency: 'usd',
                    ids: batch.join(','),
                    order: 'market_cap_desc',
                    per_page: 100,
                    page: 1,
                    sparkline: false,
                    price_change_percentage: '24h,7d,30d'
                },
                ...apiConfig
            });
            
            allCoinsData = [...allCoinsData, ...response.data];
            
            // 为每个币种添加中文名称
            allCoinsData = allCoinsData.map(coin => {
                const chineseName = getChineseName(coin.id);
                return {
                    ...coin,
                    chinese_name: chineseName
                };
            });
            
            // 避免API限流
            if (index < batches.length - 1) {
                console.log('等待API冷却时间...');
                await new Promise(resolve => setTimeout(resolve, 6000)); // 等待6秒避免免费API限流
            }
        }
        
        console.log(`成功获取 ${allCoinsData.length} 个币种的市场数据`);
        
        // 保存数据到文件
        const filePath = path.join(dataDir, 'coins-market.json');
        fs.writeFileSync(filePath, JSON.stringify(allCoinsData, null, 2));
        console.log(`市场数据已保存到 ${filePath}`);
        
        return allCoinsData;
    } catch (error) {
        console.error('获取加密货币市场数据时出错:', error.message);
        return [];
    }
}

/**
 * 获取交易所列表数据
 */
async function getExchangesData() {
    try {
        console.log('获取交易所数据...');
        
        // 获取所有交易所数据
        const response = await axios.get(`${COINGECKO_API_URL}/exchanges`, apiConfig);
        const allExchanges = response.data;
        
        // 筛选主要交易所
        const mainExchangesData = allExchanges.filter(exchange => 
            MAIN_EXCHANGES.includes(exchange.id)
        );
        
        // 为交易所添加中文名称
        const exchangesWithChineseNames = mainExchangesData.map(exchange => {
            const chineseName = getExchangeChineseName(exchange.id);
            return {
                ...exchange,
                chinese_name: chineseName
            };
        });
        
        console.log(`成功获取 ${exchangesWithChineseNames.length} 个交易所的数据`);
        
        // 保存数据到文件
        const filePath = path.join(dataDir, 'exchanges.json');
        fs.writeFileSync(filePath, JSON.stringify(exchangesWithChineseNames, null, 2));
        console.log(`交易所数据已保存到 ${filePath}`);
        
        return exchangesWithChineseNames;
    } catch (error) {
        console.error('获取交易所数据时出错:', error.message);
        return [];
    }
}

/**
 * 获取交易所的交易对数据
 */
async function getExchangePairsData() {
    try {
        console.log('获取交易所交易对数据...');
        
        const exchangePairs = {};
        
        // 为每个主要交易所获取交易对数据
        // 由于API限制，只获取前10个交易所的数据
        const topExchanges = MAIN_EXCHANGES.slice(0, 10);
        
        for (const [index, exchangeId] of topExchanges.entries()) {
            try {
                console.log(`获取 ${exchangeId} 的交易对数据...`);
                
                // 由于API限制，只获取前5个主要币种的交易对
                const topCoins = MAIN_COINS.slice(0, 5);
                
                const response = await axios.get(`${COINGECKO_API_URL}/exchanges/${exchangeId}/tickers`, {
                    params: {
                        coin_ids: topCoins.join(','),
                        include_exchange_logo: false,
                        page: 1,
                        depth: false,
                        order: 'volume_desc'
                    },
                    ...apiConfig
                });
                
                exchangePairs[exchangeId] = response.data.tickers;
                console.log(`成功获取 ${response.data.tickers.length} 个 ${exchangeId} 的交易对`);
                
                // 避免API限流
                if (index < topExchanges.length - 1) {
                    console.log('等待API冷却时间...');
                    await new Promise(resolve => setTimeout(resolve, 6000)); // 等待6秒避免免费API限流
                }
            } catch (error) {
                console.error(`获取 ${exchangeId} 交易对数据时出错:`, error.message);
                exchangePairs[exchangeId] = [];
            }
        }
        
        // 保存数据到文件
        const filePath = path.join(dataDir, 'exchange-pairs.json');
        fs.writeFileSync(filePath, JSON.stringify(exchangePairs, null, 2));
        console.log(`交易所交易对数据已保存到 ${filePath}`);
        
        return exchangePairs;
    } catch (error) {
        console.error('获取交易所交易对数据时出错:', error.message);
        return {};
    }
}

/**
 * 获取币种的中文名称
 */
function getChineseName(coinId) {
    const chineseNames = {
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
        'filecoin': '文件币',
        'near': 'NEAR协议',
        'algorand': '算法币',
        'vechain': '唯链',
        'hedera-hashgraph': 'Hedera',
        'internet-computer': 'Internet Computer',
        'eos': 'EOS',
        'theta-token': 'Theta',
        'axie-infinity': 'Axie Infinity',
        'decentraland': 'Decentraland',
        'the-sandbox': 'The Sandbox'
    };
    
    return chineseNames[coinId] || coinId;
}

/**
 * 获取交易所的中文名称
 */
function getExchangeChineseName(exchangeId) {
    const chineseNames = {
        'binance': '币安',
        'gdax': 'Coinbase交易所',
        'okex': '欧易',
        'huobi': '火币',
        'kucoin': '库币',
        'gate': 'Gate.io',
        'kraken': 'Kraken',
        'bitfinex': 'Bitfinex',
        'gemini': 'Gemini',
        'bybit_spot': 'Bybit',
        'bitstamp': 'Bitstamp',
        'bittrex': 'Bittrex',
        'bithumb': 'Bithumb',
        'upbit': 'Upbit',
        'mexc': 'MEXC',
        'bitget': 'Bitget',
        'crypto_com': 'Crypto.com',
        'phemex': 'Phemex',
        'coinex': 'CoinEx',
        'poloniex': 'Poloniex',
        'wazirx': 'WazirX',
        'lbank': 'LBank',
        'bitmart': 'BitMart',
        'whitebit': 'WhiteBIT',
        'digifinex': 'DigiFinex',
        'bkex': 'BKEX',
        'latoken': 'LATOKEN',
        'hotbit': 'Hotbit',
        'xt': 'XT.COM',
        'p2pb2b': 'P2B'
    };
    
    return chineseNames[exchangeId] || exchangeId;
}

/**
 * 生成套利机会数据
 */
function generateArbitrageOpportunities(exchangePairs) {
    try {
        console.log('生成套利机会数据...');
        
        const arbitrageOpportunities = [];
        
        // 遍历每个币种
        for (const coinId of MAIN_COINS.slice(0, 5)) { // 只处理前5个主要币种
            // 收集该币种在各交易所的价格
            const coinPrices = {};
            const coinChineseName = getChineseName(coinId);
            
            for (const [exchangeId, pairs] of Object.entries(exchangePairs)) {
                // 查找该币种的USDT或USD交易对
                const usdtPair = pairs.find(pair => 
                    pair.base.toLowerCase() === coinId.toLowerCase() && 
                    (pair.target.toLowerCase() === 'usdt' || pair.target.toLowerCase() === 'usd')
                );
                
                if (usdtPair) {
                    coinPrices[exchangeId] = {
                        price: usdtPair.last,
                        volume: usdtPair.volume,
                        exchangeChineseName: getExchangeChineseName(exchangeId)
                    };
                }
            }
            
            // 如果至少有两个交易所有该币种的价格，计算套利机会
            const exchanges = Object.keys(coinPrices);
            if (exchanges.length >= 2) {
                // 找出最低价和最高价
                let lowestExchange = exchanges[0];
                let highestExchange = exchanges[0];
                
                for (const exchange of exchanges) {
                    if (coinPrices[exchange].price < coinPrices[lowestExchange].price) {
                        lowestExchange = exchange;
                    }
                    
                    if (coinPrices[exchange].price > coinPrices[highestExchange].price) {
                        highestExchange = exchange;
                    }
                }
                
                // 计算价差百分比
                const lowPrice = coinPrices[lowestExchange].price;
                const highPrice = coinPrices[highestExchange].price;
                const priceDiff = highPrice - lowPrice;
                const priceDiffPercentage = (priceDiff / lowPrice) * 100;
                
                // 如果价差超过0.1%，记录套利机会
                if (priceDiffPercentage > 0.1 && lowestExchange !== highestExchange) {
                    arbitrageOpportunities.push({
                        coin: coinId,
                        coinChineseName: coinChineseName,
                        buyExchange: lowestExchange,
                        buyExchangeChineseName: coinPrices[lowestExchange].exchangeChineseName,
                        buyPrice: lowPrice,
                        sellExchange: highestExchange,
                        sellExchangeChineseName: coinPrices[highestExchange].exchangeChineseName,
                        sellPrice: highPrice,
                        priceDiff: priceDiff,
                        priceDiffPercentage: priceDiffPercentage,
                        timestamp: new Date().toISOString()
                    });
                }
            }
        }
        
        console.log(`找到 ${arbitrageOpportunities.length} 个套利机会`);
        
        // 按价差百分比排序
        arbitrageOpportunities.sort((a, b) => b.priceDiffPercentage - a.priceDiffPercentage);
        
        // 保存数据到文件
        const filePath = path.join(dataDir, 'arbitrage-opportunities.json');
        fs.writeFileSync(filePath, JSON.stringify(arbitrageOpportunities, null, 2));
        console.log(`套利机会数据已保存到 ${filePath}`);
        
        return arbitrageOpportunities;
    } catch (error) {
        console.error('生成套利机会数据时出错:', error.message);
        return [];
    }
}

/**
 * 获取加密货币新闻
 */
async function getCryptoNews() {
    try {
        console.log('获取加密货币新闻...');
        
        // 由于没有直接的新闻API，我们创建一些模拟新闻数据
        // 在实际项目中，可以使用新闻API如CryptoCompare News API或CryptoPanic API
        
        const currentDate = new Date();
        const news = [
            {
                id: 1,
                title: '比特币突破新高位，机构投资者持续进场',
                summary: '随着机构投资者持续增加对加密货币的配置，比特币价格创下近期新高。',
                source: '币圈日报',
                date: moment(currentDate).format('YYYY-MM-DD'),
                image: 'images/news-bitcoin.jpg',
                url: 'pages/news/bitcoin-new-high.html'
            },
            {
                id: 2,
                title: '以太坊网络升级成功，燃烧机制正式启动',
                summary: '以太坊网络完成重要升级，引入ETH燃烧机制，有望缓解网络拥堵问题。',
                source: '区块链技术报告',
                date: moment(currentDate).subtract(1, 'days').format('YYYY-MM-DD'),
                image: 'images/news-ethereum.jpg',
                url: 'pages/news/ethereum-upgrade.html'
            },
            {
                id: 3,
                title: '监管趋严，多家交易所加强合规措施',
                summary: '面对全球范围内加强的加密货币监管，多家主流交易所宣布加强KYC和反洗钱措施。',
                source: '加密财经',
                date: moment(currentDate).subtract(2, 'days').format('YYYY-MM-DD'),
                image: 'images/news-regulation.jpg',
                url: 'pages/news/exchange-compliance.html'
            },
            {
                id: 4,
                title: 'DeFi总锁仓量创新高，生态系统持续扩张',
                summary: 'DeFi生态系统持续增长，总锁仓量(TVL)创下新高，Aave、Curve和Uniswap领跑市场。',
                source: 'DeFi观察',
                date: moment(currentDate).subtract(3, 'days').format('YYYY-MM-DD'),
                image: 'images/news-defi.jpg',
                url: 'pages/news/defi-growth.html'
            },
            {
                id: 5,
                title: '大型支付公司宣布支持加密货币支付',
                summary: '全球知名支付处理商宣布将在其平台上支持比特币、以太坊等主流加密货币支付。',
                source: '支付科技周刊',
                date: moment(currentDate).subtract(4, 'days').format('YYYY-MM-DD'),
                image: 'images/news-payment.jpg',
                url: 'pages/news/crypto-payments.html'
            },
            {
                id: 6,
                title: 'NFT市场持续火热，知名艺术家作品拍出天价',
                summary: '非同质化代币(NFT)市场热度不减，知名数字艺术家最新作品在拍卖中以高价成交。',
                source: '数字艺术评论',
                date: moment(currentDate).subtract(5, 'days').format('YYYY-MM-DD'),
                image: 'images/news-nft.jpg',
                url: 'pages/news/nft-auction.html'
            }
        ];
        
        // 保存数据到文件
        const filePath = path.join(dataDir, 'news.json');
        fs.writeFileSync(filePath, JSON.stringify(news, null, 2));
        console.log(`新闻数据已保存到 ${filePath}`);
        
        return news;
    } catch (error) {
        console.error('获取加密货币新闻时出错:', error.message);
        return [];
    }
}

/**
 * 获取活动公告
 */
async function getAnnouncements() {
    try {
        console.log('获取活动公告...');
        
        // 创建模拟公告数据
        const currentDate = new Date();
        const announcements = [
            {
                id: 1,
                title: '网站功能更新公告',
                content: '我们已经更新了网站的市场数据功能，现在支持更多交易所的实时价格对比。',
                date: moment(currentDate).format('YYYY-MM-DD'),
                tags: ['功能更新', '重要通知']
            },
            {
                id: 2,
                title: '新增交易所数据支持',
                content: '我们已新增对多家交易所的数据支持，用户现可查看这些交易所的实时价格和交易信息。',
                date: moment(currentDate).subtract(2, 'days').format('YYYY-MM-DD'),
                tags: ['功能更新', '交易所']
            },
            {
                id: 3,
                title: '加密货币安全防护指南已发布',
                content: '我们发布了最新的《加密货币安全防护指南》，详细介绍如何保护您的数字资产安全。',
                date: moment(currentDate).subtract(4, 'days').format('YYYY-MM-DD'),
                tags: ['安全指南', '教程']
            }
        ];
        
        // 保存数据到文件
        const filePath = path.join(dataDir, 'announcements.json');
        fs.writeFileSync(filePath, JSON.stringify(announcements, null, 2));
        console.log(`公告数据已保存到 ${filePath}`);
        
        return announcements;
    } catch (error) {
        console.error('获取活动公告时出错:', error.message);
        return [];
    }
}

/**
 * 生成最后更新时间数据
 */
function generateLastUpdated() {
    const lastUpdated = {
        timestamp: new Date().toISOString(),
        formatted: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    
    // 保存数据到文件
    const filePath = path.join(dataDir, 'last-updated.json');
    fs.writeFileSync(filePath, JSON.stringify(lastUpdated, null, 2));
    console.log(`最后更新时间已保存到 ${filePath}`);
    
    return lastUpdated;
}

/**
 * 主函数
 */
async function main() {
    console.log('开始更新加密货币数据...');
    console.log('时间:', new Date().toISOString());
    
    try {
        // 获取市场数据
        await getCoinsMarketData();
        
        // 获取交易所数据
        await getExchangesData();
        
        // 获取交易所交易对数据
        const exchangePairs = await getExchangePairsData();
        
        // 生成套利机会数据
        generateArbitrageOpportunities(exchangePairs);
        
        // 获取新闻数据
        await getCryptoNews();
        
        // 获取公告数据
        await getAnnouncements();
        
        // 生成最后更新时间
        generateLastUpdated();
        
        console.log('加密货币数据更新完成!');
    } catch (error) {
        console.error('更新过程中出错:', error);
    }
}

// 执行主函数
main().catch(error => {
    console.error('更新加密货币数据时出错:', error);
    process.exit(1);
});
