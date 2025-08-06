// 主要JavaScript文件
document.addEventListener('DOMContentLoaded', function() {
    // 移动端菜单切换
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
    
    // 初始化页面功能
    initPage();
});

// 页面初始化函数
function initPage() {
    // 根据当前页面路径高亮导航菜单
    highlightCurrentNav();
    
    // 如果在首页，加载首页特定功能
    if (isHomePage()) {
        // 这些函数将在各自的JS文件中定义
        if (typeof loadMarketData === 'function') {
            loadMarketData();
        }
        
        if (typeof loadNewsFeed === 'function') {
            loadNewsFeed();
        }
        
        if (typeof loadAnnouncements === 'function') {
            loadAnnouncements();
        }
    }
}

// 检查是否为首页
function isHomePage() {
    const path = window.location.pathname;
    return path === '/' || path.endsWith('index.html') || path.split('/').pop() === '';
}

// 高亮当前导航项
function highlightCurrentNav() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        // 移除所有active类
        link.classList.remove('active');
        
        // 为当前页面链接添加active类
        if (currentPath.endsWith(linkPath) || 
            (linkPath === 'index.html' && isHomePage())) {
            link.classList.add('active');
        }
    });
}

// 格式化价格显示
function formatPrice(price) {
    if (!price) return '$0.00';
    
    // 如果价格大于等于1000，使用千位分隔符
    if (price >= 1000) {
        return '$' + price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    
    // 如果价格小于1000但大于等于1，保留2位小数
    if (price >= 1) {
        return '$' + price.toFixed(2);
    }
    
    // 如果价格小于1，保留更多小数位以显示有意义的数字
    return '$' + price.toPrecision(4);
}

// 格式化百分比变化
function formatChange(change) {
    if (!change) return '0.00%';
    
    const sign = change >= 0 ? '+' : '';
    return sign + change.toFixed(2) + '%';
}

// 添加价格变化样式类
function getPriceChangeClass(change) {
    if (!change) return '';
    return change >= 0 ? 'up' : 'down';
}

// 显示加载错误
function showError(container, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message || '加载数据时出错，请稍后再试。';
    
    // 清空容器并添加错误消息
    if (container) {
        container.innerHTML = '';
        container.appendChild(errorElement);
    }
}