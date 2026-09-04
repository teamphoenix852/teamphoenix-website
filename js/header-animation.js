// js/header-animation.js
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.main-header');
    if (!header) return;

    // 檢查是否為移動設備
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Create canvas if it doesn't exist
    let canvas = document.getElementById('bouncingBalls');
    if (!canvas) {
        const container = document.createElement('div');
        container.className = 'bouncing-balls-container';
        canvas = document.createElement('canvas');
        canvas.id = 'bouncingBalls';
        container.appendChild(canvas);
        header.prepend(container);
    }

    const ctx = canvas.getContext('2d');
    
    // 獲取設備像素比，優化高清屏幕顯示
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas size with high DPI support
    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        // 設置CSS大小保持正確的顯示尺寸
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        
        // 縮放上下文以適應高DPI
        ctx.scale(dpr, dpr);
    }
    
    // 簡化字體列表，提高移動設備兼容性
    const chineseFonts = [
        '"FangSong", "STFangsong", KaiTi',  // 仿宋
		'"STKaiti", "KaiTi"',                // 楷體 (elegant)
		'"FZShuTi", "STHupo", KaiTi',              // 舒體 / 琥珀體 (artistic)
		'"FZYaoTi", "STCaiyun", KaiTi',            // 姚體 / 彩雲體 (decorative)
		'"LiSu", "STLiti", KaiTi',                 // 隸書 (ancient script)
		'"YouYuan", "STYuanti", KaiTi',       // 幼圓 (rounded, friendly)
		'"Microsoft YaHei", KaiTi'            // 微軟雅黑 (modern, widely available)		
    ];
    
    // 優化內容列表：區分單字、短語和emoji
    const shortWords = ['✨','✨','✨'];
    const mediumWords = ['✨','✨','✨',''];
    const emojiList = ['✨','✨','✨'];
    
    // 創建合併列表
    const allContent = [
        ...shortWords,
        ...mediumWords,
        ...emojiList
    ];
    
    // Word class
    class Word {
        constructor(lastWord = null) {
            // 移動設備使用更大的半徑
            this.baseRadius = isMobile ? 3 : 4;
            this.radius = Math.random() * this.baseRadius + 4;
            
            // 初始化位置在整個 canvas 範圍內
            const canvasWidth = canvas.width / dpr;
            const canvasHeight = canvas.height / dpr;

            this.x = Math.random() * (canvas.width/dpr - this.radius * 2) + this.radius;
            this.y = Math.random() * (canvas.height/dpr - this.radius * 2) + this.radius;
            
            // 移動設備使用更慢的速度
            const speedFactor = isMobile ? 0.6 : 0.8;
            this.dx = (Math.random() - 0.5) * speedFactor;
            this.dy = (Math.random() - 0.5) * speedFactor;
            
            this.energyLoss = isMobile ? 0.85 : 0.9; // 移動設備更多能量損失
            this.color = this.generateFestiveColor();
            
            // 避免選擇與上一個相同的內容
            let availableContent = allContent;
            if (lastWord) {
                availableContent = allContent.filter(word => word !== lastWord);
            }
            
            // 隨機選擇內容
            const type = Math.random();
            if (type < 0.4) {
                const filtered = availableContent.filter(word => shortWords.includes(word));
                this.word = filtered.length > 0 ? 
                    filtered[Math.floor(Math.random() * filtered.length)] : 
                    availableContent[Math.floor(Math.random() * availableContent.length)];
                this.type = 'short';
            } else if (type < 0.7) {
                const filtered = availableContent.filter(word => mediumWords.includes(word));
                this.word = filtered.length > 0 ? 
                    filtered[Math.floor(Math.random() * filtered.length)] : 
                    availableContent[Math.floor(Math.random() * availableContent.length)];
                this.type = 'medium';
            } else {
                const filtered = availableContent.filter(word => emojiList.includes(word));
                this.word = filtered.length > 0 ? 
                    filtered[Math.floor(Math.random() * filtered.length)] : 
                    availableContent[Math.floor(Math.random() * availableContent.length)];
                this.type = 'emoji';
            }
            
            this.fontFamily = chineseFonts[Math.floor(Math.random() * chineseFonts.length)];
            this.fontWeight = 'normal';
        }

        // 生成喜慶色彩
        generateFestiveColor() {
            const festiveColors = [
                'hsla(0, 90%, 55%, 0.9)',     // 紅色
                'hsla(45, 100%, 60%, 0.9)',   // 金色
                'hsla(30, 95%, 55%, 0.9)',    // 橙色
                'hsla(350, 85%, 60%, 0.9)',   // 粉紅
                'hsla(25, 90%, 50%, 0.9)',    // 橘黃
                'hsla(0, 80%, 65%, 0.9)'      // 亮紅
            ];
            return festiveColors[Math.floor(Math.random() * festiveColors.length)];
        }

        // 根據內容類型獲取字體大小
        getFontSize() {
            let baseSize;
            if (this.type === 'emoji') {
                // Emoji 需要更大的顯示空間
                baseSize = this.radius * (isMobile ? 2.8 : 2.6);
            } else if (this.type === 'medium') {
                baseSize = this.radius * (isMobile ? 2.6 : 2.4);
            } else {
                baseSize = this.radius * (isMobile ? 2.4 : 2.2);
            }
            return baseSize;
        }

        // 根據字體生成相應的樣式
        getFontStyle() {
            const fontSize = this.getFontSize();
            return `${this.fontWeight} ${fontSize}px ${this.fontFamily}`;
        }

        draw() {
            ctx.save();
            
            // 移動設備使用更簡單的陰影效果以提高性能
            if (!isMobile) {
                ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
                ctx.shadowBlur = 4;
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
            }
            
            // 設置字體
            if (this.type !== 'emoji') {
                ctx.font = this.getFontStyle();
                
                // 創建適合當前顏色的漸變（僅對文本）
                const gradient = ctx.createLinearGradient(
                    this.x - this.radius,
                    this.y - this.radius,
                    this.x + this.radius,
                    this.y + this.radius
                );
                
                // 金色系漸變
                if (this.color.includes('45, 100%')) { // 金色
                    gradient.addColorStop(0, 'rgba(255, 245, 220, 0.95)');
                    gradient.addColorStop(0.4, 'rgba(255, 215, 0, 0.9)');
                    gradient.addColorStop(1, 'rgba(184, 134, 11, 0.8)');
                } 
                // 紅色系漸變
                else if (this.color.includes('0, 90%')) { // 紅色
                    gradient.addColorStop(0, 'rgba(255, 240, 240, 0.95)');
                    gradient.addColorStop(0.4, 'rgba(255, 50, 50, 0.9)');
                    gradient.addColorStop(1, 'rgba(150, 0, 0, 0.8)');
                }
                // 橙色系漸變
                else {
                    gradient.addColorStop(0, 'rgba(255, 245, 230, 0.95)');
                    gradient.addColorStop(0.4, this.color);
                    gradient.addColorStop(1, this.color.replace('0.9)', '0.7)'));
                }
                
                // 文本描邊效果
                ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
                ctx.lineWidth = isMobile ? 1.5 : 2;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // 描邊（增加立體感）
                ctx.strokeText(this.word, this.x, this.y);
                
                // 填充主色
                ctx.fillStyle = gradient;
                ctx.fillText(this.word, this.x, this.y);
            } else {
                // 繪製Emoji - 使用固定顏色，因為Emoji通常自帶顏色
                ctx.font = this.getFontStyle();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = this.color.includes('0, 90%') ? 'rgba(255, 50, 50, 0.9)' : 
                              this.color.includes('45, 100%') ? 'rgba(255, 215, 0, 0.9)' : 
                              this.color;
                
                // Emoji不需要描邊
                ctx.fillText(this.word, this.x, this.y);
            }
            
            ctx.restore();
        }
        
        update() {
            // 重力效果
            this.dy += 0.02;
            
            const canvasWidth = canvas.width / dpr;
            const canvasHeight = canvas.height / dpr;
            
            // 水平邊界：不循環移動，離開畫面後從頂部隨機位置重生
            if (this.x + this.radius < 0 || this.x - this.radius > canvasWidth) {
                // 完全離開左右邊界，從頂部隨機位置重生
                this.resetFromTop();
                return;
            }

            
            // 垂直边界检测
            if (this.y + this.radius > canvasHeight) {
                this.y = canvasHeight - this.radius;
                this.dy = -Math.abs(this.dy) * this.energyLoss;
                this.dx += (Math.random() - 0.5) * 0.2;
            } 
            // 从顶部重生
            else if (this.y < -this.radius * 2) {
                this.resetFromTop();
            }
            
            this.x += this.dx;
            this.y += this.dy;
            this.draw();
        }
        
        resetFromTop() {
            const canvasWidth = canvas.width / dpr;

            // 從頂部隨機位置重生
            this.x = Math.random() * (canvasWidth - this.radius * 2) + this.radius;
            this.y = -this.radius * 2;
            
            const speedFactor = isMobile ? 0.6 : 0.8;
            this.dx = (Math.random() - 0.5) * speedFactor;
            this.dy = (Math.random() - 0.5) * speedFactor;
            
            this.color = this.generateFestiveColor();
            
            // 避免選擇與當前相同的內容
            let availableContent = allContent.filter(word => word !== this.word);
            if (availableContent.length === 0) {
                availableContent = allContent; // 如果過濾後沒有內容，使用全部
            }
            
            // 重新選擇內容
            const type = Math.random();
            if (type < 0.4) {
                const filtered = availableContent.filter(word => shortWords.includes(word));
                this.word = filtered.length > 0 ? 
                    filtered[Math.floor(Math.random() * filtered.length)] : 
                    availableContent[Math.floor(Math.random() * availableContent.length)];
                this.type = 'emoji';
            } else if (type < 0.7) {
                const filtered = availableContent.filter(word => mediumWords.includes(word));
                this.word = filtered.length > 0 ? 
                    filtered[Math.floor(Math.random() * filtered.length)] : 
                    availableContent[Math.floor(Math.random() * availableContent.length)];
                this.type = 'medium';
            } else {
                const filtered = availableContent.filter(word => emojiList.includes(word));
                this.word = filtered.length > 0 ? 
                    filtered[Math.floor(Math.random() * filtered.length)] : 
                    availableContent[Math.floor(Math.random() * availableContent.length)];
                this.type = 'emoji';
            }
            
            this.fontFamily = chineseFonts[Math.floor(Math.random() * chineseFonts.length)];
        }
    }
    
    // Animation control
    const words = [];
    let animationId;
    let lastTime = 0;
    const fps = isMobile ? 30 : 60; // 移動設備使用較低的FPS以節省電量
    
    function initAnimation() {
        resizeCanvas();
        const area = (canvas.width/dpr) * (canvas.height/dpr);
        
        // 移動設備使用更少的元素
        const wordCount = isMobile ? 
            3 :
            Math.min(Math.floor(area / 6000), 15);
        
        words.length = 0;
        
        // 初始化時避免重複
        let lastWord = null;
        for (let i = 0; i < wordCount; i++) {
            const word = new Word(lastWord);
            words.push(word);
            lastWord = word.word; // 記錄上一個字
        }
        
        function animate(currentTime) {
            // 限制FPS
            if (!lastTime || currentTime - lastTime > 1000/fps) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                words.forEach(word => word.update());
                lastTime = currentTime;
            }
            animationId = requestAnimationFrame(animate);
        }
        
        animate(0);
    }
    
    // Initialize
    initAnimation();
    
    // 防抖動的resize處理
    let resizeTimer;
    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationId);
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initAnimation();
        }, 250);
    });

    // Style the canvas
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '1';
    canvas.style.pointerEvents = 'none';
    
    // 移動設備優化：防止canvas過大影響性能
    if (isMobile) {
        canvas.style.maxHeight = '100px';
    }
});