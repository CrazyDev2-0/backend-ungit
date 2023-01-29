const Bree = require("bree");
const Graceful = require("@ladjs/graceful");


const bree = new Bree({
  jobs: [
    {
      name: "issue_tracker",
      interval: "10s",
    }
  ],
});

// handle graceful reloads, pm2 support, and events like SIGHUP, SIGINT, etc.
const graceful = new Graceful({ brees: [bree] });
graceful.listen();

// start all jobs (this is the equivalent of reloading a crontab):
bree.start();
