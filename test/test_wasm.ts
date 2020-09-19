const t05 = require("./btrees/t05.xml");
const testTree14 = require("./btrees/testTree14.xml");
const fs = require('fs');


function waitForStart(mod): Promise<void> {
  return new Promise((resolve, reject)=>{
    mod.addOnPostRun(resolve);
  });
}

async function _sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}




// this breaks the dut tests below
test.skip("test wasm full", async function(done) {

  let wasm = require('../out/ray.js');
  // console.log(foo);
  await waitForStart(wasm);
  
  console.log('post run');

  // const mymod = foo;

// console.log(foo.calledRun);
// console.log(foo.runtimeInitialized);

// await foo.callMain();

  let int_sqrt = wasm.cwrap('int_sqrt', 'number', ['number'])
  expect(int_sqrt(12)).toBe(3);
// console.log();
// console.log(int_sqrt(28));
  done();
  // });

  // setTimeout(()=>{



// const int_sqrt = mymod.cwrap('somefn', 'void', ['void']);

// console.log(int_sqrt());

  // console.log(emsc);

  // }, 100);
});


import {BehaviorTreeFlatBuffer} from '../src/index'


test.skip("test cooked xml", async function(done) {

  const dut = new BehaviorTreeFlatBuffer();

  await dut.start();

  expect(dut.testAnything()).toBe(3);

  dut.debugExample();

  dut.extractNodeIds();
  
  done();
});





test.skip("test call js fn from c", async function(done) {

  const dut = new BehaviorTreeFlatBuffer();

  await dut.start();

  dut.bindCallback();

  dut.callCallback();

  // expect(dut.testAnything()).toBe(3);

  // dut.debugExample();
  
  done();
});



test.skip("write file with ascii", async function(done) {

  const dut = new BehaviorTreeFlatBuffer();

  await dut.start();

  await dut.setFilePath('./node.fbl');

  let b0 = new Buffer('a');
  let b1 = new Buffer('b');


  await dut._write(b0);
  await dut._write(b1);
  // expect(dut.testAnything()).toBe(3);

  // dut.debugExample();

  // dut.extractNodeIds();
  
  done();
});


function inject(dut, id, p: string, n: string): void {
  const t = {
    idle: 0,
    running: 1,
    success: 2,
    failure: 3
  };


  dut.logTransition(id, t[p], t[n]);


}


test.skip("write baked xml to file via c", async function(done) {

  const dut = new BehaviorTreeFlatBuffer();

  await dut.start();

  await dut.setFilePath('./node.fbl');

  // dut.bindCallback2();

  dut.debugExample();

  dut.extractNodeIds();


// ID: 1 idle - running
// ID: 2 idle - running
// ID: 3 idle - running
// ID: 4 idle - failure
// ID: 4 failure - idle
// ID: 3 running - failure
// ID: 6 idle - running

  if( false ) {
    dut.logTransition(1, 0, 1);
    dut.logTransition(2, 0, 1);
    dut.logTransition(3, 0, 1);
    dut.logTransition(4, 0, 2);
    dut.logTransition(4, 2, 0);
  }

  inject(dut, 1, 'idle', 'running');
inject(dut, 2, 'idle', 'running');
inject(dut, 3, 'idle', 'running');
inject(dut, 4, 'idle', 'failure');
inject(dut, 4, 'failure', 'idle');
inject(dut, 3, 'running', 'failure');
inject(dut, 6, 'idle', 'running');
inject(dut, 7, 'idle', 'running');
inject(dut, 8, 'idle', 'running');
inject(dut, 9, 'idle', 'failure');
inject(dut, 8, 'running', 'success');
inject(dut, 9, 'failure', 'idle');
inject(dut, 10, 'idle', 'running');
inject(dut, 11, 'idle', 'running');
inject(dut, 11, 'running', 'failure');
inject(dut, 11, 'failure', 'idle');
inject(dut, 11, 'idle', 'running');
inject(dut, 11, 'running', 'failure');
inject(dut, 11, 'failure', 'idle');
inject(dut, 11, 'idle', 'running');
inject(dut, 11, 'running', 'failure');
inject(dut, 11, 'failure', 'idle');
inject(dut, 11, 'idle', 'running');
inject(dut, 11, 'running', 'failure');
inject(dut, 11, 'failure', 'idle');
inject(dut, 10, 'running', 'failure');
inject(dut, 8, 'success', 'idle');
inject(dut, 10, 'failure', 'idle');
inject(dut, 7, 'running', 'failure');
inject(dut, 6, 'running', 'failure');
inject(dut, 7, 'failure', 'idle');
inject(dut, 13, 'idle', 'running');
inject(dut, 13, 'running', 'success');
inject(dut, 3, 'failure', 'idle');
inject(dut, 6, 'failure', 'idle');
inject(dut, 13, 'success', 'idle');
inject(dut, 2, 'running', 'success');
inject(dut, 14, 'idle', 'running');
inject(dut, 14, 'running', 'success');
inject(dut, 2, 'success', 'idle');
inject(dut, 14, 'success', 'idle');
inject(dut, 1, 'running', 'success');
inject(dut, 1, 'success', 'idle');


  // dut.callCallback();

  // expect(dut.testAnything()).toBe(3);

  // dut.debugExample();
  
  done();
});


