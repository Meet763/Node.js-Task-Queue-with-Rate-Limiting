const express = require('express');
const app = express();
app.use(express.json());
const Redis = require('ioredis');
const { perSecondLimiter, perMinuteLimiter, taskQueue } = require('./ratecontroller');
const cluster = require('cluster');
const fs = require('fs');
const os = require('os');

const redisClient = new Redis();

async function task(userid, isQueued = false) {
  try {
    const logEntry = `${userid} - Task ${isQueued ? 'from queue' : 'directly processed'} started at - ${new Date().toISOString()}\n`;

    await fs.promises.appendFile('task_log.txt', logEntry, 'utf8');
  
    // Simulate a delay of 2 seconds to mimic a longer-running task
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const endLogEntry = `${userid} - task completed at - ${new Date().toISOString()}\n`;

    await fs.promises.appendFile('task_log.txt', endLogEntry, 'utf8');

    await redisClient.decr(`user:${userid}:taskCount`);
    
  } catch (error) {
    console.error(`Failed to log task for ${userid}:`, error);
  }
}

app.get('/', (req, res) => {
  res.status(200).send('Hello, welcome to this task');
});

app.post('/task', perSecondLimiter, perMinuteLimiter, async (req, res) => {
  try {
    const { userid } = req.body;
    if (!userid) {
      return res.status(400).json({ error: 'userid is required' });
    }

    await task(userid);

    console.log(`${userid} - Task queued at ${new Date().toISOString()}`);
    
    res.status(200).json({ message: 'Task queued' });
  } catch (err) {
    console.error('Error processing /task route:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

taskQueue.process(async (job) => {
  const { userid } = job.data; 

  if (!userid) {
    console.error('Error: userid is undefined in queued job.');
    return; // Early return to avoid further processing
  }

  console.log(`Processing queued task for user ${userid}`);
  await task(userid, true);
});

if (cluster.isMaster) {
  for (let i = 0; i < 2; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.error(`Worker ${worker.process.pid} died, restarting...`);
    cluster.fork(); // Restart a new worker if one dies
  });
} else {
  app.listen(3000, () => console.log(`Worker ${process.pid} started`));
}
