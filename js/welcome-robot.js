// Robot Greetings Controller
document.addEventListener('DOMContentLoaded', function() {
	const robotContainer = document.querySelector('.robot-gif-container');
	const bubble = document.getElementById('greetingBubble');
	
	if (!robotContainer || !bubble) return;
	
	// 時間問候函數
	function getTimeBasedGreeting() {
		const hour = new Date().getHours();
		if (hour < 12) return "Good Morning! ☀️";
		if (hour < 18) return "Good Afternoon! ☕";
		return "Good Evening! 🌙";
	}
	
	// 問候語陣列 - 第一個就是時間問候
	const greetings = [
		getTimeBasedGreeting(),  // 時間問候放在第一個
		"歡迎！ 😊",
		"Welcome! 👋",
		"您好呀! 😄",
		"Hello there! 👋",
		"I'm here for you! 🤝",
		"為您效勞！ 💞",
		"🌟 Team Phoenix! 🌟",
		"System Integrator! 🧑‍🔧",
		"IT Solutions Provider!⭐",
		"🔥 創新與卓越! ✌",
		"🪐 Innovation! 💫",
		"Excellence! 💯",
		"Click me for luck! 🤞",
		"祝您好運！ 🍀"
	];
	
	let currentIndex = 0;
	let isHovering = false;
	let intervalTime = 9000; // 9秒更換一次
	
	// 更換問候語函數
	function changeGreeting() {
		if (!isHovering) {
			// 立即開始淡出（縮短顯示時間）
			bubble.style.transition = 'opacity 0.2s ease, transform 0.2s ease'; // 加快過渡

			bubble.style.opacity = '0';
			bubble.style.transform = 'translateX(-50%) translateY(5px)';
			
			setTimeout(() => {
				// 輪到下一個問候語
				currentIndex = (currentIndex + 1) % greetings.length;
				bubble.textContent = greetings[currentIndex];
				
				// 淡入
				bubble.style.opacity = '1';
				bubble.style.transform = 'translateX(-50%) translateY(0)';
			}, 300);
		}
	}
	
	// 啟動自動輪播
	setInterval(changeGreeting, intervalTime);
	
	// 懸停效果
	robotContainer.addEventListener('mouseenter', function() {
		isHovering = true;
		bubble.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
		bubble.style.opacity = '1';
		bubble.textContent = "👋 Hello there!";
		
		this.style.transform = 'translateY(-10px)';
		setTimeout(() => {
			this.style.transform = 'translateY(0)';
		}, 300);
	});
	
	robotContainer.addEventListener('mouseleave', function() {
		isHovering = false;
		bubble.textContent = greetings[currentIndex];
		
		setTimeout(() => {
			if (!isHovering) {
				bubble.style.opacity = '1';
			}
		}, 1000);
	});
	
	// 點擊效果
	robotContainer.addEventListener('click', function() {
		this.style.transform = 'translateY(-15px)';
		setTimeout(() => {
			this.style.transform = 'translateY(0)';
		}, 250);
		
		bubble.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
		bubble.style.opacity = '1';
		bubble.textContent = '祝您好運！🔥';
		
		setTimeout(() => {
			const randomIndex = Math.floor(Math.random() * greetings.length);
			bubble.textContent = greetings[randomIndex];
			currentIndex = randomIndex;
		}, 1500);
	});
	
	// 初始顯示 - 先顯示時間問候，2秒後開始輪播
	setTimeout(() => {
		bubble.textContent = getTimeBasedGreeting(); // 顯示當前時間問候
		setTimeout(() => {
			currentIndex = 0; // 跳到第二個問候語
			bubble.textContent = greetings[0];
		}, 9000);
	}, 500);
	
	console.log('🤖 Robot greeting system activated with', greetings.length, 'messages');
});