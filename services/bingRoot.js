// bingRoot.js
let responseCount = 0;
let startTime = Date.now();

function bingRootHandler(req, res) {
  const now = Date.now();
  const hoursPassed = (now - startTime) / (1000 * 60 * 60);

  // إعادة ضبط العداد بعد مرور 24 ساعة
  if (hoursPassed >= 24) {
    responseCount = 0;
    startTime = now;
  }

  if (responseCount < 240) {
    responseCount++;
    res.send(`Response #${responseCount}`);
  } else {
    res.status(429).send('Max 240 responses reached in 24h');
  }
}

module.exports = bingRootHandler;
