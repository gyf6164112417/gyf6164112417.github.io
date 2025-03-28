/**
 * 国科智飞网站脚本 - 优化版
 */

// 配置参数
const CONFIG = {
    // 性能优化设置
    PARTICLE_COUNT: 5,
    PARTICLE_MOBILE: false,
    THROTTLE_DELAY: 100,
    
    // 动画设置
    SCROLL_THRESHOLD: 0.1,
    RIPPLE_DURATION: 600,
    SHAKE_DURATION: 500
};

// DOM元素缓存 - 提高性能
let DOM = {};

/**
 * 节流函数 - 控制高频事件触发频率
 */
function throttle(callback, delay = CONFIG.THROTTLE_DELAY) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            callback.apply(this, args);
        }
    };
}

/**
 * 检测设备类型
 */
function detectDeviceType() {
    return {
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768,
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };
}

/**
 * 页脚年份更新
 */
function updateCopyrightYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * 确保公司标语显示
 */
function ensureSloganVisible() {
    const slogan = document.querySelector('.company-slogan');
    if (slogan) {
        slogan.style.display = 'block';
        slogan.style.opacity = '1';
        slogan.style.visibility = 'visible';
    }
}

/**
 * 创建动态背景粒子
 */
function createDynamicParticles() {
    const { isMobile, prefersReducedMotion } = detectDeviceType();
    
    // 如果是移动设备或用户偏好减少动画，则不创建粒子
    if (isMobile && !CONFIG.PARTICLE_MOBILE || prefersReducedMotion) {
        return;
    }
    
    const particles = document.querySelector('.particles');
    if (!particles) return;
    
    // 创建文档片段以提高性能
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
        const particle = document.createElement('div');
        particle.classList.add('dynamic-particle', 'particle');
        
        // 随机粒子属性
        const size = Math.random() * 6 + 2;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 15;
        const opacity = Math.random() * 0.2 + 0.1;
        
        // 设置粒子样式
        Object.assign(particle.style, {
            width: `${size}px`,
            height: `${size}px`,
            left: `${posX}%`,
            top: `${posY}%`,
            position: 'absolute',
            background: `rgba(25, 118, 210, ${opacity})`,
            borderRadius: '50%',
            animation: `floatAnimation ${duration}s infinite linear ${delay}s`
        });
        
        fragment.appendChild(particle);
    }
    
    // 一次性添加所有粒子到DOM
    particles.appendChild(fragment);
}

/**
 * 设置滚动触发动画
 */
function setupScrollAnimations() {
    const { prefersReducedMotion } = detectDeviceType();
    if (prefersReducedMotion) return;
    
    const elements = document.querySelectorAll(
        '.card, .meeting-schedule, .experts-section, ' +
        '.ai-basics-section, footer, .expert-card, .ai-category'
    );
    
    if (!('IntersectionObserver' in window)) {
        // 回退方案：简单地显示所有元素
        elements.forEach(el => {
            el.classList.add('scroll-animation', 'animate-in');
        });
        return;
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // 元素已显示，不再观察
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: CONFIG.SCROLL_THRESHOLD });
    
    // 添加动画类并开始观察
    elements.forEach(el => {
        el.classList.add('scroll-animation');
        observer.observe(el);
    });
}

/**
 * 设置3D卡片效果
 */
function setup3DCardEffect() {
    const { isMobile, prefersReducedMotion } = detectDeviceType();
    if (isMobile || prefersReducedMotion) return;
    
    const cards = document.querySelectorAll('.card, .expert-card, .ai-category');
    
    // 使用事件委托减少事件监听器数量
    document.addEventListener('mousemove', throttle(function(e) {
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            
            // 检查鼠标是否在卡片上
            if (
                e.clientX >= rect.left && 
                e.clientX <= rect.right && 
                e.clientY >= rect.top && 
                e.clientY <= rect.bottom
            ) {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const xPercent = x / rect.width - 0.5;
                const yPercent = y / rect.height - 0.5;
                
                card.style.transform = `perspective(1000px) rotateY(${xPercent * 5}deg) rotateX(${yPercent * -5}deg) translateZ(10px)`;
            }
        });
    }));
    
    // 恢复默认样式
    cards.forEach(card => {
        card.addEventListener('mouseleave', function() {
            // 使用requestAnimationFrame来优化性能
            requestAnimationFrame(() => {
                this.style.transform = '';
            });
        });
    });
}

/**
 * 设置点击交互效果
 */
function setupClickInteractions() {
    const { isMobile, prefersReducedMotion } = detectDeviceType();
    
    // 标题抖动效果
    document.querySelectorAll('.card h2, .expert-info h3, .ai-category h3').forEach(heading => {
        heading.addEventListener('click', function() {
            if (!isMobile && !prefersReducedMotion) {
                this.style.animation = `shake ${CONFIG.SHAKE_DURATION}ms ease-in-out`;
                setTimeout(() => {
                    this.style.animation = '';
                }, CONFIG.SHAKE_DURATION);
            }
        });
    });
    
    // 涟漪效果 - 移动端不启用
    if (!isMobile && !prefersReducedMotion) {
        document.querySelectorAll('.card, .expert-card, .ai-category').forEach(card => {
            card.addEventListener('click', function(e) {
                // 创建涟漪元素
                const ripple = document.createElement('div');
                ripple.className = 'ripple';
                
                // 计算涟漪位置
                const rect = this.getBoundingClientRect();
                ripple.style.left = `${e.clientX - rect.left}px`;
                ripple.style.top = `${e.clientY - rect.top}px`;
                
                // 添加涟漪元素
                this.appendChild(ripple);
                
                // 动画结束后移除涟漪元素
                setTimeout(() => {
                    ripple.remove();
                }, CONFIG.RIPPLE_DURATION);
            });
        });
    }
}

/**
 * 优化图片加载
 */
function optimizeImages() {
    // 检查浏览器是否支持原生懒加载
    if ('loading' in HTMLImageElement.prototype) {
        // 浏览器支持原生懒加载，确保属性设置正确
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            img.loading = 'lazy';
        });
    } else {
        // 浏览器不支持原生懒加载，使用IntersectionObserver实现
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        if (lazyImages.length > 0 && 'IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        if (lazyImage.dataset.src) {
                            lazyImage.src = lazyImage.dataset.src;
                        }
                        imageObserver.unobserve(lazyImage);
                    }
                });
            });
            
            lazyImages.forEach(image => imageObserver.observe(image));
        }
    }
}

/**
 * 初始化函数
 */
function init() {
    // 缓存DOM元素
    DOM = {
        currentYear: document.getElementById('current-year'),
        slogan: document.querySelector('.company-slogan'),
        particles: document.querySelector('.particles')
    };
    
    // 执行初始化功能
    updateCopyrightYear();
    ensureSloganVisible();
    
    // 性能优化：使用requestIdleCallback延迟非关键功能
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            createDynamicParticles();
            setupScrollAnimations();
            setup3DCardEffect();
            setupClickInteractions();
            optimizeImages();
        });
    } else {
        // 回退方案
        setTimeout(() => {
            createDynamicParticles();
            setupScrollAnimations();
            setup3DCardEffect();
            setupClickInteractions();
            optimizeImages();
        }, 100);
    }
}

// 当DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
} 