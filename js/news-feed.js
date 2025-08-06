// 新闻数据处理JavaScript文件
// 从本地数据文件加载新闻和公告

// 数据文件路径
const DATA_PATH = 'data';

// 加载新闻数据
async function loadNewsFeed() {
    const newsContainer = document.getElementById('news-container');
    if (!newsContainer) return;
    
    try {
        // 显示加载状态
        newsContainer.innerHTML = '<div class="news-loading">加载中...</div>';
        
        // 获取新闻数据
        const response = await fetch(`${DATA_PATH}/news.json`);
        
        if (!response.ok) {
            throw new Error('数据加载失败');
        }
        
        const newsData = await response.json();
        
        // 清空加载状态
        newsContainer.innerHTML = '';
        
        // 在首页只显示前3条新闻
        const newsToShow = isHomePage() ? newsData.slice(0, 3) : newsData;
        
        // 创建新闻卡片
        newsToShow.forEach(news => {
            const newsCard = document.createElement('div');
            newsCard.className = 'news-card';
            
            // 处理图片路径，确保相对路径正确
            let imagePath = news.image;
            if (isHomePage()) {
                // 首页已经在根目录，不需要调整路径
            } else if (window.location.pathname.includes('/pages/')) {
                // 如果在pages目录下，需要添加上级目录
                imagePath = `../${news.image}`;
            }
            
            newsCard.innerHTML = `
                <div class="news-image">
                    <img src="${imagePath}" alt="${news.title}" onerror="this.src='${isHomePage() ? '' : '../'}images/news-placeholder.jpg'">
                </div>
                <div class="news-content">
                    <h3><a href="${isHomePage() ? '' : '../'}${news.url}">${news.title}</a></h3>
                    <p>${news.summary}</p>
                    <div class="news-meta">
                        <span>${news.source}</span>
                        <span>${news.date}</span>
                    </div>
                </div>
            `;
            
            newsContainer.appendChild(newsCard);
        });
        
        // 如果没有新闻数据
        if (newsToShow.length === 0) {
            newsContainer.innerHTML = '<div class="no-data">暂无新闻数据</div>';
        }
    } catch (error) {
        console.error('加载新闻数据时出错:', error);
        showError(newsContainer, '加载新闻数据失败');
    }
}

// 加载公告数据
async function loadAnnouncements() {
    const announcementsContainer = document.getElementById('announcements-container');
    if (!announcementsContainer) return;
    
    try {
        // 显示加载状态
        announcementsContainer.innerHTML = '<div class="announcement-loading">加载中...</div>';
        
        // 获取公告数据
        const response = await fetch(`${DATA_PATH}/announcements.json`);
        
        if (!response.ok) {
            throw new Error('数据加载失败');
        }
        
        const announcementsData = await response.json();
        
        // 清空加载状态
        announcementsContainer.innerHTML = '';
        
        // 在首页只显示前2条公告
        const announcementsToShow = isHomePage() ? announcementsData.slice(0, 2) : announcementsData;
        
        // 创建公告项
        announcementsToShow.forEach(announcement => {
            const announcementItem = document.createElement('div');
            announcementItem.className = 'announcement-item';
            
            announcementItem.innerHTML = `
                <div class="announcement-header">
                    <h3 class="announcement-title">${announcement.title}</h3>
                    <span class="announcement-date">${announcement.date}</span>
                </div>
                <div class="announcement-content">
                    <p>${announcement.content}</p>
                </div>
                <div class="announcement-tags">
                    ${announcement.tags.map(tag => `<span class="announcement-tag">${tag}</span>`).join('')}
                </div>
            `;
            
            announcementsContainer.appendChild(announcementItem);
        });
        
        // 如果没有公告数据
        if (announcementsToShow.length === 0) {
            announcementsContainer.innerHTML = '<div class="no-data">暂无公告数据</div>';
        }
    } catch (error) {
        console.error('加载公告数据时出错:', error);
        showError(announcementsContainer, '加载公告数据失败');
    }
}

// 加载套利机会数据
async function loadArbitrageOpportunities() {
    const arbitrageContainer = document.getElementById('arbitrage-opportunities');
    if (!arbitrageContainer) return;
    
    try {
        // 显示加载状态
        arbitrageContainer.innerHTML = '<div class="arbitrage-loading">分析中...</div>';
        
        // 获取套利机会数据
        const response = await fetch(`${DATA_PATH}/arbitrage-opportunities.json`);
        
        if (!response.ok) {
            throw new Error('数据加载失败');
        }
        
        const arbitrageData = await response.json();
        
        // 清空加载状态
        arbitrageContainer.innerHTML = '';
        
        // 显示套利机会
        if (arbitrageData.length > 0) {
            arbitrageData.slice(0, 3).forEach((opportunity, index) => {
                const arbitrageCard = document.createElement('div');
                arbitrageCard.className = 'arbitrage-card';
                
                arbitrageCard.innerHTML = `
                    <div class="arbitrage-header">
                        <h3>套利机会 #${index + 1}</h3>
                        <span class="profit">预计利润: +${opportunity.priceDiffPercentage.toFixed(2)}%</span>
                    </div>
                    <div class="arbitrage-body">
                        <div class="arbitrage-step">
                            <span class="step-number">1</span>
                            <span class="step-desc">在${opportunity.buyExchangeChineseName}以 ${formatPrice(opportunity.buyPrice)} 买入 ${opportunity.coinChineseName}</span>
                        </div>
                        <div class="arbitrage-arrow">
                            <i class="fas fa-arrow-down"></i>
                        </div>
                        <div class="arbitrage-step">
                            <span class="step-number">2</span>
                            <span class="step-desc">转账至${opportunity.sellExchangeChineseName} (需考虑转账费用)</span>
                        </div>
                        <div class="arbitrage-arrow">
                            <i class="fas fa-arrow-down"></i>
                        </div>
                        <div class="arbitrage-step">
                            <span class="step-number">3</span>
                            <span class="step-desc">在${opportunity.sellExchangeChineseName}以 ${formatPrice(opportunity.sellPrice)} 卖出</span>
                        </div>
                    </div>
                    <div class="arbitrage-footer">
                        <p>注意：实际套利需考虑交易手续费、转账费用和市场滑点等因素</p>
                    </div>
                `;
                
                arbitrageContainer.appendChild(arbitrageCard);
            });
        } else {
            arbitrageContainer.innerHTML = '<div class="no-data">暂无套利机会</div>';
        }
    } catch (error) {
        console.error('加载套利机会数据时出错:', error);
        showError(arbitrageContainer, '加载套利数据失败');
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 如果在首页，加载首页特定功能
    if (isHomePage()) {
        loadNewsFeed();
        loadAnnouncements();
    }
    
    // 如果在新闻页面，加载完整新闻列表
    if (window.location.pathname.includes('news.html')) {
        loadNewsFeed();
    }
    
    // 如果在公告页面，加载完整公告列表
    if (window.location.pathname.includes('announcements.html')) {
        loadAnnouncements();
    }
    
    // 如果在市场页面，加载套利机会
    if (window.location.pathname.includes('market.html')) {
        loadArbitrageOpportunities();
    }
});
