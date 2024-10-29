const rateLimit = require('express-rate-limit');
const Bull = require('bull');

const taskQueue = new Bull('task-queue', { redis: { host: '127.0.0.1', port: 6379 },
    settings:{
      maxStalledCount: 3,
      stalledInterval: 5000,
      removeOnComplete: true, 
      removeOnFail: false, 
    } 
  });

const perSecondLimiter = rateLimit({
  windowMs: 1000,
  max: 1,
  keyGenerator: (req) => req.body.userid,
  handler: async (req, res) => {
    try {
      await taskQueue.add({ userid: req.body.userid });
      res.status(429).send('Rate limit exceeded. Task queued.');
    } catch (error) {
      console.error('Error adding task to queue:', error);
      res.status(500).send('Internal server error');
    }
  },
  skip: (req) => !req.body.userid,
});

const perMinuteLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  keyGenerator: (req) => req.body.userid,
  handler: async (req, res) => {
    try {
      await taskQueue.add({ userid: req.body.userid });
      res.status(429).send('Rate limit exceeded. Task queued.');
    } catch (error) {
      console.error('Error adding task to queue:', error);
      res.status(500).send('Internal server error');
    }
  },
  skip: (req) => !req.body.userid,
});

module.exports = { perSecondLimiter, perMinuteLimiter, taskQueue };