test.skip("write any xml to file via c", async function(done) {
  
  // step 1 write nodes

            // <Action ID="CloseDoor"/>
            // <SubTree ID="DoorClosed"/>
            // <Condition ID="IsDoorOpen"/>
            // <Action ID="OpenDoor"/>
            // <Action ID="PassThroughDoor"/>
            // <Action ID="PassThroughWindow"/>

  const outputPath = './t05.fbl';

  try {
    fs.unlinkSync(outputPath);
  } catch(e) {}

  const actionNodes = [
    'CloseDoor',
    'OpenDoor',
    'PassThroughDoor',
    'PassThroughWindow',
  ];

  const conditionNodes = [
    'IsDoorOpen',
  ];


  const dut = new BehaviorTreeFlatBuffer();

  await dut.start();

  await dut.setFilePath(outputPath);

  dut.registerActionNodes(actionNodes);
  dut.registerConditionNodes(conditionNodes);

  dut.parseXML(t05);

  console.log(dut.treeNodeIds);

  inject(dut, 1, 'idle', 'running');
  await _sleep(50);
  inject(dut, 2, 'idle', 'running');
  await _sleep(50);
  inject(dut, 3, 'idle', 'running');
  inject(dut, 4, 'idle', 'failure');
  inject(dut, 4, 'failure', 'idle');
  await _sleep(50);
  inject(dut, 3, 'running', 'failure');


  // console.log(dut.treeNodeIds);
  // console.log(dut.children);


  done();
});





test("write same xml twice to file", async function(done) {
  
  const outputPaths = ['./t05_0.fbl', './t05_1.fbl'];

  try {
    fs.unlinkSync(outputPaths[0]);
    fs.unlinkSync(outputPaths[1]);
  } catch(e) {}

  const actionNodes = [
    'CloseDoor',
    'OpenDoor',
    'PassThroughDoor',
    'PassThroughWindow',
  ];

  const conditionNodes = [
    'IsDoorOpen',
  ];


  const dut = new BehaviorTreeFlatBuffer();
  await dut.start();

  for(let i = 0; i < 2; i++) {

    console.log('RRRRRRRRRRRRRRRRRRRRReset');
    await _sleep(100);

    dut.reset();

    const extra = i === 1;

    const outputPath = outputPaths[i];

    await dut.setFilePath(outputPath);

    dut.registerActionNodes(actionNodes);
    dut.registerConditionNodes(conditionNodes);

    dut.parseXML(t05);

    // console.log(dut.treeNodeIds);

    inject(dut, 1, 'idle', 'running');
    await _sleep(50);
    inject(dut, 2, 'idle', 'running');
    await _sleep(50);
    inject(dut, 3, 'idle', 'running');
    if( extra ) {
      await _sleep(250);
    }
    inject(dut, 4, 'idle', 'failure');
    if( extra ) {
      await _sleep(250);
    }
    inject(dut, 4, 'failure', 'idle');
    await _sleep(50);
    if( extra ) {
      await _sleep(250);
    }
    inject(dut, 3, 'running', 'failure');

    console.log('bottom');

  }

  // console.log(dut.treeNodeIds);
  // console.log(dut.children);


  done();
});




test.skip("testtree14 to fbl", async function(done) {
  
  const outputPath = './node14.fbl';

  try {
    fs.unlinkSync(outputPath);
  } catch(e) {}

  const actionNodes = [
    'inOnlyA',
    'inOnlyB',
    'outOnlyA',
    'outOnlyB',
    'outOnlyC',
    'outOnlyD',
    'outOnlyE',
    'outOnlyF',
    ];

  const conditionNodes = [
    'IsDoorOpen',
  ];


  const dut = new BehaviorTreeFlatBuffer();

  dut.logWrites = true;

  await dut.start();

  await dut.setFilePath(outputPath);

  dut.registerActionNodes(actionNodes);
  dut.registerConditionNodes(conditionNodes);

  dut.parseXML(testTree14);

  console.log(dut.treeNodeIds);

  inject(dut, 1, 'idle', 'running');
  // inject(dut, 2, 'idle', 'idle');
  // inject(dut, 1, 'idle', 'success');
  // inject(dut, 1, 'idle', 'success');
  // inject(dut, 2, 'idle', 'success');
  await _sleep(50);
  // inject(dut, 2, 'idle', 'running');
  // await _sleep(50);
  // inject(dut, 3, 'idle', 'running');
  // inject(dut, 4, 'idle', 'failure');
  // inject(dut, 4, 'failure', 'idle');
  // await _sleep(50);
  // inject(dut, 3, 'running', 'failure');


  // console.log(dut.treeNodeIds);
  // console.log(dut.children);


  done();
});




test.skip("testtree14 to buffer", async function(done) {
  
  const outputPath = './node14.fbl';

  try {
    fs.unlinkSync(outputPath);
  } catch(e) {}

  const actionNodes = [
    'inOnlyA',
    'inOnlyB',
    'outOnlyA',
    'outOnlyB',
    'outOnlyC',
    'outOnlyD',
    'outOnlyE',
    'outOnlyF',
    ];

  const conditionNodes = [
    'IsDoorOpen',
  ];


  const dut = new BehaviorTreeFlatBuffer();

  // dut.logWrites = true;

  // let buf = Uint8Array.of();

  // console.log(buf);

  await dut.start();

  dut.writeToBuffer();

  dut.registerActionNodes(actionNodes);
  dut.registerConditionNodes(conditionNodes);

  dut.parseXML(testTree14);

  // console.log(dut.treeNodeIds);

  inject(dut, 1, 'idle', 'running');
  await _sleep(50);


  let b0 = Uint8Array.of(1,2,5);
  let b1 = Uint8Array.of(1,2);

  console.log(Buffer.compare(b0,b1));




  done();
});



