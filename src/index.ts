import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { runResearch } from './automation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

// Dashboard Route
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API to trigger signup
app.post('/api/start-signup', async (req: Request, res: Response) => {
    console.log('Starting signup process from dashboard...');
    try {
        // We run it asynchronously so the dashboard doesn't hang
        runResearch().catch((err: Error) => console.error('Automation Error:', err));
        
        res.json({ success: true, message: 'Automation started' });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dashboard running at http://localhost:${PORT}`);
    console.log(`To access from mobile, use your PC's IP (e.g., http://192.168.1.x:3000)`);
});
