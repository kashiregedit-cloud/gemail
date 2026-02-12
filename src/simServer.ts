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

simApp.listen(SIM_PORT, () => {
    console.log(`OWN SIM SERVER Emulator running at http://localhost:${SIM_PORT}`);
});
