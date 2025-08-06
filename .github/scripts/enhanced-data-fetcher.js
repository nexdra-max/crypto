        fs.writeFileSync(path.join(dataDir, 'comprehensive-report.json'), JSON.stringify(report, null, 2));
        
        // 更新最后更新时间
        const lastUpdated = {
            timestamp: new Date().toISOString(),
            formatted: moment().format('YYYY-MM-DD HH:mm:ss'),
            version: '2.0-enhanced',
            data_sources: ['CoinGecko', 'Smart Analysis'],
            total_coins: marketData.length,
            total_exchanges: exchangeData.length
        };
        fs.writeFileSync(path.join(dataDir, 'last-updated.json'), JSON.stringify(lastUpdated, null, 2));
        
        console.log('✅ 增强版数据获取完成!');
        console.log(`📊 处理了 ${marketData.length} 个币种和 ${exchangeData.length} 个交易所`);
        console.log('🔄 数据已更新到最新版本');
        
    } catch (error) {
        console.error('❌ 增强版数据获取失败:', error.message);
        process.exit(1);
    }
}

function getOverallMarketSentiment(marketData) {
    const positiveCount = marketData.filter(coin => (coin.price_change_percentage_24h || 0) > 0).length;
    const totalCount = marketData.length;
    const positiveRatio = positiveCount / totalCount;
    
    if (positiveRatio > 0.7) return 'very_bullish';
    if (positiveRatio > 0.6) return 'bullish';
    if (positiveRatio > 0.4) return 'neutral';
    if (positiveRatio > 0.3) return 'bearish';
    return 'very_bearish';
}

// 执行主函数
main().catch(error => {
    console.error('增强版数据获取系统出错:', error);
    process.exit(1);
});
