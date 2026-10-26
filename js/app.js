(function() {
    const THEMES = {
        twilight: {
            vars: {
                '--bg-night': '#1E1826',
                '--board-bg': '#17121E',
                '--board-border': '#2B2336',
                '--cell-dead': '#251E30',
                '--ui-bg': '#272033',
                '--ui-bg-alpha': 'rgba(39, 32, 51, 0.94)',
                '--ui-border': '#382E47',
                '--ui-hover': '#352B45',
                '--ui-active': '#433757',
                '--text-main': '#E6DEC8',
                '--text-muted': '#7E738F',
                '--accent-amber': '#F5D799'
            },
            dead: { r: 37, g: 30, b: 48 },
            palette: [
                { r: 245, g: 215, b: 153 }, // Warm Amber / Cream
                { r: 250, g: 230, b: 182 }, // Soft Lit Window Cream
                { r: 238, g: 188, b: 128 }, // Cozy Honey Gold
                { r: 229, g: 168, b: 178 }, // Soft Dusty Rose Pink
                { r: 168, g: 204, b: 179 }  // Soft Sage Green
            ]
        },
        moss: {
            vars: {
                '--bg-night': '#141E19',
                '--board-bg': '#0F1713',
                '--board-border': '#203028',
                '--cell-dead': '#1B2922',
                '--ui-bg': '#1C2B23',
                '--ui-bg-alpha': 'rgba(28, 43, 35, 0.94)',
                '--ui-border': '#2C4236',
                '--ui-hover': '#263B30',
                '--ui-active': '#314D3E',
                '--text-main': '#DCE8DF',
                '--text-muted': '#6D8777',
                '--accent-amber': '#A7D6A2'
            },
            dead: { r: 27, g: 41, b: 34 },
            palette: [
                { r: 167, g: 214, b: 162 }, // Soft Fern
                { r: 210, g: 232, b: 190 }, // Lichen Cream
                { r: 232, g: 202, b: 136 }, // Firefly Gold
                { r: 122, g: 181, b: 150 }, // Deep Moss
                { r: 224, g: 173, b: 158 }  // Woodland Mushroom
            ]
        },
        hearth: {
            vars: {
                '--bg-night': '#221715',
                '--board-bg': '#1A110F',
                '--board-border': '#33221E',
                '--cell-dead': '#2B1D1A',
                '--ui-bg': '#2E1F1C',
                '--ui-bg-alpha': 'rgba(46, 31, 28, 0.94)',
                '--ui-border': '#452F2A',
                '--ui-hover': '#3D2925',
                '--ui-active': '#4F3630',
                '--text-main': '#EDE0D4',
                '--text-muted': '#8C726B',
                '--accent-amber': '#F4B678'
            },
            dead: { r: 43, g: 29, b: 26 },
            palette: [
                { r: 244, g: 182, b: 120 }, // Warm Ember
                { r: 252, g: 224, b: 173 }, // Candlelight
                { r: 226, g: 134, b: 107 }, // Terracotta Glow
                { r: 219, g: 164, b: 154 }, // Dusty Rose Ash
                { r: 194, g: 199, b: 157 }  // Dry Sage Herb
            ]
        },
        tide: {
            vars: {
                '--bg-night': '#131C26',
                '--board-bg': '#0E151D',
                '--board-border': '#1E2D3D',
                '--cell-dead': '#192634',
                '--ui-bg': '#1B2838',
                '--ui-bg-alpha': 'rgba(27, 40, 56, 0.94)',
                '--ui-border': '#2B3E54',
                '--ui-hover': '#25374B',
                '--ui-active': '#314963',
                '--text-main': '#DAE6F0',
                '--text-muted': '#698199',
                '--accent-amber': '#90D6E0'
            },
            dead: { r: 25, g: 38, b: 52 },
            palette: [
                { r: 144, g: 214, b: 224 }, // Bioluminescent Aqua
                { r: 197, g: 235, b: 238 }, // Seafoam Mist
                { r: 240, g: 201, b: 153 }, // Lantern Sand
                { r: 158, g: 181, b: 240 }, // Periwinkle Drift
                { r: 227, g: 168, b: 189 }  // Coral Anemone
            ]
        }
    };

    const SCALES = {
        cozy:     { pitch: 22, gap: 4, radius: 5.0 },
        standard: { pitch: 16, gap: 3, radius: 3.5 },
        fine:     { pitch: 11, gap: 2, radius: 2.2 }
    };

    const SPEEDS = {
        slow:   { label: 'Slow',   interval: 260 },
        normal: { label: 'Normal', interval: 125 },
        brisk:  { label: 'Brisk',  interval: 65 }
    };

    const TRAILS = {
        crisp:  { fadeIn: 0.22, fadeOut: 0.45 },
        soft:   { fadeIn: 0.45, fadeOut: 1.15 },
        dreamy: { fadeIn: 0.65, fadeOut: 2.80 }
    };

    let activeTheme = THEMES.twilight;
    let PALETTE = activeTheme.palette;
    let DEAD_COLOR = activeTheme.dead;

    let currentScale = SCALES.standard;
    let CELL_PITCH = currentScale.pitch;
    let CELL_GAP = currentScale.gap;
    let CELL_SIZE = CELL_PITCH - CELL_GAP;
    let CELL_RADIUS = currentScale.radius;

    let currentSpeed = SPEEDS.normal;
    let currentTrail = TRAILS.soft;

    const canvas = document.getElementById('grid-canvas');
    const ctx = canvas.getContext('2d');
    const wrapper = document.getElementById('canvas-wrapper');

    const btnPlay = document.getElementById('btn-play');
    const playLabel = document.getElementById('play-label');
    const playDot = document.getElementById('play-dot');
    const btnStep = document.getElementById('btn-step');
    const btnRandom = document.getElementById('btn-random');
    const btnClear = document.getElementById('btn-clear');
    const btnEnv = document.getElementById('btn-env');
    const btnEnvClose = document.getElementById('btn-env-close');
    const envModule = document.getElementById('env-module');
    const btnInfo = document.getElementById('btn-info');
    const btnInfoClose = document.getElementById('btn-info-close');
    const infoModule = document.getElementById('info-module');

    let cols = 0;
    let rows = 0;
    let dpr = window.devicePixelRatio || 1;

    // Typed arrays for state & cozy visual interpolation
    let grid = new Uint8Array(0);
    let nextGrid = new Uint8Array(0);
    let colorGrid = new Uint8Array(0);
    let nextColorGrid = new Uint8Array(0);
    let visualBrightness = new Float32Array(0);

    // Respect prefers-reduced-motion on initial load
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let isRunning = !prefersReducedMotion;

    let lastTickTime = performance.now();
    let lastFrameTime = performance.now();

    // Pointer drawing state
    let isDrawing = false;
    let drawMode = 1; // 1 = plant live cell, 0 = erase cell
    let lastHoveredIndex = -1;

    function pickRandomCozyColor() {
        const rand = Math.random();
        if (rand < 0.36) return 0; // Warm Amber
        if (rand < 0.68) return 1; // Soft Cream
        if (rand < 0.82) return 2; // Honey Gold
        if (rand < 0.91) return 3; // Soft Pink (9%)
        return 4;                  // Soft Sage (9%)
    }

    function pickInheritedOrRandomColor(dominantColorIndex) {
        if (dominantColorIndex >= 0 && Math.random() < 0.78) {
            return dominantColorIndex;
        }
        return pickRandomCozyColor();
    }

    function initOrResizeGrid(preserveContent = true) {
        const style = window.getComputedStyle(wrapper);
        const padX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        const padY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);

        const availW = Math.max(160, wrapper.clientWidth - padX);
        const availH = Math.max(160, wrapper.clientHeight - padY);

        const newCols = Math.max(10, Math.floor(availW / CELL_PITCH));
        const newRows = Math.max(10, Math.floor(availH / CELL_PITCH));

        dpr = window.devicePixelRatio || 1;
        const cssW = newCols * CELL_PITCH;
        const cssH = newRows * CELL_PITCH;

        canvas.style.width = cssW + 'px';
        canvas.style.height = cssH + 'px';
        canvas.width = Math.floor(cssW * dpr);
        canvas.height = Math.floor(cssH * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        if (newCols === cols && newRows === rows && grid.length > 0) {
            return;
        }

        const newSize = newCols * newRows;
        const newGrid = new Uint8Array(newSize);
        const newNextGrid = new Uint8Array(newSize);
        const newColorGrid = new Uint8Array(newSize);
        const newNextColorGrid = new Uint8Array(newSize);
        const newBrightness = new Float32Array(newSize);

        if (preserveContent && cols > 0 && rows > 0) {
            const offsetC = Math.floor((newCols - cols) / 2);
            const offsetR = Math.floor((newRows - rows) / 2);

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const oldIdx = r * cols + c;
                    if (grid[oldIdx] || visualBrightness[oldIdx] > 0.01) {
                        const nr = (r + offsetR + newRows) % newRows;
                        const nc = (c + offsetC + newCols) % newCols;
                        const newIdx = nr * newCols + nc;
                        newGrid[newIdx] = grid[oldIdx];
                        newColorGrid[newIdx] = colorGrid[oldIdx];
                        newBrightness[newIdx] = visualBrightness[oldIdx];
                    }
                }
            }
        }

        cols = newCols;
        rows = newRows;
        grid = newGrid;
        nextGrid = newNextGrid;
        colorGrid = newColorGrid;
        nextColorGrid = newNextColorGrid;
        visualBrightness = newBrightness;
    }

    function setCell(c, r, alive, colorIdx = null, instant = false) {
        const wc = (c + cols) % cols;
        const wr = (r + rows) % rows;
        const idx = wr * cols + wc;

        grid[idx] = alive ? 1 : 0;
        if (alive) {
            colorGrid[idx] = colorIdx !== null ? colorIdx : pickRandomCozyColor();
            visualBrightness[idx] = instant ? 1.0 : Math.max(visualBrightness[idx], 0.35);
        } else if (instant) {
            visualBrightness[idx] = 0.0;
        }
    }

    function placePattern(coords, centerC, centerR, colorIdx = null) {
        const chosenColor = colorIdx !== null ? colorIdx : pickRandomCozyColor();
        for (let i = 0; i < coords.length; i++) {
            const [dc, dr] = coords[i];
            setCell(centerC + dc, centerR + dr, true, chosenColor, true);
        }
    }

    function seedInitialClassicPatterns() {
        grid.fill(0);
        visualBrightness.fill(0);

        // 1. Classic Glider (upper-left quadrant, traveling southeast)
        const glider = [
            [1, 0],
            [2, 1],
            [0, 2], [1, 2], [2, 2]
        ];
        placePattern(glider, Math.floor(cols * 0.25), Math.floor(rows * 0.28), 0);

        // 2. Blinker oscillator (upper-right quadrant)
        const blinker = [
            [-1, 0], [0, 0], [1, 0]
        ];
        placePattern(blinker, Math.floor(cols * 0.72), Math.floor(rows * 0.30), 3);

        // 3. Beehive still life (lower-left quadrant)
        const beehive = [
            [1, 0], [2, 0],
            [0, 1], [3, 1],
            [1, 2], [2, 2]
        ];
        placePattern(beehive, Math.floor(cols * 0.30), Math.floor(rows * 0.68), 1);

        // 4. Loaf still life or second glider if space permits (lower-right quadrant)
        const loaf = [
            [1, 0], [2, 0],
            [0, 1], [3, 1],
            [1, 2], [3, 2],
            [2, 3]
        ];
        placePattern(loaf, Math.floor(cols * 0.68), Math.floor(rows * 0.66), 4);
    }

    function stepGeneration() {
        const colorCounts = new Uint8Array(PALETTE.length);

        for (let r = 0; r < rows; r++) {
            const rUp = (r === 0 ? rows - 1 : r - 1) * cols;
            const rMid = r * cols;
            const rDown = (r === rows - 1 ? 0 : r + 1) * cols;

            for (let c = 0; c < cols; c++) {
                const cLeft = c === 0 ? cols - 1 : c - 1;
                const cRight = c === cols - 1 ? 0 : c + 1;

                const n0 = rUp + cLeft;
                const n1 = rUp + c;
                const n2 = rUp + cRight;
                const n3 = rMid + cLeft;
                const n4 = rMid + cRight;
                const n5 = rDown + cLeft;
                const n6 = rDown + c;
                const n7 = rDown + cRight;

                const neighbors =
                    grid[n0] + grid[n1] + grid[n2] +
                    grid[n3] + grid[n4] +
                    grid[n5] + grid[n6] + grid[n7];

                const idx = rMid + c;
                const currentlyAlive = grid[idx] === 1;

                if (currentlyAlive) {
                    if (neighbors === 2 || neighbors === 3) {
                        nextGrid[idx] = 1;
                        nextColorGrid[idx] = colorGrid[idx];
                    } else {
                        nextGrid[idx] = 0;
                        nextColorGrid[idx] = colorGrid[idx]; // Keep warm hue while dimming out
                    }
                } else {
                    if (neighbors === 3) {
                        nextGrid[idx] = 1;
                        // Tally neighbor colors to give newborn cells a cozy organic color inheritance
                        colorCounts.fill(0);
                        if (grid[n0]) colorCounts[colorGrid[n0]]++;
                        if (grid[n1]) colorCounts[colorGrid[n1]]++;
                        if (grid[n2]) colorCounts[colorGrid[n2]]++;
                        if (grid[n3]) colorCounts[colorGrid[n3]]++;
                        if (grid[n4]) colorCounts[colorGrid[n4]]++;
                        if (grid[n5]) colorCounts[colorGrid[n5]]++;
                        if (grid[n6]) colorCounts[colorGrid[n6]]++;
                        if (grid[n7]) colorCounts[colorGrid[n7]]++;

                        let dominantColor = 0;
                        let maxCount = 0;
                        for (let k = 0; k < PALETTE.length; k++) {
                            if (colorCounts[k] > maxCount) {
                                maxCount = colorCounts[k];
                                dominantColor = k;
                            }
                        }
                        nextColorGrid[idx] = pickInheritedOrRandomColor(dominantColor);
                    } else {
                        nextGrid[idx] = 0;
                        nextColorGrid[idx] = colorGrid[idx];
                    }
                }
            }
        }

        // Swap buffers
        const tempGrid = grid;
        grid = nextGrid;
        nextGrid = tempGrid;

        const tempColor = colorGrid;
        colorGrid = nextColorGrid;
        nextColorGrid = tempColor;
    }

    function drawRoundedCell(x, y, size, radius) {
        if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(x, y, size, size, radius);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + size - radius, y);
            ctx.quadraticCurveTo(x + size, y, x + size, y + radius);
            ctx.lineTo(x + size, y + size - radius);
            ctx.quadraticCurveTo(x + size, y + size, x + size - radius, y + size);
            ctx.lineTo(x + radius, y + size);
            ctx.quadraticCurveTo(x, y + size, x, y + size - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.fill();
        }
    }

    function render(dt) {
        ctx.clearRect(0, 0, cols * CELL_PITCH, rows * CELL_PITCH);

        // Smooth fade speeds scaled to current generation interval and chosen trail length
        const stepDurationSec = currentSpeed.interval / 1000;
        const fadeInRate = dt / (stepDurationSec * currentTrail.fadeIn);
        const fadeOutRate = dt / (stepDurationSec * currentTrail.fadeOut);

        const deadFill = `rgb(${DEAD_COLOR.r}, ${DEAD_COLOR.g}, ${DEAD_COLOR.b})`;
        const offset = CELL_GAP / 2;

        for (let r = 0; r < rows; r++) {
            const y = r * CELL_PITCH + offset;
            const rowOffset = r * cols;

            for (let c = 0; c < cols; c++) {
                const idx = rowOffset + c;
                const target = grid[idx];
                let b = visualBrightness[idx];

                if (target === 1 && b < 1.0) {
                    b = Math.min(1.0, b + fadeInRate);
                    visualBrightness[idx] = b;
                } else if (target === 0 && b > 0.0) {
                    b = Math.max(0.0, b - fadeOutRate);
                    visualBrightness[idx] = b;
                }

                const x = c * CELL_PITCH + offset;

                if (b <= 0.005) {
                    ctx.fillStyle = deadFill;
                    drawRoundedCell(x, y, CELL_SIZE, CELL_RADIUS);
                } else {
                    const pal = PALETTE[colorGrid[idx]];
                    const cr = Math.round(DEAD_COLOR.r + (pal.r - DEAD_COLOR.r) * b);
                    const cg = Math.round(DEAD_COLOR.g + (pal.g - DEAD_COLOR.g) * b);
                    const cb = Math.round(DEAD_COLOR.b + (pal.b - DEAD_COLOR.b) * b);

                    ctx.fillStyle = `rgb(${cr}, ${cg}, ${cb})`;
                    drawRoundedCell(x, y, CELL_SIZE, CELL_RADIUS);
                }
            }
        }
    }

    function loop(now) {
        const dt = Math.min(0.1, (now - lastFrameTime) / 1000);
        lastFrameTime = now;

        if (isRunning && (now - lastTickTime >= currentSpeed.interval)) {
            stepGeneration();
            lastTickTime = now;
        }

        render(dt);
        requestAnimationFrame(loop);
    }

    // UI Controls & State Sync
    function updatePlayUI() {
        if (isRunning) {
            playLabel.textContent = 'Pause';
            playDot.classList.add('active');
            btnStep.disabled = true;
        } else {
            playLabel.textContent = 'Play';
            playDot.classList.remove('active');
            btnStep.disabled = false;
        }
    }

    btnPlay.addEventListener('click', () => {
        isRunning = !isRunning;
        if (isRunning) {
            lastTickTime = performance.now();
        }
        updatePlayUI();
    });

    btnStep.addEventListener('click', () => {
        if (!isRunning) {
            stepGeneration();
        }
    });

    btnRandom.addEventListener('click', () => {
        for (let i = 0; i < grid.length; i++) {
            const alive = Math.random() < 0.16 ? 1 : 0;
            grid[i] = alive;
            if (alive) {
                colorGrid[i] = pickRandomCozyColor();
            }
        }
        lastTickTime = performance.now();
    });

    btnClear.addEventListener('click', () => {
        grid.fill(0);
    });

    function setModuleVisibility(targetModule, targetBtn, show) {
        if (show) {
            targetModule.classList.remove('hidden');
            targetBtn.classList.add('active-toggle');
            targetBtn.setAttribute('aria-expanded', 'true');
        } else {
            targetModule.classList.add('hidden');
            targetBtn.classList.remove('active-toggle');
            targetBtn.setAttribute('aria-expanded', 'false');
        }
    }

    function toggleEnvModule(forceState) {
        const isHidden = envModule.classList.contains('hidden');
        const shouldShow = forceState !== undefined ? forceState : isHidden;
        if (shouldShow) {
            setModuleVisibility(infoModule, btnInfo, false);
        }
        setModuleVisibility(envModule, btnEnv, shouldShow);
    }

    function toggleInfoModule(forceState) {
        const isHidden = infoModule.classList.contains('hidden');
        const shouldShow = forceState !== undefined ? forceState : isHidden;
        if (shouldShow) {
            setModuleVisibility(envModule, btnEnv, false);
        }
        setModuleVisibility(infoModule, btnInfo, shouldShow);
    }

    btnEnv.addEventListener('click', () => toggleEnvModule());
    btnEnvClose.addEventListener('click', () => toggleEnvModule(false));

    btnInfo.addEventListener('click', () => toggleInfoModule());
    btnInfoClose.addEventListener('click', () => toggleInfoModule(false));

    // Theme & Environment Selectors
    function applyTheme(themeKey) {
        const theme = THEMES[themeKey];
        if (!theme) return;
        activeTheme = theme;
        PALETTE = theme.palette;
        DEAD_COLOR = theme.dead;

        const root = document.documentElement;
        for (const [prop, val] of Object.entries(theme.vars)) {
            root.style.setProperty(prop, val);
        }
    }

    document.getElementById('theme-selector').addEventListener('click', (e) => {
        const btn = e.target.closest('[data-theme]');
        if (!btn) return;
        document.querySelectorAll('#theme-selector .theme-card').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyTheme(btn.dataset.theme);
    });

    document.getElementById('scale-selector').addEventListener('click', (e) => {
        const btn = e.target.closest('[data-scale]');
        if (!btn) return;
        const scale = SCALES[btn.dataset.scale];
        if (!scale || scale === currentScale) return;

        document.querySelectorAll('#scale-selector .seg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentScale = scale;
        CELL_PITCH = scale.pitch;
        CELL_GAP = scale.gap;
        CELL_SIZE = CELL_PITCH - CELL_GAP;
        CELL_RADIUS = scale.radius;

        initOrResizeGrid(true);
    });

    document.getElementById('speed-selector').addEventListener('click', (e) => {
        const btn = e.target.closest('[data-speed]');
        if (!btn) return;
        const speed = SPEEDS[btn.dataset.speed];
        if (!speed) return;

        document.querySelectorAll('#speed-selector .seg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSpeed = speed;
    });

    document.getElementById('trail-selector').addEventListener('click', (e) => {
        const btn = e.target.closest('[data-trail]');
        if (!btn) return;
        const trail = TRAILS[btn.dataset.trail];
        if (!trail) return;

        document.querySelectorAll('#trail-selector .seg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTrail = trail;
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!infoModule.classList.contains('hidden')) toggleInfoModule(false);
            if (!envModule.classList.contains('hidden')) toggleEnvModule(false);
        }
    });

    // Pointer / Touch Interaction for planting & toggling cells
    function getCellFromPointerEvent(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const c = Math.floor(x / CELL_PITCH);
        const r = Math.floor(y / CELL_PITCH);

        if (c < 0 || c >= cols || r < 0 || r >= rows) return null;
        return { c, r, idx: r * cols + c };
    }

    canvas.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        canvas.setPointerCapture(e.pointerId);
        const cell = getCellFromPointerEvent(e);
        if (!cell) return;

        isDrawing = true;
        // Clicking a single cell toggles it; dragging plants live cells (or erases if started on a live cell)
        drawMode = grid[cell.idx] === 1 ? 0 : 1;
        lastHoveredIndex = cell.idx;

        setCell(cell.c, cell.r, drawMode === 1);
    });

    canvas.addEventListener('pointermove', (e) => {
        if (!isDrawing) return;
        e.preventDefault();
        const cell = getCellFromPointerEvent(e);
        if (!cell || cell.idx === lastHoveredIndex) return;

        lastHoveredIndex = cell.idx;
        // When dragging across multiple cells, plant seeds if started on empty or if drawing continuously
        setCell(cell.c, cell.r, drawMode === 1);
    });

    function stopPointerDrawing(e) {
        if (!isDrawing) return;
        isDrawing = false;
        lastHoveredIndex = -1;
    }

    canvas.addEventListener('pointerup', stopPointerDrawing);
    canvas.addEventListener('pointercancel', stopPointerDrawing);

    // Handle responsive resize cleanly without wiping patterns
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initOrResizeGrid(true);
        }, 40);
    });

    // Initialize board and start
    initOrResizeGrid(false);
    seedInitialClassicPatterns();
    updatePlayUI();
    requestAnimationFrame(loop);
})();
