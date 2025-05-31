import { createServer } from 'http';
import { Server } from 'socket.io';
import { watch } from 'fs';
import { join } from 'path';
import { readFileSync } from 'fs';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Watch for changes in initial-data.json
const dataPath = join(process.cwd(), 'public', 'initial-data.json');
console.log('Watching file:', dataPath);

// Initial connection logging
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const readJsonFile = (retries = 3, delay = 100): Promise<any> => {
  return new Promise((resolve, reject) => {
    const attempt = (retryCount: number) => {
      try {
        const data = JSON.parse(readFileSync(dataPath, 'utf-8'));
        resolve(data);
      } catch (error) {
        if (retryCount > 0) {
          console.log(`Retrying file read, ${retryCount} attempts remaining...`);
          setTimeout(() => attempt(retryCount - 1), delay);
        } else {
          reject(error);
        }
      }
    };
    attempt(retries);
  });
};

watch(dataPath, async (eventType, filename) => {
  console.log('File change detected:', { eventType, filename });

  if (eventType === 'change') {
    try {
      const data = await readJsonFile();
      console.log('Successfully read updated data');
      console.log('Emitting data update to', io.engine.clientsCount, 'clients');
      io.emit('data-update', data);
    } catch (error) {
      console.error('Error reading updated data after retries:', error);
    }
  }
});

const WS_PORT = process.env.WS_PORT ?? 3001;
httpServer.listen(WS_PORT, () => {
  console.log(`WebSocket server running on port ${WS_PORT}`);
});
