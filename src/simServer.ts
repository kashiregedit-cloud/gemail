import express, { Request, Response } from 'express';

const simApp = express();
const SIM_PORT = 4000;

simApp.use(express.json());

// Fake database for our SIMs
let activeOrders: any = {};

// 1. Get a number from our "SIM Bank"
simApp.get('/api/get-number', (req: Request, res: Response) => {
    const orderId = Math.random().toString(36).substring(7);
    const fakeNumber = "+8801" + Math.floor(100000000 + Math.random() * 900000000);
    
    activeOrders[orderId] = {
        phone: fakeNumber,
        sms: [],
        status: 'PENDING'
    };

    console.log(`[SIM SERVER] Number issued: ${fakeNumber} (Order: ${orderId})`);
    res.json({ id: orderId, phone: fakeNumber });
});

// 2. Check for SMS (Client calls this)
simApp.get('/api/check-sms/:id', (req: Request, res: Response) => {
    const order = activeOrders[req.params.id];
    if (order) {
        res.json({ sms: order.sms });
    } else {
        res.status(404).json({ error: 'Order not found' });
    }
});

// 3. INTERNAL: Simulate receiving an SMS (You would call this when your GSM hardware gets an SMS)
simApp.post('/api/simulate-receive', (req: Request, res: Response) => {
    const { phone, code } = req.body;
    const orderId = Object.keys(activeOrders).find(id => activeOrders[id].phone === phone);
    
    if (orderId) {
        activeOrders[orderId].sms.push({ code });
        console.log(`[SIM SERVER] SMS Received for ${phone}: ${code}`);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Number not active' });
    }
});

// API to receive SMS from an Android Phone (Free Relay)
// User can use apps like "SMS to URL" or Tasker to hit this endpoint
simApp.post('/api/incoming-sms', (req: Request, res: Response) => {
    const { from, message } = req.body;
    console.log(`Incoming SMS from ${from}: ${message}`);
    
    // Extract 6-digit code for Google
    const codeMatch = message.match(/\b\d{6}\b/);
    if (codeMatch) {
        const code = codeMatch[0];
        // Find the active order and update it
        for (const orderId in activeOrders) {
            activeOrders[orderId].sms.push({ code, text: message });
        }
        res.json({ success: true, message: 'Code captured' });
    } else {
        res.status(400).json({ success: false, message: 'No code found in message' });
    }
});

// --- PUBLIC FREE SMS SERVICE ---
// This part will scrape free numbers from public sites
let publicNumbers: any[] = [];

async function refreshPublicNumbers() {
    console.log('[SIM SERVER] Refreshing Public Free Numbers...');
    try {
        // Example: Scrape from a free site (Simulated for now, can be replaced with real axios/cheerio logic)
        // In real use, you'd fetch 'https://receive-sms-free.cc/' or similar
        publicNumbers = [
            { id: 'pub1', phone: '+447451234567', country: 'UK' },
            { id: 'pub2', phone: '+12025550123', country: 'USA' },
            { id: 'pub3', phone: '+33644667788', country: 'France' }
        ];
    } catch (e) {
        console.error('Failed to fetch public numbers');
    }
}

simApp.get('/api/get-free-number', async (req: Request, res: Response) => {
    if (publicNumbers.length === 0) await refreshPublicNumbers();
    const num = publicNumbers[Math.floor(Math.random() * publicNumbers.length)];
    res.json(num);
});

simApp.get('/api/check-public-sms', async (req: Request, res: Response) => {
    const { phone } = req.query;
    console.log(`[SIM SERVER] Checking public SMS for ${phone}...`);
    // Here you would scrape the specific number's page on the free site
    // For now, we simulate a check
    res.json({ sms: [] }); 
});

simApp.listen(SIM_PORT, '0.0.0.0', () => {
    console.log(`OWN SIM SERVER (Zero-Cost Mode) running at http://localhost:${SIM_PORT}`);
    console.log(`To receive SMS for free, point your Android Relay app to: http://YOUR_PC_IP:${SIM_PORT}/api/incoming-sms`);
});
