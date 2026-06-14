// 이스터에그: 축구 텍스트 1초 호버 시 축구공 낙하
const soccerEgg = document.querySelector('.soccer-egg');
let soccerTimer = null;

soccerEgg.addEventListener('mouseenter', () => {
    soccerEgg.classList.add('charging');
    soccerTimer = setTimeout(() => {
        soccerEgg.classList.remove('charging');
        spawnSoccerBalls();
    }, 1000);
});

soccerEgg.addEventListener('mouseleave', () => {
    clearTimeout(soccerTimer);
    soccerTimer = null;
    soccerEgg.classList.remove('charging');
});

function spawnSoccerBalls() {
    const balls = [];
    const gravity = 0.5;
    const restitution = 0.55;
    let loopRunning = false;

    function loop() {
        loopRunning = true;
        for (let i = balls.length - 1; i >= 0; i--) {
            const b = balls[i];
            b.vy += gravity;
            b.x  += b.vx;
            b.y  += b.vy;
            b.rot += b.rotSpeed;

            const floor = window.innerHeight - b.size;
            if (b.y >= floor) {
                b.y  = floor;
                b.vy *= -restitution;
                b.vx *= 0.88;
                b.rotSpeed *= 0.75;
                b.bounces++;
            }
            if (b.x < 0) {
                b.x = 0; b.vx = Math.abs(b.vx) * 0.8;
            }
            if (b.x > window.innerWidth - b.size) {
                b.x = window.innerWidth - b.size; b.vx = -Math.abs(b.vx) * 0.8;
            }

            if (b.bounces >= 4 || (b.y >= floor - 1 && Math.abs(b.vy) < 1)) {
                b.opacity = Math.max(0, b.opacity - 0.012);
            }

            b.el.style.transform = `translate(${b.x}px, ${b.y}px) rotate(${b.rot}deg)`;
            b.el.style.opacity   = b.opacity;

            if (b.opacity <= 0) {
                b.el.remove();
                balls.splice(i, 1);
            }
        }
        if (balls.length > 0) requestAnimationFrame(loop);
        else loopRunning = false;
    }

    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const el = document.createElement('div');
            el.className = 'soccer-ball';
            el.textContent = '⚽';
            const sizeFactor = 1.2 + Math.random() * 2.5;
            el.style.fontSize = sizeFactor + 'rem';
            document.body.appendChild(el);
            const size = el.offsetHeight || sizeFactor * 16;

            balls.push({
                el,
                x:        Math.random() * (window.innerWidth - size),
                y:        -size,
                vx:       (Math.random() - 0.5) * 4,
                vy:       1 + Math.random() * 3,
                rot:      0,
                rotSpeed: (Math.random() - 0.5) * 12,
                opacity:  1,
                bounces:  0,
                size,
            });

            if (!loopRunning) requestAnimationFrame(loop);
        }, i * 90);
    }
}

// 섹션 카드 3D 틸트 효과
document.querySelectorAll('section').forEach(card => {
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let rafId = null;
    let hovering = false;

    const LERP = 0.08;

    function tick() {
        currentX += (targetX - currentX) * LERP;
        currentY += (targetY - currentY) * LERP;

        card.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;

        const settled = Math.abs(targetX - currentX) < 0.01 && Math.abs(targetY - currentY) < 0.01;
        if (!settled) {
            rafId = requestAnimationFrame(tick);
        } else {
            if (!hovering) card.style.transform = '';
            rafId = null;
        }
    }

    function startLoop() {
        if (!rafId) rafId = requestAnimationFrame(tick);
    }

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        targetY =  (e.clientX - rect.left) / rect.width  * 15 - 7.5;
        targetX = -(e.clientY - rect.top)  / rect.height * 15 + 7.5;
        startLoop();
    });

    card.addEventListener('mouseenter', () => {
        hovering = true;
        card.style.transition = 'none';
    });

    card.addEventListener('mouseleave', () => {
        hovering = false;
        targetX = 0;
        targetY = 0;
        startLoop();
    });
});
