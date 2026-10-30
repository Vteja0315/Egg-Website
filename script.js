// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Integrate Lenis scrolling events straight into ScrollTrigger thread
lenis.on('scroll', ScrollTrigger.update);

// Cursor Tracking Aura Interaction
const glow = document.getElementById('cursor-glow');
if (glow) {
    window.addEventListener('mousemove', (e) => {
        gsap.to(glow, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.6,
            ease: 'power2.out',
            overwrite: 'auto'
        });
        glow.style.opacity = '1';
    });
}

/* ==========================================
   GSAP INTERACTIVE CHOREOGRAPHY SCROLL TIMELINE
   ========================================== */
const egg = document.getElementById('interactive-egg');
const speckles = document.getElementById('egg-speckles');

const tl = gsap.timeline({
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        invalidateOnRefresh: true
    }
});

// Layout Adjustments and Dimensions across Different Breakpoints
const isMobile = window.innerWidth < 768;

tl.fromTo(egg, {
    x: isMobile ? "0vw" : "22vw",
    y: isMobile ? "25vh" : "5vh",
    rotate: -12,
    scale: isMobile ? 0.8 : 1
}, {
    // Stage 2: Move to the left margin for White Leghorn descriptions
    x: isMobile ? "0vw" : "-22vw",
    y: isMobile ? "-20vh" : "0vh",
    rotate: 8,
    scale: isMobile ? 0.9 : 1.15,
    duration: 1
})
.to(egg, {
    // Stage 3: Glide back right while morphing into a brown egg gradient
    x: isMobile ? "0vw" : "22vw",
    y: isMobile ? "15vh" : "2vh",
    rotate: -18,
    scale: isMobile ? 0.85 : 1.1,
    background: 'radial-gradient(circle at 35% 35%, #dfbfa3 0%, #c49973 40%, #a2744c 75%, #7a5030 100%)',
    boxShadow: 'inset -25px_-20px_50px_rgba(0,0,0,0.3), 0_25px_45px_rgba(44,41,37,0.25)',
    duration: 1
}, "+=0.2")
// Parallel opacity activation for details on the brown egg surface
.to(speckles, {
    opacity: 1,
    duration: 0.6
}, "<")
.to(egg, {
    // Stage 4: Scale down and gracefully vanish during dark metrics view
    y: isMobile ? "40vh" : "35vh",
    scale: 0.3,
    opacity: 0,
    duration: 0.8
}, "+=0.2");

// Sticky scrolling buttons functionality
document.querySelectorAll('.scroll-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = document.getElementById(btn.getAttribute('data-target'));
        if (target) lenis.scrollTo(target, { offset: -50 });
    });
});

/* ==========================================
   CART APP ENGINE INTERACTIVITY & STATE
   ========================================== */
let cart = [];
const drawer = document.getElementById('cart-drawer');
const toggle = document.getElementById('cart-toggle');
const closeBtn = document.getElementById('cart-close');
const countBadge = document.getElementById('cart-count');
const itemsList = document.getElementById('cart-items');
const totalLabel = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const emptyMsg = document.getElementById('empty-message');

function updateCartUI() {
    itemsList.innerHTML = '';
    let total = 0;
    let units = 0;

    if (cart.length === 0) {
        itemsList.appendChild(emptyMsg);
        checkoutBtn.disabled = true;
    } else {
        checkoutBtn.disabled = false;
        cart.forEach((item, index) => {
            total += item.price * item.qty;
            units += item.qty;

            const row = document.createElement('div');
            row.className = 'flex justify-between items-center bg-neutral-50 p-4 rounded-xl border border-neutral-100';
            row.innerHTML = `
                <div>
                    <h4 class="font-bold font-serif text-[#2c2925]">${item.name}</h4>
                    <p class="text-sm text-neutral-500">$${item.price.toFixed(2)} each</p>
                </div>
                <div class="flex items-center gap-4">
                    <div class="flex items-center border border-neutral-200 rounded-lg bg-white overflow-hidden">
                        <button onclick="changeQty(${index}, -1)" class="px-2.5 py-1 text-sm font-bold hover:bg-neutral-100 cursor-pointer transition-colors">-</button>
                        <span class="px-3 font-semibold text-sm">${item.qty}</span>
                        <button onclick="changeQty(${index}, 1)" class="px-2.5 py-1 text-sm font-bold hover:bg-neutral-100 cursor-pointer transition-colors">+</button>
                    </div>
                    <button onclick="removeFromCart(${index})" class="text-xs text-red-500 font-bold hover:underline cursor-pointer">Remove</button>
                </div>
            `;
            itemsList.appendChild(row);
        });
    }

    totalLabel.innerText = total.toFixed(2);
    countBadge.innerText = units;

    // Pop bounce animation on quantity badge change
    gsap.fromTo(countBadge, { scale: 0.6 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
}

window.addToCart = function(name, price) {
    const existing = cart.find(i => i.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    updateCartUI();
    // Open drawer automatically on add
    drawer.classList.remove('translate-x-full');
};

window.changeQty = function(index, mod) {
    cart[index].qty += mod;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
};

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateCartUI();
};

toggle.addEventListener('click', () => drawer.classList.remove('translate-x-full'));
closeBtn.addEventListener('click', () => drawer.classList.add('translate-x-full'));
checkoutBtn.addEventListener('click', () => alert('Order simulation successful! Thank you for supporting pasture welfare.'));
