/* ============================================
   ROMANTIC TULIP GARDEN - SCRIPT.JS
   Interactive cinematic experience for Rebika Szabo
   
   UPLOAD THIS FILE TO GITHUB
   
   Features:
   - Realistic tulip generation and animation
   - Particle system (pollen, fireflies)
   - Falling petals physics
   - Mouse interaction with flowers
   - Dynamic day/night cycle hints
   - Ambient music control
   - Smooth 60fps canvas rendering
   - Parallax depth effects
   ============================================ */

// ============================================
// GLOBAL STATE & CONFIGURATION
// ============================================
const CONFIG = {
    tulipCount: window.innerWidth < 768 ? 25 : 50,
    petalCount: window.innerWidth < 768 ? 12 : 25,
    pollenCount: window.innerWidth < 768 ? 30 : 60,
    fireflyCount: window.innerWidth < 768 ? 10 : 20,
    starCount: window.innerWidth < 768 ? 50 : 100,
    windSpeed: 0.002,
    mouseInfluence: 0.08,
    dayNightCycleDuration: 120000, // 2 minutes for full cycle
};

// Global state
const state = {
    mouseX: window.innerWidth / 2,
    mouseY: window.innerHeight / 2,
    targetMouseX: window.innerWidth / 2,
    targetMouseY: window.innerHeight / 2,
    windOffset: 0,
    time: 0,
    isNight: false,
    musicPlaying: false,
    loaded: false,
    particles: [],
    fireflies: [],
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Generate random number between min and max
 */
function random(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Smooth interpolation (lerp)
 */
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

/**
 * Map value from one range to another
 */
function mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

/**
 * Clamp value between min and max
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// ============================================
// LOADING SCREEN
// ============================================
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Hide loading screen after animations load
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        state.loaded = true;
        // Start main animations after loading
        initGarden();
        initPetals();
        initStars();
        startDayNightCycle();
    }, 3000);
}

// ============================================
// TULIP GARDEN GENERATION
// Generates realistic tulip flowers using DOM elements
// with layered petals and natural positioning
// ============================================

// Tulip color palettes - realistic flower colors
const TULIP_COLORS = [
    { main: '#c0392b', dark: '#7b241c', light: '#e74c3c' },  // Deep Red
    { main: '#e74c8b', dark: '#a0315e', light: '#f06292' },  // Pink
    { main: '#e67e22', dark: '#b35900', light: '#f39c12' },  // Orange
    { main: '#f4d03f', dark: '#c9a800', light: '#f7dc6f' },  // Yellow
    { main: '#8e44ad', dark: '#5b2c6f', light: '#a569bd' },  // Purple
    { main: '#c0392b', dark: '#922b21', light: '#d35400' },  // Crimson
    { main: '#e91e63', dark: '#880e4f', light: '#f48fb1' },  // Rose
    { main: '#ff6f61', dark: '#c44d40', light: '#ff8a80' },  // Coral
];

function createTulip(index) {
    const tulipField = document.getElementById('tulip-field');
    const tulip = document.createElement('div');
    tulip.className = 'tulip growing';
    
    // Randomize position - spread across the field
    const xPos = random(3, 97);
    const zDepth = random(0, 1); // 0 = far, 1 = near
    const scale = mapRange(zDepth, 0, 1, 0.4, 1.2);
    const bottomPos = mapRange(zDepth, 0, 1, 60, 0);
    
    // Select random color
    const color = TULIP_COLORS[Math.floor(random(0, TULIP_COLORS.length))];
    
    // Randomize properties
    const stemHeight = random(80, 160) * scale;
    const headSize = random(22, 35) * scale;
    const swayAmount = random(1, 4);
    const swayDuration = random(3, 6);
    const growDelay = random(0.5, 2.5);
    
    // Set CSS variables
    tulip.style.cssText = `
        left: ${xPos}%;
        bottom: ${bottomPos}%;
        --stem-height: ${stemHeight}px;
        --head-size: ${headSize}px;
        --sway-amount: ${swayAmount}deg;
        animation-duration: ${swayDuration}s;
        animation-delay: ${growDelay}s;
        transform: scale(${scale});
        z-index: ${Math.floor(zDepth * 10) + 10};
        filter: brightness(${mapRange(zDepth, 0, 1, 0.6, 1)}) 
                saturate(${mapRange(zDepth, 0, 1, 0.7, 1)});
    `;
    
    // Create flower head
    const head = document.createElement('div');
    head.className = 'tulip-head';
    
    // Create 5 layered petals for realism
    for (let i = 0; i < 5; i++) {
        const petal = document.createElement('div');
        petal.className = 'tulip-petal';
        petal.style.setProperty('--petal-color', 
            `linear-gradient(180deg, ${color.light} 0%, ${color.main} 50%, ${color.dark} 100%)`
        );
        petal.style.background = `linear-gradient(180deg, ${color.light} 0%, ${color.main} 50%, ${color.dark} 100%)`;
        head.appendChild(petal);
    }
    
    // Create stem
    const stem = document.createElement('div');
    stem.className = 'tulip-stem';
    
    // Assemble tulip
    tulip.appendChild(head);
    tulip.appendChild(stem);
    tulipField.appendChild(tulip);
    
    return tulip;
}

function initGarden() {
    for (let i = 0; i < CONFIG.tulipCount; i++) {
        setTimeout(() => createTulip(i), i * 100);
    }
}

// ============================================
// FALLING PETALS SYSTEM
// Creates organic falling petal animations
// ============================================
function createPetal() {
    const container = document.getElementById('petals-container');
    const petal = document.createElement('div');
    petal.className = 'falling-petal';
    
    const size = random(8, 16);
    const startX = random(0, 100);
    const duration = random(8, 15);
    const delay = random(0, 10);
    const drift = random(-150, 150);
    const hue = random(330, 370) % 360; // Pink-red range
    
    petal.style.cssText = `
        --petal-size: ${size}px;
        --drift: ${drift}px;
        --petal-bg: hsla(${hue}, 70%, 60%, 0.7);
        left: ${startX}%;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        opacity: 0;
    `;
    
    container.appendChild(petal);
    
    // Remove petal after animation completes to prevent DOM buildup
    setTimeout(() => {
        if (petal.parentNode) {
            petal.parentNode.removeChild(petal);
        }
        // Create a new petal to replace it
        createPetal();
    }, (duration + delay) * 1000);
}

function initPetals() {
    for (let i = 0; i < CONFIG.petalCount; i++) {
        setTimeout(() => createPetal(), i * 300);
    }
}

// ============================================
// PARTICLE SYSTEM (Canvas-based)
// Renders pollen particles, fireflies, and
// bloom/glow effects on the canvas
// ============================================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Pollen particle class
class Particle {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = random(0, window.innerWidth);
        this.y = random(0, window.innerHeight);
        this.size = random(1, 3);
        this.speedX = random(-0.3, 0.3);
        this.speedY = random(-0.5, -0.1);
        this.opacity = random(0.1, 0.5);
        this.life = random(0, 1);
        this.maxLife = random(200, 500);
        this.currentLife = 0;
        // Golden pollen color
        this.color = `rgba(${Math.floor(random(200, 255))}, ${Math.floor(random(180, 220))}, ${Math.floor(random(50, 100))}, `;
    }
    
    update(windOffset) {
        this.x += this.speedX + Math.sin(windOffset + this.y * 0.01) * 0.3;
        this.y += this.speedY;
        this.currentLife++;
        
        // Fade in and out
        if (this.currentLife < 30) {
            this.opacity = (this.currentLife / 30) * 0.5;
        } else if (this.currentLife > this.maxLife - 30) {
            this.opacity = ((this.maxLife - this.currentLife) / 30) * 0.5;
        }
        
        // Reset if off screen or life ended
        if (this.y < -10 || this.x < -10 || this.x > window.innerWidth + 10 || this.currentLife >= this.maxLife) {
            this.reset();
            this.y = window.innerHeight + 10;
        }
    }
    
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.fill();
        
        // Add soft glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color + (this.opacity * 0.2) + ')';
        ctx.fill();
    }
}

// Firefly class - appears during darker moments
class Firefly {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = random(0, window.innerWidth);
        this.y = random(window.innerHeight * 0.3, window.innerHeight * 0.8);
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = random(2, 4);
        this.glowPhase = random(0, Math.PI * 2);
        this.glowSpeed = random(0.02, 0.05);
        this.wanderSpeed = random(0.005, 0.015);
        this.wanderRadius = random(30, 80);
        this.angle = random(0, Math.PI * 2);
    }
    
    update(time) {
        // Organic wandering motion
        this.angle += this.wanderSpeed;
        this.x = this.baseX + Math.cos(this.angle) * this.wanderRadius + Math.sin(time * 0.001 + this.glowPhase) * 20;
        this.y = this.baseY + Math.sin(this.angle * 0.7) * this.wanderRadius * 0.5;
        
        // Slowly drift the base position
        this.baseX += Math.sin(time * 0.0005 + this.glowPhase) * 0.1;
        
        // Keep within bounds
        if (this.baseX < 0) this.baseX = window.innerWidth;
        if (this.baseX > window.innerWidth) this.baseX = 0;
        
        // Glow animation
        this.glowPhase += this.glowSpeed;
    }
    
    draw(ctx, nightFactor) {
        const glow = (Math.sin(this.glowPhase) + 1) * 0.5;
        const alpha = glow * nightFactor * 0.9;
        
        if (alpha < 0.05) return;
        
        // Core
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 240, 100, ${alpha})`;
        ctx.fill();
        
        // Inner glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 230, 80, ${alpha * 0.4})`;
        ctx.fill();
        
        // Outer glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 220, 50, ${alpha * 0.15})`;
        ctx.fill();
    }
}

// Initialize particles
function initParticles() {
    for (let i = 0; i < CONFIG.pollenCount; i++) {
        state.particles.push(new Particle());
    }
    for (let i = 0; i < CONFIG.fireflyCount; i++) {
        state.fireflies.push(new Firefly());
    }
}

// ============================================
// STARS - Night sky effect
// ============================================
function initStars() {
    const container = document.getElementById('stars-container');
    for (let i = 0; i < CONFIG.starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.cssText = `
            left: ${random(0, 100)}%;
            top: ${random(0, 50)}%;
            width: ${random(1, 3)}px;
            height: ${random(1, 3)}px;
            animation-duration: ${random(2, 5)}s;
            animation-delay: ${random(0, 3)}s;
        `;
        container.appendChild(star);
    }
}

// ============================================
// DAY/NIGHT CYCLE
// Gradual transition between sunset and night
// ============================================
let cyclePhase = 0;

function startDayNightCycle() {
    setInterval(() => {
        cyclePhase += 0.01;
        const nightFactor = (Math.sin(cyclePhase) + 1) * 0.5;
        
        // Update sky gradient based on time
        const skyLayer = document.getElementById('sky-layer');
        const starsContainer = document.getElementById('stars-container');
        const sun = document.getElementById('sun');
        
        if (nightFactor > 0.6) {
            starsContainer.classList.add('visible');
            state.isNight = true;
            sun.style.opacity = mapRange(nightFactor, 0.6, 1, 1, 0.2);
        } else {
            starsContainer.classList.remove('visible');
            state.isNight = false;
            sun.style.opacity = 1;
        }
        
        // Darken sky gradually
        skyLayer.style.filter = `brightness(${mapRange(nightFactor, 0, 1, 1, 0.4)})`;
        
    }, 500);
}

// ============================================
// MOUSE INTERACTION
// Flowers respond to mouse movement
// ============================================
document.addEventListener('mousemove', (e) => {
    state.targetMouseX = e.clientX;
    state.targetMouseY = e.clientY;
});

// Touch support for mobile
document.addEventListener('touchmove', (e) => {
    if (e.touches[0]) {
        state.targetMouseX = e.touches[0].clientX;
        state.targetMouseY = e.touches[0].clientY;
    }
});

function updateMouseInfluence() {
    // Smooth mouse following
    state.mouseX = lerp(state.mouseX, state.targetMouseX, 0.05);
    state.mouseY = lerp(state.mouseY, state.targetMouseY, 0.05);
    
    // Calculate normalized mouse position (-1 to 1)
    const normalizedX = (state.mouseX / window.innerWidth - 0.5) * 2;
    const normalizedY = (state.mouseY / window.innerHeight - 0.5) * 2;
    
    // Apply subtle parallax to layers
    const parallaxBg = document.getElementById('parallax-bg');
    if (parallaxBg) {
        parallaxBg.style.transform = `translate(${normalizedX * -5}px, ${normalizedY * -3}px)`;
    }
    
    // Influence tulips based on mouse proximity
    const tulips = document.querySelectorAll('.tulip');
    tulips.forEach(tulip => {
        const rect = tulip.getBoundingClientRect();
        const tulipCenterX = rect.left + rect.width / 2;
        const distance = state.mouseX - tulipCenterX;
        const maxDistance = 200;
        
        if (Math.abs(distance) < maxDistance) {
            const influence = (1 - Math.abs(distance) / maxDistance) * CONFIG.mouseInfluence;
            const rotation = distance * influence * 0.05;
            tulip.style.transform += ` rotate(${rotation}deg)`;
        }
    });
}

// ============================================
// AMBIENT MUSIC CONTROL
// ============================================
function initMusicControl() {
    const musicBtn = document.getElementById('music-btn');
    const audio = document.getElementById('ambient-music');
    
    musicBtn.addEventListener('click', () => {
        if (state.musicPlaying) {
            audio.pause();
            musicBtn.classList.remove('playing');
            state.musicPlaying = false;
        } else {
            audio.volume = 0.3;
            audio.play().catch(() => {
                // Audio play failed - user interaction needed
                console.log('Audio autoplay blocked - click again');
            });
            musicBtn.classList.add('playing');
            state.musicPlaying = true;
        }
    });
}

// ============================================
// BLOOM/GLOW EFFECT
// Canvas-based soft light bloom
// ============================================
function drawBloom(ctx, time) {
    // Soft golden bloom near the sun area
    const sunX = window.innerWidth / 2;
    const sunY = window.innerHeight * 0.25;
    const bloomSize = 200 + Math.sin(time * 0.001) * 30;
    
    const gradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, bloomSize);
    gradient.addColorStop(0, 'rgba(255, 200, 100, 0.05)');
    gradient.addColorStop(0.5, 'rgba(255, 150, 50, 0.02)');
    gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
}

// ============================================
// MAIN ANIMATION LOOP
// Uses requestAnimationFrame for smooth 60fps
// ============================================
function animate(timestamp) {
    if (!state.loaded) {
        requestAnimationFrame(animate);
        return;
    }
    
    state.time = timestamp;
    state.windOffset += CONFIG.windSpeed;
    
    // Clear canvas
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    // Draw bloom effect
    drawBloom(ctx, timestamp);
    
    // Update and draw pollen particles
    state.particles.forEach(particle => {
        particle.update(state.windOffset);
        particle.draw(ctx);
    });
    
    // Calculate night factor for fireflies
    const nightFactor = state.isNight ? 
        Math.min(1, (Math.sin(cyclePhase) + 1) * 0.5 - 0.2) : 0;
    
    // Update and draw fireflies (only visible at night)
    if (nightFactor > 0) {
        state.fireflies.forEach(firefly => {
            firefly.update(timestamp);
            firefly.draw(ctx, nightFactor);
        });
    }
    
    // Update mouse influence on flowers
    updateMouseInfluence();
    
    // Continue animation loop
    requestAnimationFrame(animate);
}

// ============================================
// CINEMATIC CAMERA MOVEMENT
// Subtle viewport animation for immersion
// ============================================
function initCinematicMotion() {
    const garden = document.getElementById('garden-container');
    const content = document.getElementById('content-overlay');
    
    let cameraTime = 0;
    
    setInterval(() => {
        cameraTime += 0.01;
        
        // Very subtle breathing motion
        const scaleOffset = 1 + Math.sin(cameraTime) * 0.005;
        const translateY = Math.sin(cameraTime * 0.7) * 2;
        
        if (garden) {
            garden.style.transform = `scale(${scaleOffset}) translateY(${translateY}px)`;
        }
    }, 50);
}

// ============================================
// WINDOW RESIZE HANDLER
// ============================================
function handleResize() {
    resizeCanvas();
    
    // Recalculate particles for new viewport
    state.particles.forEach(p => {
        if (p.x > window.innerWidth || p.y > window.innerHeight) {
            p.reset();
        }
    });
    
    state.fireflies.forEach(f => {
        if (f.baseX > window.innerWidth) {
            f.reset();
        }
    });
}

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 250);
});

// ============================================
// PERFORMANCE OPTIMIZATION
// Reduce animations when tab is not visible
// ============================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Reduce frame rate when not visible
        CONFIG.windSpeed = 0.0005;
    } else {
        CONFIG.windSpeed = 0.002;
    }
});

// ============================================
// INITIALIZATION
// Start everything when DOM is ready
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize systems
    initLoadingScreen();
    initParticles();
    initMusicControl();
    initCinematicMotion();
    
    // Start main animation loop
    requestAnimationFrame(animate);
    
    // Add class for CSS animations after brief delay
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// ============================================
// ADDITIONAL AMBIENT EFFECTS
// Subtle atmospheric touches
// ============================================

// Create occasional sparkle burst on click
document.addEventListener('click', (e) => {
    // Don't create sparkles on button clicks
    if (e.target.closest('.glass-btn')) return;
    
    for (let i = 0; i < 5; i++) {
        const sparkle = new Particle();
        sparkle.x = e.clientX + random(-20, 20);
        sparkle.y = e.clientY + random(-20, 20);
        sparkle.size = random(1, 3);
        sparkle.speedX = random(-1, 1);
        sparkle.speedY = random(-2, -0.5);
        sparkle.maxLife = 60;
        sparkle.color = 'rgba(255, 220, 100, ';
        state.particles.push(sparkle);
    }
    
    // Keep particle count manageable
    while (state.particles.length > CONFIG.pollenCount + 30) {
        state.particles.shift();
    }
});

// ============================================
// GRASS BLADE GENERATION (Additional detail)
// Creates individual grass blades for realism
// ============================================
function createGrassBlades() {
    const grassLayer = document.getElementById('grass-layer');
    const bladeCount = window.innerWidth < 768 ? 40 : 80;
    
    for (let i = 0; i < bladeCount; i++) {
        const blade = document.createElement('div');
        const height = random(20, 60);
        const left = random(0, 100);
        const hue = random(90, 140);
        const lightness = random(15, 35);
        const swayDelay = random(0, 3);
        const swayDuration = random(2, 4);
        
        blade.style.cssText = `
            position: absolute;
            bottom: 0;
            left: ${left}%;
            width: 2px;
            height: ${height}px;
            background: linear-gradient(to top, hsl(${hue}, 50%, ${lightness}%), hsl(${hue}, 60%, ${lightness + 10}%));
            border-radius: 50% 50% 0 0;
            transform-origin: bottom center;
            animation: grassWind ${swayDuration}s ease-in-out ${swayDelay}s infinite;
            opacity: ${random(0.4, 0.8)};
        `;
        
        grassLayer.appendChild(blade);
    }
}

// Initialize grass when DOM loads
document.addEventListener('DOMContentLoaded', createGrassBlades);
