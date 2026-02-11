import { chromium, Browser, BrowserContext, Page } from 'playwright';

export async function runResearch(): Promise<void> {
    console.log('Launching browser with advanced stealth...');
    
    const launchOptions: any = {
        headless: false,
        args: [
            '--disable-blink-features=AutomationControlled',
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    };

    const browser: Browser = await chromium.launch(launchOptions);
    
    const context: BrowserContext = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        locale: 'en-US',
        timezoneId: 'Asia/Dhaka',
    });

    const page: Page = await context.newPage();

    // Injecting deep device signals (Hardware, Battery, WebGL)
    await page.addInitScript(() => {
        // 0. Automation Detection bypass
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });

        // 1. Hardware randomization
        const cores = [4, 6, 8][Math.floor(Math.random() * 3)];
        const memory = [4, 6, 8][Math.floor(Math.random() * 3)];
        Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => cores });
        Object.defineProperty(navigator, 'deviceMemory', { get: () => memory });

        // 2. Battery status
        const batteryLevel = 0.5 + Math.random() * 0.4;
        const battery = {
            charging: Math.random() > 0.5,
            chargingTime: 0,
            dischargingTime: Infinity,
            level: batteryLevel,
            addEventListener: () => {},
        };
        (navigator as any).getBattery = () => Promise.resolve(battery);

        // 3. WebGL Fingerprint
        const gpus = [
            { vendor: 'Qualcomm', renderer: 'Adreno (TM) 740' },
            { vendor: 'Qualcomm', renderer: 'Adreno (TM) 660' },
            { vendor: 'ARM', renderer: 'Mali-G710 MC10' }
        ];
        const selectedGPU = gpus[Math.floor(Math.random() * gpus.length)] || gpus[0];
        
        const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function(parameter: number) {
            if (parameter === 37445) return selectedGPU.vendor;
            if (parameter === 37446) return selectedGPU.renderer;
            return originalGetParameter.call(this, parameter);
        };

        // 4. Canvas Fingerprinting Protection
        const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
        // @ts-ignore
        HTMLCanvasElement.prototype.toDataURL = function(type?: string, ...args: any[]) {
            // @ts-ignore
            return originalToDataURL.apply(this, arguments);
        };

        // 5. WebRTC Masking
        if ((window as any).RTCPeerConnection) {
            const originalCreateOffer = (window as any).RTCPeerConnection.prototype.createOffer;
            (window as any).RTCPeerConnection.prototype.createOffer = function() {
                // @ts-ignore
                return originalCreateOffer.apply(this, arguments);
            };
        }
    });

    async function moveMouseHumanLike(): Promise<void> {
        for (let i = 0; i < 8; i++) {
            await page.mouse.move(Math.random() * 300, Math.random() * 600, { steps: 15 });
            await page.waitForTimeout(Math.random() * 500 + 200);
        }
    }

    console.log('Navigating to Gmail Signup...');
    await page.goto('https://accounts.google.com/signup');
    await moveMouseHumanLike();

    console.log('Automation is running. Observe the browser.');
}
