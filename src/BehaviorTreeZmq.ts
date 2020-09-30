const zmq = require("zeromq")



// run()

class BehaviorTreeZmq {
  logStartup: boolean = false;
  constructor(public options = {}) {
    if( this.logStartup ) {
      console.log('ctons');
    }
  }

  sock: any;


// zmq.Subscriber
// zmq.Publisher
  // const sock = new zmq.Request
    // const sock = new zmq.Reply


  firstMessage: any;


  async run() {
    this.sock = new zmq.Reply;

    let sock = this.sock;

    // let port = 1666;
    let port = 1667;

    await sock.bind(`tcp://127.0.0.1:${port}`);
    console.log(`Producer bound to port ${port}`);

    for await (const [msg] of sock) {
      console.log("got msg");
      console.log(msg);
      await sock.send(this.firstMessage)
    }

    // while (true) {
    //   await sock.send("some work");
    //   await new Promise(resolve => setTimeout(resolve, 500));
    // }
  }

}


export {
BehaviorTreeZmq,
}

