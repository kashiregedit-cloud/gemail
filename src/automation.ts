import { chromium, Browser, BrowserContext, Page } from 'playwright';

export async function runResearch(apiKey?: string, simSource: string = '5sim'): Promise<void> {
    console.log(`Launching browser with SIM Source: ${simSource}...`);
    
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
        headless: process.env.HEADLESS === 'true' || false,
        args: [
            '--disable-blink-features=AutomationControlled',
            '--disable-infobars',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-software-rasterizer',
            '--mute-audio',
            '--window-position=0,0',
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
        // 0. Canvas Fingerprinting Defense (Subtle noise to avoid detection without breaking render)
        const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
        HTMLCanvasElement.prototype.toDataURL = function() {
            if (arguments[0] === 'image/png') {
                // Subtle noise for PNG only
            }
            return originalToDataURL.apply(this, arguments as any);
        };

        const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
        CanvasRenderingContext2D.prototype.getImageData = function(x, y, w, h) {
            const imageData = originalGetImageData.apply(this, [x, y, w, h]);
            // Add extremely subtle noise to the first pixel only as a test
            if (imageData.data.length > 0) {
                imageData.data[0] = imageData.data[0] ^ 1;
            }
            return imageData;
        };

        // 0.1 WebRTC Leak Protection (Google sees real IP via WebRTC)
        // @ts-ignore
        navigator.mediaDevices.getUserMedia = () => Promise.reject(new Error('Permission denied'));
        // @ts-ignore
        window.RTCPeerConnection = function() {
            return {
                createOffer: () => Promise.reject(new Error('Disabled')),
                setLocalDescription: () => Promise.resolve(),
                addIceCandidate: () => Promise.resolve(),
                onicecandidate: null,
                close: () => {}
            };
        };

        // 0.2 Audio Fingerprinting Defense
        const originalGetChannelData = AudioBuffer.prototype.getChannelData;
        AudioBuffer.prototype.getChannelData = function(channel) {
            const data = originalGetChannelData.apply(this, [channel]);
            for (let i = 0; i < data.length; i += 100) {
                data[i] = data[i] + (Math.random() * 0.0000001);
            }
            return data;
        };

        // 0.3 Sensor Simulation (Mobile devices move)
        // @ts-ignore
        window.DeviceMotionEvent = function() {};
        // @ts-ignore
        window.DeviceOrientationEvent = function() {};
        
        const simulateSensors = () => {
            const event = new DeviceOrientationEvent('deviceorientation', {
                alpha: Math.random() * 360,
                beta: Math.random() * 20 - 10,
                gamma: Math.random() * 20 - 10
            });
            window.dispatchEvent(event);
        };
        setInterval(simulateSensors, 2000);

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

        // 2.1 Navigator Permissions Query Mask
        const originalQuery = navigator.permissions.query;
        // @ts-ignore
        navigator.permissions.query = (parameters) => (
            parameters.name === 'notifications' ?
                Promise.resolve({ state: Notification.permission, onchange: null } as any) :
                originalQuery(parameters)
        );
        
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
    
    // 7.1 Screen/Window Signal Alignment
    Object.defineProperty(window, 'innerHeight', { get: () => selectedDevice.h });
    Object.defineProperty(window, 'innerWidth', { get: () => selectedDevice.w });
    Object.defineProperty(screen, 'height', { get: () => selectedDevice.h });
    Object.defineProperty(screen, 'width', { get: () => selectedDevice.w });
        
        // 8. Navigator Plugins mask
        // @ts-ignore
        Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });

        // 9. Font Fingerprinting Mask (Google checks available fonts)
        const originalFontQuery = (document as any).fonts?.query;
        if (originalFontQuery) {
            (document as any).fonts.query = (font: string) => {
                if (['Arial', 'Roboto', 'sans-serif'].includes(font)) return true;
                return Math.random() > 0.5;
            };
        }
    }, { selectedDevice, selectedBuild });

    // Higher-Level Interaction Helper: Real Human Behavior
    async function ultraHumanInteraction() {
        const size = page.viewportSize() || { width: 390, height: 844 };
        
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

    // VIRTUAL NUMBER INTEGRATION
    async function getNumber(): Promise<{ id: string, phone: string } | null> {
        if (simSource === 'own') {
            try {
                console.log('Requesting number from OWN SIM Server (localhost:4000)...');
                const response = await fetch('http://localhost:4000/api/get-number');
                return await response.json();
            } catch (e) {
                console.error('Own SIM Server not running!');
                return null;
            }
        }

        if (simSource === 'public') {
            try {
                console.log('Requesting Free Public Number from simServer...');
                const response = await fetch('http://localhost:4000/api/get-free-number');
                const data = await response.json();
                return data;
            } catch (e) {
                console.error('Failed to get public number.');
                return null;
            }
        }

        if (simSource === '5sim') {
            if (!apiKey) {
                console.error('5sim API Key missing!');
                return null;
            }
            try {
                const response = await fetch(`https://5sim.net/v1/user/buy/activation/bangladesh/any/google`, {
                    headers: { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/json' }
                });
                const data = await response.json();
                return data && data.phone ? { id: data.id, phone: data.phone } : null;
            } catch (e) {
                console.error('5sim API Error');
            }
        }
        return null;
    }

    async function waitSMS(orderId: string, phone?: string): Promise<string | null> {
        console.log('Waiting for SMS code...');
        for (let i = 0; i < 24; i++) {
            await page.waitForTimeout(5000);
            try {
                let response;
                if (simSource === 'own') {
                    response = await fetch(`http://localhost:4000/api/check-sms/${orderId}`);
                } else if (simSource === 'public') {
                    // For public numbers, we might need to check the web page
                    response = await fetch(`http://localhost:4000/api/check-public-sms?phone=${phone}`);
                } else {
                    response = await fetch(`https://5sim.net/v1/user/check/${orderId}`, {
                        headers: { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/json' }
                    });
                }
                const data = await response.json();
                const smsList = data.sms || [];
                if (smsList.length > 0) return smsList[0].code;
                process.stdout.write('.');
            } catch (e) {}
        }
        return null;
    }

    // CAPTCHA and Error Detection
    async function checkSecurityBlocks() {
        const content = await page.content();
        if (content.includes('Verify your phone number') || content.includes('Verify your device')) {
            console.log('--- PHONE VERIFICATION TRIGGERED ---');
            
            if (apiKey || simSource !== '5sim') {
                const simData = await getNumber();
                if (simData) {
                    console.log(`Successfully got number: ${simData.phone}`);
                    // 1. Type the number
                    const phoneInput = page.locator('input[type="tel"], #phoneNumberId').first();
                    if (await phoneInput.isVisible()) {
                        await phoneInput.fill(simData.phone);
                        await page.keyboard.press('Enter');
                        
                        // 2. Wait for SMS
                        const code = await waitSMS(simData.id, simData.phone);
                        if (code) {
                            const codeInput = page.locator('input[aria-label="Enter code"], #code').first();
                            if (await codeInput.isVisible()) {
                                await codeInput.fill(code);
                                await page.keyboard.press('Enter');
                                return false; // Continue signup
                            }
                        }
                    }
                }
            } else {
                console.log('No 5sim API Key. Please enter it in the dashboard.');
            }
            return false;
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
    
    // Add real human-like delay before starting
    await page.waitForTimeout(2000 + Math.random() * 3000);
    try {
        process.stdout.write('Trust Building: Warm-up phase starting... ');
        await page.goto('https://www.google.com', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);
        
        if (await checkSecurityBlocks()) return;

        process.stdout.write('Searching... ');
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
        await page.waitForTimeout(1000);
        console.log('Done.');
        
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
                console.log('Button found.');
                
                // Human-like scroll and hover
                await btn.scrollIntoViewIfNeeded();
                await page.waitForTimeout(1000);
                
                const box = await btn.boundingBox();
                if (box) {
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
                        console.log('Selecting "Personal Use"...');
                        await pBtn.click({ force: true });
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
        } catch (e) {}
    }
    
    console.log('Could not automate Create account. Please click it manually to continue.');
    
    console.log('MAX ULTRA Mode Active. Proceed with manual steps if needed.');
}
