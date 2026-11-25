const express = require('express');
const client = require('prom-client');

const app = express();
const PORT = process.env.PORT || 3000;

// Включаем сбор стандартных метрик (CPU, память, event loop и т.д.)
client.collectDefaultMetrics();

// Счётчик http_requests_total с метками
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Middleware: считаем каждый завершённый запрос
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestsTotal.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status_code: res.statusCode
    });
  });
  next();
});

// Маршрут 1: главная страница
app.get('/', (req, res) => {
  res.send('DevOps Final Project');
});

// Маршрут 2: health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Маршрут 3: метрики для Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`App listening on port ${PORT}`);
});
