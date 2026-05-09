
// BreakMySite Content Script
let currentConfig = {
    level: 0,
    disabledElements: '',
    breakTranslators: false
};

let chaosInterval = null;
let translatorInterval = null;
let scrollListener = null;
const drifts = new Map();

function cleanup() {
    if (chaosInterval) clearInterval(chaosInterval);
    if (translatorInterval) clearInterval(translatorInterval);
    if (scrollListener) window.removeEventListener('scroll', scrollListener);
    
    const ov = document.getElementById('bms-scanlines');
    if (ov) ov.remove();

    // Reset basic inline styles
    document.body.style.fontFamily = '';
    document.body.style.backgroundColor = '';
    document.body.style.color = '';
    document.body.style.filter = '';
    document.body.style.textShadow = '';
    
    document.querySelectorAll('*').forEach(el => {
        el.style.transform = '';
        el.style.pointerEvents = '';
        el.style.display = '';
        el.style.opacity = '';
        el.style.filter = '';
        el.style.textDecoration = '';
        el.style.cursor = '';
        el.style.position = '';
        el.style.left = '';
        el.style.top = '';
    });
    drifts.clear();
}

function applyDistortion() {
    cleanup();

    if (currentConfig.level == 0 && !currentConfig.disabledElements && !currentConfig.breakTranslators) return;

    // 1. Break Translators with Corrupted Code
    if (currentConfig.breakTranslators) {
        document.documentElement.lang = 'gibberish';
        document.documentElement.setAttribute('translate', 'no');
        document.documentElement.classList.add('notranslate');
        
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            el.setAttribute('translate', 'no');
            el.classList.add('notranslate');
        });
        
        const gTranslate = document.getElementById('google_translate_element');
        if (gTranslate) gTranslate.remove();
        document.querySelectorAll('script[src*="translate"]').forEach(s => s.remove());

        // Advanced Translator Corruption
        console.log('%c🌐 TRANSLATE CORRUPTED', 'color:red;font-size:20px;font-weight:bold');
        const $ = (s, p = document) => p.querySelector(s);
        const $$ = (s, p = document) => [...p.querySelectorAll(s)];

        const ov = document.createElement('div');
        ov.id = 'bms-scanlines';
        ov.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999999;background:repeating-linear-gradient(0deg,rgba(0,0,0,0.05) 0px,rgba(0,0,0,0.05) 1px,transparent 1px,transparent 2px);';
        document.body.appendChild(ov);

        const glyphPool = '!@#░▒▓█▄▀■◊●~^*?¿ñøæ∑∆πΩ';
        const rc = () => glyphPool[Math.floor(Math.random() * glyphPool.length)];
        const rh = () => `hsl(${Math.random() * 360 | 0},100%,55%)`;
        const rp = (n) => (Math.random() - 0.5) * 2 * n;

        function getDrift(el) {
            if (!drifts.has(el)) drifts.set(el, { x: 0, y: 0, r: 0 });
            return drifts.get(el);
        }

        function driftEl(el, strength) {
            const d = getDrift(el);
            d.x += rp(strength * 0.8);
            d.y += rp(strength * 0.5);
            d.r += rp(strength * 0.3);
            d.x = Math.max(-strength * 6, Math.min(strength * 6, d.x));
            d.y = Math.max(-strength * 4, Math.min(strength * 4, d.y));
            d.r = Math.max(-strength * 1.5, Math.min(strength * 1.5, d.r));
            el.style.transform = `translate(${d.x.toFixed(1)}px, ${d.y.toFixed(1)}px) rotate(${d.r.toFixed(2)}deg)`;
            el.style.position = 'relative';
        }

        function swapTexts(nodes) {
            if (nodes.length < 2) return;
            const a = nodes[Math.random() * nodes.length | 0];
            const b = nodes[Math.random() * nodes.length | 0];
            if (a !== b && a.nodeValue && b.nodeValue) {
                const temp = a.nodeValue;
                a.nodeValue = b.nodeValue;
                b.nodeValue = temp;
            }
        }

        function corruptStr(str, rate) {
            return str.split('').map(c => c.trim() && Math.random() < rate ? rc() : c).join('');
        }

        let tick = 0;
        const STRENGTH = 10; // BALANCED CHAOS
        
        translatorInterval = setInterval(() => {
            tick++;
            
            const out = $('.ryNqvb') || $('[jsname="W297wb"]') || $('.lRu31') || $('.HwtpBd');
            if (out) {
                driftEl(out, STRENGTH * 1.5);
                if (Math.random() < 0.3) out.style.color = rh();
            }

            $$('.VfPpkd-LgbsSe[jsname], [data-language-code], .ccvoYb, button, a').forEach(el => {
                if (Math.random() < 0.4) driftEl(el, STRENGTH * 1.2);
            });

            const btnSwap = $('[jsname="Iqt6T"]') || $('.N37NMd button') || $('[aria-label*="wap"]');
            if (btnSwap) {
                btnSwap.style.transform = `rotate(${(Date.now() / (100 / STRENGTH)) % 360}deg) scale(${1 + Math.sin(Date.now() / 100) * 0.8 * (STRENGTH / 10)})`;
            }

            $$('.aTGhEe, .rmcAZb, .j3mWee, .kn8PE, [data-location="source"], [data-location="target"]').forEach(p => {
                if (Math.random() < 0.25) driftEl(p, STRENGTH);
            });

            if (tick % 3 === 0) {
                const containers = $$('.aTGhEe, .rmcAZb, .lRu31');
                if (containers.length) {
                    const c = containers[Math.random() * containers.length | 0];
                    const kids = [...c.children];
                    if (kids.length >= 2) {
                        const i = Math.random() * kids.length | 0;
                        const j = Math.random() * kids.length | 0;
                        if (i !== j) {
                            const ref = kids[j].nextSibling;
                            c.insertBefore(kids[j], kids[i]);
                            if (ref) c.insertBefore(kids[i], ref);
                        }
                    }
                }
            }

            if (tick % 2 === 0) {
                document.body.style.textShadow = `${rp(STRENGTH * 0.8)}px ${rp(STRENGTH * 0.5)}px rgba(255,0,0,0.5),${rp(STRENGTH * 0.8)}px ${rp(STRENGTH * 0.5)}px rgba(0,255,0,0.4),${rp(STRENGTH * 0.8)}px ${rp(STRENGTH * 0.5)}px rgba(0,0,255,0.5)`;
            }

            if (tick % 4 === 0) {
                const btnT = $('[jsname="vSSGHe"]') || $('[aria-label*="Translate"]');
                if (btnT) {
                    btnT.style.background = rh();
                    btnT.style.transform = `scale(${1 + Math.random() * STRENGTH * 0.05}) rotate(${rp(STRENGTH * 0.5)}deg)`;
                }
            }

            const ta = $('textarea') || $('[contenteditable="true"]');
            if (ta && Math.random() < 0.1 * (STRENGTH / 5) && ta.value) {
                const orig = ta.value;
                ta.value = corruptStr(orig, 0.1 * (STRENGTH / 5));
                setTimeout(() => ta.value = orig, 100);
            }

            const outEl = $('.ryNqvb') || $('[jsname="W297wb"]');
            if (outEl) {
                const walker = document.createTreeWalker(outEl, NodeFilter.SHOW_TEXT);
                const nodes = [];
                while (walker.nextNode()) nodes.push(walker.currentNode);
                nodes.forEach(n => {
                    if (n.nodeValue.trim() && Math.random() < 0.2 * (STRENGTH / 5)) {
                        n.nodeValue = corruptStr(n.nodeValue, 0.1 * (STRENGTH / 5));
                    }
                });
                if (Math.random() < 0.2) swapTexts(nodes);
            }
        }, 80);
    }

    // 2. Disable/Hide Specific Elements
    if (currentConfig.disabledElements) {
        const selectors = currentConfig.disabledElements.split(',').map(s => s.trim());
        selectors.forEach(sel => {
            if(!sel) return;
            try {
                document.querySelectorAll(sel).forEach(el => {
                    el.style.display = 'none';
                    el.style.opacity = '0';
                    el.style.pointerEvents = 'none';
                    el.innerHTML = '';
                });
            } catch(e) {}
        });
    }

    // 3. Levels of Distortion
    const level = parseInt(currentConfig.level);
    if (level >= 1) {
        document.body.style.fontFamily = '"Comic Sans MS", "Papyrus", "Chiller", cursive';
        document.querySelectorAll('h1, h2, h3').forEach(h => {
             h.style.transform = `rotate(${Math.random() * 6 - 3}deg)`;
        });
        document.querySelectorAll('p').forEach(p => {
            p.style.letterSpacing = Math.random() > 0.5 ? '-1px' : '2px';
        });
    }
    
    if (level >= 2) {
        document.querySelectorAll('img, video').forEach(media => {
            media.style.transform = 'scaleY(-1) scaleX(-1)';
            media.style.filter = 'hue-rotate(180deg) invert(1)';
        });
        document.body.style.backgroundColor = '#2c003e';
        document.body.style.color = '#00ff00';
        
        document.querySelectorAll('a').forEach(a => {
            a.style.textDecoration = 'line-through';
            a.style.cursor = 'help';
            if(Math.random() > 0.5) {
                a.style.pointerEvents = 'none';
            }
        });
    }
    
    if (level >= 3) {
        // CONTROLLED CHAOS
        chaosInterval = setInterval(() => {
            const allElements = Array.from(document.querySelectorAll('div:not(:empty), section, article, nav, header, footer, img, button, a, p, h1, h2, span'));
            // Reduce subset size to not crash the browser
            const subset = allElements.sort(() => 0.5 - Math.random()).slice(0, 30); 
            subset.forEach(randomEl => {
                if(randomEl) {
                    randomEl.style.position = 'relative';
                    randomEl.style.left = `${Math.random() * 80 - 40}px`;
                    randomEl.style.top = `${Math.random() * 80 - 40}px`;
                    randomEl.style.transform = `rotate(${Math.random() * 20 - 10}deg) skew(${Math.random() * 10 - 5}deg)`;
                    randomEl.style.filter = `hue-rotate(${Math.random() * 180}deg)`;
                }
            });

            // Mild viewport shake
            window.scrollBy((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50);
            
            // Randomly flash body background less often
            if (Math.random() > 0.9) {
                document.body.style.backgroundColor = ['#ff0000', '#00ff00', '#0000ff', '#2c003e', '#111114'][Math.floor(Math.random() * 5)];
            }
        }, 150);
        
        scrollListener = () => {
             document.body.style.filter = `blur(${Math.random() * 5}px) hue-rotate(${Math.random() * 90}deg)`;
        };
        window.addEventListener('scroll', scrollListener);
    }
}

// React to messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "applyProfile") {
        currentConfig = request.config;
        applyDistortion();
        sendResponse({status: "ok"});
    }
});

// Initial boot
const host = window.location.hostname;
chrome.storage.sync.get(['profiles'], function(result) {
    const profiles = result.profiles || {};
    if (profiles[host]) {
        currentConfig = profiles[host];
        applyDistortion();
    }
});
