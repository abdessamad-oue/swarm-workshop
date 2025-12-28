/**
 * Timed Valkey writer for Swarm scaling demo
 */

const os = require('os');
const Redis = require('ioredis');

const hostname = os.hostname();
const pid = process.pid;

// Config
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '100', 10);
const INTERVAL_MS = parseInt(process.env.INTERVAL_MS || '100', 10);
const STOP_AFTER_MS = parseInt(process.env.STOP_AFTER_MS || '30000', 10); // default 30s

// Valkey connection
const redis = new Redis({
  host: process.env.VALKEY_HOST || 'valkey',
  port: process.env.VALKEY_PORT || 6379,
});

const LIST_KEY = 'swarm:entries';

let counter = 0;
let running = true;

async function pushBatch() {
  const pipeline = redis.pipeline();

  for (let i = 0; i < BATCH_SIZE; i++) {
    counter++;
    pipeline.lpush(
      LIST_KEY,
      JSON.stringify({
        container: hostname,
        pid,
        seq: counter,
        timestamp: new Date().toISOString(),
      })
    );
  }

  await pipeline.exec();
}

async function loop() {
  while (running) {
    await pushBatch();

    if (INTERVAL_MS > 0) {
      await new Promise(r => setTimeout(r, INTERVAL_MS));
    }
  }
}

// Auto-stop timer
setTimeout(async () => {
  console.log(`[${hostname}] Stop timer reached, shutting down`);
  running = false;
  await redis.quit();
  process.exit(0);
}, STOP_AFTER_MS);

// Start
loop();

// Clean shutdown (Swarm)
process.on('SIGTERM', async () => {
  console.log(`[${hostname}] SIGTERM received`);
  running = false;
  await redis.quit();
  process.exit(0);
});
