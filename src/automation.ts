import { chromium, Browser, BrowserContext, Page } from 'playwright';

export async function runResearch(): Promise<void> {
    console.log('Launching browser with Extreme Stealth Mode...');
    
    // 1. Precise Mobile Device Simulation based on User Categories
    const devices = [
        { 
            category: 'Compact (< 6.0")',
            name: 'Asus Zenfone 10',
            ua: 'Mozilla/5.0 (Linux; Android 13; AI2302 Build/TKQ1.221114.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/113.0.0.0 Mobile Safari/537.36', 
            w: 360, 
            h: 800,
            density: 3,
            platform: 'Linux armv8l'
        },
        { 
            category: 'Medium (6.0 - 6.5")',
            name: 'Samsung Galaxy S25',
            ua: 'Mozilla/5.0 (Linux; Android 14; SM-S921B Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.0.0 Mobile Safari/537.36', 
            w: 390, 
            h: 844,
            density: 3,
            platform: 'Linux armv8l'
        },
        { 
            category: 'Large (6.6 - 6.8")',
            name: 'Samsung Galaxy S25 Ultra',
            ua: 'Mozilla/5.0 (Linux; Android 14; SM-S928B Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/121.0.0.0 Mobile Safari/537.36', 
            w: 412, 
            h: 915,
            density: 3.5,
            platform: 'Linux armv8l'
        }
    ];
    const selectedDevice = devices[Math.floor(Math.random() * devices.length)];
    const androidVersions = ['11', '12', '13', '14'];
    const selectedVersion = androidVersions[Math.floor(Math.random() * androidVersions.length)];
    const buildIds = [
        'UP1A.231005.007', 'TP1A.220624.014', 'TKQ1.221114.001', 'SKQ1.210821.001',
        'TQ3A.230901.001', 'U1B2.230922.010'
    ];
    const selectedBuild = buildIds[Math.floor(Math.random() * buildIds.length)];

    console.log(`Simulating Device: ${selectedDevice.name} [Android ${selectedVersion}, Build ${selectedBuild}]`);

    const launchOptions: any = {
        headless: false,
        args: [
            '--disable-blink-features=AutomationControlled',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-infobars',
            `--window-size=${selectedDevice.w},${selectedDevice.h + 100}`,
            '--window-position=100,100',
            '--ignore-certificate-errors',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
            '--lang=en-US',
            '--disable-canvas-aa', // Disable anti-aliasing for canvas consistency
            '--disable-2d-canvas-clip-aa',
            '--disable-gl-drawing-for-tests'
        ]
    };

    const browser: Browser = await chromium.launch(launchOptions);
    
    const context: BrowserContext = await browser.newContext({
        userAgent: selectedDevice.ua,
        viewport: { width: selectedDevice.w, height: selectedDevice.h },
        deviceScaleFactor: selectedDevice.density,
        isMobile: true,
        hasTouch: true,
        locale: 'en-US',
        timezoneId: 'Asia/Dhaka',
        permissions: ['geolocation'],
        extraHTTPHeaders: {
            'X-Requested-With': 'com.google.android.gm',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Dest': 'document',
            'Sec-CH-UA-Mobile': '?1',
            'Sec-CH-UA-Platform': '"Android"',
            'Sec-CH-UA-Platform-Version': `"${selectedVersion}.0.0"`,
            'Sec-CH-UA-Model': `"${selectedDevice.name.split(' ')[selectedDevice.name.split(' ').length - 1]}"`,
            'Accept-Language': 'en-US,en;q=0.9'
        }
    });

    const page: Page = await context.newPage();
    await page.bringToFront();

    // Max Ultra Stealth: CDP Overrides and Behavioral Deep Masking
    await page.addInitScript(({ selectedDevice, selectedBuild }) => {
        // 0. Canvas Fingerprinting Defense (Adding noise)
        const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
        CanvasRenderingContext2D.prototype.getImageData = function(x, y, w, h) {
            const imageData = originalGetImageData.apply(this, [x, y, w, h]);
            const noise = (Math.random() - 0.5) * 2; // Subtle noise
            for (let i = 0; i < imageData.data.length; i += 4) {
                imageData.data[i] = imageData.data[i] + noise;
            }
            return imageData;
        };

        // 1. Complete Automation Detection bypass
        // @ts-ignore
        delete Object.getPrototypeOf(navigator).webdriver;
        // @ts-ignore
        navigator.__proto__.webdriver = false;
        
        // 1. Overriding common bot properties
        // @ts-ignore
        const properties = ['cdc_adoQtmx0877l_Array', 'cdc_adoQtmx0877l_Promise', 'cdc_adoQtmx0877l_Symbol', '__webdriver_evaluate', '__webdriver_unwrapped', '__webdriver_script_function', '__webdriver_script_func', '_phantom', 'callPhantom', '_selenium', 'domAutomation', 'domAutomationController'];
        properties.forEach(prop => {
            // @ts-ignore
            delete window[prop];
        });

        // 2. Hardware and System Signals (Randomized for uniqueness)
        const cores = [4, 6, 8, 12][Math.floor(Math.random() * 4)];
        const ram = [4, 6, 8, 12][Math.floor(Math.random() * 4)];
        Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => cores });
        Object.defineProperty(navigator, 'deviceMemory', { get: () => ram });
        Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en-GB', 'en'] });
        Object.defineProperty(navigator, 'platform', { get: () => selectedDevice.platform });
        
        // 3. Advanced Screen and Window signals (True Mobile behavior)
        // @ts-ignore
        window.chrome = {
            runtime: {},
            loadTimes: function() {},
            csi: function() {},
            app: {}
        };
        
        // 4. Fake Battery API (Bots often have 100% or static battery)
        const batteryPct = 0.5 + Math.random() * 0.4;
        const isCharging = Math.random() > 0.5;
        // @ts-ignore
        navigator.getBattery = () => Promise.resolve({
            level: batteryPct,
            charging: isCharging,
            chargingTime: 0,
            dischargingTime: Infinity
        });

        // 5. WebGL Deep Masking (Varying Android GPUs)
        const gpus = [
            { vendor: 'Qualcomm', renderer: 'Adreno (TM) 740' },
            { vendor: 'Qualcomm', renderer: 'Adreno (TM) 730' },
            { vendor: 'ARM', renderer: 'Mali-G710 MC10' },
            { vendor: 'ARM', renderer: 'Mali-G78' },
            { vendor: 'Google', renderer: 'Google Tensor' }
        ];
        const selectedGPU = gpus[Math.floor(Math.random() * gpus.length)];
        const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function(parameter: number) {
            if (parameter === 37445) return selectedGPU.vendor;
            if (parameter === 37446) return selectedGPU.renderer;
            return originalGetParameter.call(this, parameter);
        };

        // 6. App-specific signals (Android GMS simulation)
        // @ts-ignore
        window.isWebView = true;
        // @ts-ignore
        window.JSInterface = {
            getDeviceId: () => 'eb8a876a-' + Math.random().toString(16).slice(2, 6) + '-4858-9ac4-' + Math.random().toString(16).slice(2, 14),
            getAppVersion: () => '2024.01.21.598436521.Release',
            getCarrier: () => ['Verizon', 'AT&T', 'T-Mobile', 'Vodafone', 'Orange'][Math.floor(Math.random() * 5)],
            getNetworkType: () => 'LTE',
            getGmsVersion: () => '23.45.23',
            getBuildId: () => selectedBuild
        };

        // 7. Touch Event Simulation (Bypass mouse detection)
        // @ts-ignore
        window.ontouchstart = null;
        
        // 8. Navigator Plugins mask
        // @ts-ignore
        Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
    }, { selectedDevice, selectedBuild });

    // Higher-Level Interaction Helper: Real Human Behavior
    async function ultraHumanInteraction() {
        const size = page.viewportSize() || { width: 390, height: 844 };
        console.log('Simulating complex human behavior...');
        
        // 1. Randomized jittery mouse movements
        for (let i = 0; i < 3; i++) {
            const x = Math.random() * size.width;
            const y = Math.random() * size.height;
            await page.mouse.move(x, y, { steps: 15 });
            await page.waitForTimeout(Math.random() * 500);
        }

        // 2. Variable speed scrolling
        await page.evaluate(() => {
            return new Promise((resolve) => {
                let totalHeight = 0;
                let distance = 80;
                let timer = setInterval(() => {
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if(totalHeight > 300){
                        clearInterval(timer);
                        resolve(true);
                    }
                }, 200 + Math.random() * 300);
            });
        });

        // 3. Random pauses (Simulating reading)
        await page.waitForTimeout(1000 + Math.random() * 1000);
    }

    // CAPTCHA and Error Detection
    async function checkSecurityBlocks() {
        const content = await page.content();
        if (content.includes('unusual traffic') || content.includes('captcha') || content.includes('g-recaptcha')) {
            console.error('CRITICAL: Google detected unusual traffic (CAPTCHA).');
            console.log('--- ACTION REQUIRED: Please change your IP using Airplane Mode! ---');
            return true;
        }
        if (content.includes('could not create your Google Account') || content.includes('Sorry, we could not create')) {
            console.error('CRITICAL: Google blocked account creation for this session.');
            console.log('--- ACTION REQUIRED: Use a different IP or try again later. ---');
            return true;
        }
        return false;
    }

    console.log('Navigating with MAX ULTRA Stealth Mode...');
    await context.clearCookies();
    
    // Warm-up phase: Visit Google Home first (more natural than direct search)
    try {
        console.log('Warm-up Phase 1: Visiting Google Home...');
        await page.goto('https://www.google.com', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);
        
        if (await checkSecurityBlocks()) return;

        console.log('Warm-up Phase 2: Searching naturally...');
        const searchInput = page.locator('textarea[name="q"], input[name="q"]').first();
        if (await searchInput.isVisible()) {
            await searchInput.click();
            await page.keyboard.type('how to create gmail account', { delay: 100 + Math.random() * 100 });
            await page.keyboard.press('Enter');
            await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(2000);
            await ultraHumanInteraction();
        }
    } catch (e) {
        console.log('Warm-up skipped or failed, proceeding...');
    }

    if (await checkSecurityBlocks()) return;

    // Different Entry Points - Trying a more standard mobile web flow if embedded fails
    const signupUrls = [
        'https://accounts.google.com/signup/v2/webcreateaccount?flowName=GlifWebSignIn&flowEntry=SignUp',
        'https://accounts.google.com/EmbeddedSetup?source=com.google.android.gm&flowName=EmbeddedSetupAndroid'
    ];
    
    const targetUrl = signupUrls[Math.floor(Math.random() * signupUrls.length)];
    
    try {
        console.log(`Navigating to Signup: ${targetUrl}`);
        await page.goto(targetUrl, { 
            waitUntil: 'domcontentloaded', 
            timeout: 60000 
        });
        console.log('Navigation successful, waiting for content...');
    } catch (error) {
        console.error('Navigation failed, trying backup...', (error as Error).message);
        await page.goto(signupUrls[0], { waitUntil: 'domcontentloaded' });
    }
    
    await page.waitForTimeout(3000);
    await ultraHumanInteraction();

    // Enhanced Button Click Logic
    const clickSelectors = [
        'button:has-text("Create account")',
        'span:has-text("Create account")',
        '[role="button"]:has-text("Create account")',
        'div[role="presentation"] button',
        'button[type="button"] span',
        '#yDmH0d > c-wiz > div > div.S969G > div > div.Y64p9b > div > div > button',
        '//span[contains(text(), "Create account")]',
        '//button[contains(., "Create account")]',
        'jsname="Wj3e7c"' // Specific Google internal attribute
    ];

    console.log('Searching for Create account button...');
    await page.waitForTimeout(5000); 

    for (const selector of clickSelectors) {
        try {
            const btn = page.locator(selector).first();
            if (await btn.isVisible()) {
                console.log(`Target button found with selector: ${selector}`);
                
                // Human-like scroll and hover
                await btn.scrollIntoViewIfNeeded();
                await page.waitForTimeout(1000);
                
                const box = await btn.boundingBox();
                if (box) {
                    console.log('Simulating Touch tap on button...');
                    // Tap simulation for mobile
                    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 10 });
                    await page.mouse.down();
                    await page.waitForTimeout(100);
                    await page.mouse.up();
                    
                    // Fallback to direct tap if mouse fails
                    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
                } else {
                    await btn.click({ force: true, noWaitAfter: true });
                }

                console.log('Action sent, checking for menu...');
                await page.waitForTimeout(3000);

                // Menu selection with extreme persistence
                const personalOptions = [
                    'text="For my personal use"',
                    'span:has-text("For my personal use")',
                    'div[role="menuitem"]:has-text("For my personal use")',
                    '//span[contains(text(), "personal use")]',
                    'li:has-text("personal use")'
                ];

                for (const pSelector of personalOptions) {
                    const pBtn = page.locator(pSelector).first();
                    if (await pBtn.isVisible()) {
                        console.log(`Menu found: ${pSelector}. Clicking...`);
                        await pBtn.click({ force: true });
                        console.log('Success! Form should open.');
                        return;
                    }
                }

                // If menu still hidden, force it via JS event
                console.log('Menu still not visible, forcing menu trigger via JS...');
                await btn.evaluate((el: HTMLElement) => {
                    // Try to trigger all possible events
                    ['mousedown', 'mouseup', 'click', 'touchstart', 'touchend'].forEach(evt => {
                        el.dispatchEvent(new Event(evt, { bubbles: true }));
                    });
                    // If it has a specific Google handler
                    // @ts-ignore
                    if (el.click) el.click();
                });
                
                await page.waitForTimeout(2000);
            }
        } catch (e) {
            console.log(`Selector ${selector} failed.`);
        }
    }
    
    console.log('Could not automate Create account. Please click it manually to continue.');
    
    console.log('MAX ULTRA Mode Active. Proceed with manual steps if needed.');
}
