const t05 = require("./btrees/t05.xml");
const testTree14 = require("./btrees/testTree14.xml");
const testTree5 = require("./btrees/testTree5.xml");
const fs = require('fs');

import {BehaviorTreeZmq} from '../src/BehaviorTreeZmq'


// console.log(t05);

jest.setTimeout(990000);





// global single instance of this
let dut;

// can return a promise, but doesn't have to
beforeAll(() => {
  console.log("build");
  dut = new BehaviorTreeFlatBuffer();

  return dut.start();

  // return initializeCityDatabase();
});

beforeEach(() => {
  // console.log("reset");
  dut.reset();
});





test.skip("test zmq", async function(done) {

  setInterval(()=>{console.log('now')}, 1000);

  const zut = new BehaviorTreeZmq();

  await zut.run();

  
  // done();
});


