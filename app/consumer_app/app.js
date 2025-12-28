/***
 * Fake simple Node.js application for Docker Swarm demonstration.
 */

/**
 * Valkey observer for Swarm writer demo
 */

const http = require('http');
const os = require('os');
const Redis = require('ioredis');

const PORT = process.env.PORT || 3000;
const LIST_KEY = process.env.LIST_KEY || 'swarm:entries';
const MAX_ITEMS = parseInt(process.env.MAX_ITEMS || '5', 10);

const hostname = os.hostname();
const pid = process.pid;
const startedAt = new Date().toISOString();

const redis = new Redis({
  host: process.env.VALKEY_HOST || 'valkey',
  port: process.env.VALKEY_PORT || 6379,
});

const server = http.createServer(async (req, res) => {
  try {
    const total = await redis.llen(LIST_KEY);

    // Read latest entries (LPUSH = newest at index 0)
    const raw = await redis.lrange(LIST_KEY, 0, MAX_ITEMS - 1);

    const entries = raw.map(v => JSON.parse(v));

    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
    });

    res.end(JSON.stringify({
      app: 'valkey-observer',
      container: hostname,
      pid,
      startedAt,
      totalEntries: total,
      latestEntries: entries,
    }, null, 2));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`Valkey error: ${err.message}`);
  }
});

server.listen(PORT, () => {
  console.log(`Observer running on port ${PORT}`);
});