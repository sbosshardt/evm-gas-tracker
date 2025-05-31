import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { watch } from 'fs';
import { join } from 'path';

export function setupSocketServer(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  // Watch for changes in initial-data.json
  const dataPath = join(process.cwd(), 'public', 'initial-data.json');
  watch(dataPath, async (eventType) => {
    if (eventType === 'change') {
      try {
        const data = await import(dataPath);
        io.emit('data-update', data);
      } catch (error) {
        console.error('Error reading updated data:', error);
      }
    }
  });

  return io;
}
