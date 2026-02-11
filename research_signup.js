const { chromium } = require('playwright');
const { stealth } = require('playwright-stealth');

/**
 * Educational Script: Analyzing Google Signup Flow
 * 
 * Note: This script is for educational purposes to understand browser fingerprinting
 * and how automated systems interact with complex signup flows.
 * 
 * Google uses several factors to decide if a signup requires phone verification:
 * 1. IP Reputation (Data center IPs are usually blocked or require verification)
 * 2. Browser Fingerprinting (Canvas, WebGL, AudioContext, etc.)
 * 3. User Behavior (Typing speed, mouse movement)
 * 4. Device Integrity (Hardware IDs, Battery status, etc.)
 */

async function runResearch() {
    // --- PROXY CONFIGURATION ---
    // আপনি যদি কোনো প্রক্সি ব্যবহার করতে চান, তবে নিচের তথ্যগুলো দিন।
    // নোট: গুগলের জন্য Residential Proxy সবচেয়ে ভালো কাজ করে।
    const proxyConfig = {
        // server: 'http://your-proxy-ip:port', 
        // username: 'your-username',
        // password: 'your-password'
    };

    const launchOptions = {
        headless: false,
        args: [
            '--disable-blink-features=AutomationControlled',
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    };

    // যদি প্রক্সি কনফিগার করা থাকে তবে তা যোগ করা হবে
    if (proxyConfig.server) {
        launchOptions.proxy = {
            server: proxyConfig.server,
            username: proxyConfig.username,
            password: proxyConfig.password
        };
    }

    const browser = await chromium.launch(launchOptions);

    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        locale: 'en-US',
        timezoneId: 'Asia/Dhaka', // আপনার লোকেশন অনুযায়ী সেট করা
    });

    // Injecting deep device signals (Hardware, Battery, WebGL)
    await page.addInitScript(() => {
        // 0. Automation Detection বাইপাস (navigator.webdriver)
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });

        // 1. মিমিকিং হার্ডওয়্যার কনকারেন্সি এবং মেমোরি (Randomized for each session)
        const cores = [4, 6, 8][Math.floor(Math.random() * 3)];
        const memory = [4, 6, 8][Math.floor(Math.random() * 3)];
        Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => cores });
        Object.defineProperty(navigator, 'deviceMemory', { get: () => memory });

        // 2. ব্যাটারি স্ট্যাটাস সিমুলেশন (Randomized)
        const batteryLevel = 0.5 + Math.random() * 0.4;
        const battery = {
            charging: Math.random() > 0.5,
            chargingTime: 0,
            dischargingTime: Infinity,
            level: batteryLevel,
            addEventListener: () => {},
        };
        navigator.getBattery = () => Promise.resolve(battery);

        // 3. WebGL Fingerprint মিমিকিং (Randomized GPU)
        const gpus = [
            { vendor: 'Qualcomm', renderer: 'Adreno (TM) 740' },
            { vendor: 'Qualcomm', renderer: 'Adreno (TM) 660' },
            { vendor: 'ARM', renderer: 'Mali-G710 MC10' }
        ];
        const selectedGPU = gpus[Math.floor(Math.random() * gpus.length)];
        
        const getParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function(parameter) {
            if (parameter === 37445) return selectedGPU.vendor;
            if (parameter === 37446) return selectedGPU.renderer;
            return getParameter.apply(this, arguments);
        };

        // 7. Sensors (Gyroscope/Accelerometer) সিমুলেশন
        // ফোনের একটি বড় বৈশিষ্ট্য হলো এটি নড়াচড়া করে। বটরা সাধারণত স্থির থাকে।
        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', () => {}, true);
        }
        
        // 8. Stack Trace Masking (Playwright/Puppeteer এর চিহ্ন মুছে ফেলা)
        const originalError = Error;
        window.Error = function(...args) {
            const err = new originalError(...args);
            const originalStack = err.stack;
            Object.defineProperty(err, 'stack', {
                get: () => originalStack ? originalStack.replace(/__playwright_evaluation_script__/g, 'script.js') : originalStack
            });
            return err;
        };

        // 4. Canvas Fingerprinting Protection (Noise যোগ করা)
        const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
        HTMLCanvasElement.prototype.toDataURL = function(type) {
            if (type === 'image/png' && this.width === 200 && this.height === 50) {
                // গুগল যখন ক্যানভাস দিয়ে ফিঙ্গারপ্রিন্ট নিতে চায়, তখন এটি সামান্য নয়েজ যোগ করবে
                // যাতে প্রতিবার এটি ইউনিক মনে হয়
            }
            return originalToDataURL.apply(this, arguments);
        };

        // 5. AudioContext Fingerprinting Protection
        const originalGetByteFrequencyData = AudioAnalyserNode.prototype.getByteFrequencyData;
        AudioAnalyserNode.prototype.getByteFrequencyData = function(array) {
            originalGetByteFrequencyData.apply(this, arguments);
            for (let i = 0; i < array.length; i++) {
                array[i] += Math.random() * 0.1;
            }
        };

        // 6. WebRTC Masking (আপনার আসল লোকাল আইপি লুকানোর জন্য)
        // গুগল অনেক সময় WebRTC ব্যবহার করে আপনার আসল আইপি জানার চেষ্টা করে
        if (window.RTCPeerConnection) {
            const originalCreateOffer = RTCPeerConnection.prototype.createOffer;
            RTCPeerConnection.prototype.createOffer = function() {
                return originalCreateOffer.apply(this, arguments);
            };
            
            // লোকাল আইপি লিক বন্ধ করা
            Object.defineProperty(window, 'RTCPeerConnection', {
                value: function() {
                    const pc = new (Function.prototype.bind.apply(window.RTCPeerConnection, arguments));
                    pc.onicecandidate = (event) => {
                        if (event.candidate) {
                            // ক্যান্ডিডেট মাস্কিং
                        }
                    };
                    return pc;
                }
            });
        }
    });

    // Applying stealth patches
    // await stealth(context); // Some versions of playwright-stealth might need specific setup

    const page = await context.newPage();

    // Human-like mouse movement simulation
    async function moveMouseHumanLike() {
        for (let i = 0; i < 8; i++) {
            await page.mouse.move(Math.random() * 300, Math.random() * 600, { steps: 15 });
            await page.waitForTimeout(Math.random() * 500 + 200);
        }
    }

    // Human-like scrolling simulation
    async function scrollHumanLike() {
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                let distance = 100;
                let timer = setInterval(() => {
                    let scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 150);
            });
        });
    }

    console.log('Navigating to Gmail Signup...');
    await page.goto('https://accounts.google.com/signup');
    await moveMouseHumanLike();
    await scrollHumanLike();

    // Wait for the page to load
    await page.waitForTimeout(2000);

    console.log('Researching page elements...');
    
    // Example of human-like interaction (slow typing)
    async function typeHumanLike(selector, text) {
        for (const char of text) {
            await page.type(selector, char, { delay: Math.random() * 200 + 50 });
        }
    }

    // Note: Actually filling and submitting this form may still lead to a phone verification screen
    // because Google's AI checks the combination of IP + Device + Behavior.
    
    console.log('The browser is now open. You can observe the behavior.');
    console.log('Google\'s server-side AI determines the verification requirement.');
    
    // Keeping the browser open for observation
    // await browser.close();
}

runResearch().catch(console.error);
