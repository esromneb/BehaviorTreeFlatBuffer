const t05 = require("./btrees/t05.xml");
const testTree14 = require("./btrees/testTree14.xml");
const testTree5 = require("./btrees/testTree5.xml");
const fs = require('fs');

import {BehaviorTreeFlatBuffer} from '../src/index'

function waitForStart(mod): Promise<void> {
  return new Promise((resolve, reject)=>{
    mod.addOnPostRun(resolve);
  });
}

async function _sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}



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




test.skip("test cooked xml", async function(done) {

  const dut = new BehaviorTreeFlatBuffer();

  await dut.start();

  expect(dut.testAnything()).toBe(3);

  dut.debugExample();

  dut.extractNodeIds();
  
  done();
});





// test.skip("test call js fn from c", async function(done) {

//   const dut = new BehaviorTreeFlatBuffer();

//   await dut.start();

//   dut.bindCallback();

//   dut.callCallback();

//   // expect(dut.testAnything()).toBe(3);

//   // dut.debugExample();
  
//   done();
// });


// inject a transition, let the c library choose the time
function inject(dut, id, p: string, n: string): void {
  const t = {
    idle: 0,
    running: 1,
    success: 2,
    failure: 3
  };


  dut.logTransition(id, t[p], t[n]);
}

// inject a transiation, the time (D is for duration, but actually time is abosolute)
// as an argument
function injectD(dut, id, p: string, n: string, absoluteTime: number): void {
  const t = {
    idle: 0,
    running: 1,
    success: 2,
    failure: 3
  };


  dut.logTransitionDuration(id, t[p], t[n], absoluteTime);
}

// same as injectD however we call resetBuffer afterwards
function injectDR(dut, id, p: string, n: string, absoluteTime: number): void {
  injectD(dut, id, p, n, absoluteTime);
  console.log(JSON.stringify(dut.getInternalBuffer()));
  dut.resetBuffer();
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


test("write any xml to file via c", async function(done) {
  
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


  // const dut = new BehaviorTreeFlatBuffer();

  // await dut.start();

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


  // const dut = new BehaviorTreeFlatBuffer();
  // await dut.start();

  for(let i = 0; i < 2; i++) {

    // console.log('RRRRRRRRRRRRRRRRRRRRReset');
    // await _sleep(100);

    dut.reset();

    const extra = i === 1;

    const outputPath = outputPaths[i];

    await dut.setFilePath(outputPath);

    dut.registerActionNodes(actionNodes);
    dut.registerConditionNodes(conditionNodes);

    dut.parseXML(t05);

    // console.log(dut.treeNodeIds);

    injectD(dut, 1, 'idle', 'running', 0);
    // await _sleep(50);
    injectD(dut, 2, 'idle', 'running', 1000);
    // await _sleep(50);
    injectD(dut, 3, 'idle', 'running', 2000);
    // if( extra ) {
    //   await _sleep(250);
    // }
    injectD(dut, 4, 'idle', 'failure', 3000);
    // if( extra ) {
    //   await _sleep(250);
    // }
    injectD(dut, 4, 'failure', 'idle', 4000);
    // await _sleep(50);
    // if( extra ) {
    //   await _sleep(250);
    // }
    injectD(dut, 3, 'running', 'failure', 5000);

    // console.log('bottom');

  }

  // console.log(dut.treeNodeIds);
  // console.log(dut.children);


  done();
});



test("test tree id extraction", async function(done) {
  
  const outputPath = './testTree5.fbl';


  try {
    fs.unlinkSync(outputPath);
  } catch(e) {}

  const actionNodes = [
    'go1',
    'go2',
    'go3',
    'stay1',
    'stay2',
  ];



  // const dut = new BehaviorTreeFlatBuffer();
  // await dut.start();

  await dut.setFilePath(outputPath);

  dut.registerActionNodes(actionNodes);

  dut.parseXML(testTree5);

  console.log(JSON.stringify(dut.children));
  console.log(JSON.stringify(dut.treeNodeIds));

  let got;
  // got = dut.getUIDforPathArray([0,0]);
  got = dut.getForPathArray([0,1,1]);
  // console.log(got);
            // getUIDForPath       
  expect(dut.getNameForUID(dut.getForPath('0.1.1'))).toBe('stay2');


  expect(dut.getNameForUID(dut.getForPath('0'))).toBe('Sequence');

  expect(dut.getNameForUID(dut.getForPath('0.1.2.0'))).toBe('go1');
  expect(dut.getNameForUID(dut.getForPath('0.1.2.1'))).toBe('go2');
  expect(dut.getNameForUID(dut.getForPath('0.1.2.2'))).toBe('go3');
  // console.log(got);


  done();

});






// so you can do
function checkTypedArrayType(someTypedArray) {
  const typedArrayTypes = [
    Int8Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array,
    BigInt64Array,
    BigUint64Array
  ];
  const checked = typedArrayTypes.filter(ta => someTypedArray.constructor === ta);
  return checked.length && checked[0].name || null;
}



test("test internal buffer", async function(done) {
    const actionNodes = [
    'go1',
    'go2',
    'go3',
    'stay1',
    'stay2',
  ];

  dut.writeToBuffer();

  dut.registerActionNodes(actionNodes);

  dut.parseXML(testTree5);

  let hb = dut.getInternalBuffer();

  expect(checkTypedArrayType(hb)).toBe('Uint8Array');

  expect(hb.length > 5000).toBe(true);

  dut.resetBuffer();

  expect(checkTypedArrayType(dut.getInternalBuffer())).toBe('Uint8Array');

  expect(dut.getInternalBuffer().length).toBe(0);

  injectD(dut, 1, 'idle', 'running', 0);

  expect(dut.getInternalBuffer().length).toBe(12);



  dut.reset();
  // this automatically sets parseForFile to false
  dut.writeToBuffer();
  // manually set it to true
  dut.setParseForFile(true);
  dut.registerActionNodes(actionNodes);
  dut.parseXML(testTree5);

  let hb2 = dut.getInternalBuffer();

  expect(checkTypedArrayType(hb2)).toBe('Uint8Array');

  // when we turn parse for file on, it should add 4 bytes
  // we could verify these are correct but this is good for now
  expect(hb.length + 4).toBe(hb2.length);


  done();

});






test("test function writer", async function(done) {
    const actionNodes = [
    'go1',
    'go2',
    'go3',
    'stay1',
    'stay2',
  ];

  let calls = 0;

  let cb = (x: Uint8Array)=>{
    if( calls == 0 ) {
      expect(x.length > 5000).toBe(true);
    } else {
      expect(x.length == 12).toBe(true);
    }

    calls++;
  }

  dut.writeToCallback(cb);

  expect(dut.getParseForFile()).toBe(false);

  dut.registerActionNodes(actionNodes);

  dut.parseXML(testTree5);

  injectD(dut, 1, 'idle', 'running', 0);
  injectD(dut, 2, 'idle', 'running', 1000);
  injectD(dut, 3, 'idle', 'running', 1100);

  expect(calls).toBe(4);

  done();

});



test.skip("test tree print dump", async function(done) {
  
  // const outputPath = './testTree5.fbl';


  // try {
  //   fs.unlinkSync(outputPath);
  // } catch(e) {}

  const actionNodes = [
    'go1',
    'go2',
    'go3',
    'stay1',
    'stay2',
  ];

  dut.writeToBuffer();



  // const dut = new BehaviorTreeFlatBuffer();
  // await dut.start();

  // await dut.setFilePath(outputPath);

  dut.registerActionNodes(actionNodes);

  dut.parseXML(testTree5);

  console.log('header: testTree5');

  console.log(JSON.stringify(dut.getInternalBuffer()));

  dut.resetBuffer();

  injectDR(dut, 1, 'idle', 'running', 0);
  injectDR(dut, 2, 'idle', 'running', 1000);
  injectDR(dut, 3, 'idle', 'running', 1100);
  injectDR(dut, 4, 'idle', 'failure', 1200);
  injectDR(dut, 4, 'failure', 'idle', 1300);
  injectDR(dut, 3, 'running', 'failure', 1400);
  injectDR(dut, 6, 'idle', 'running', 1500);
  injectDR(dut, 7, 'idle', 'running', 1600);
  injectDR(dut, 8, 'idle', 'running', 1700);
  injectDR(dut, 9, 'idle', 'failure', 1800);
  injectDR(dut, 8, 'running', 'success', 1900);
  injectDR(dut, 9, 'failure', 'idle', 2000);
  injectDR(dut, 10, 'idle', 'running', 2100);

  // // console.log(dut.children);
  // // console.log(dut.treeNodeIds);

  // let got;
  // // got = dut.getUIDforPathArray([0,0]);
  // got = dut.getForPathArray([0,1,1]);
  // // console.log(got);
  //           // getUIDForPath       
  // expect(dut.getNameForUID(dut.getForPath('0.1.1'))).toBe('stay2');


  // expect(dut.getNameForUID(dut.getForPath('0'))).toBe('Sequence');

  // expect(dut.getNameForUID(dut.getForPath('0.1.2.0'))).toBe('go1');
  // expect(dut.getNameForUID(dut.getForPath('0.1.2.1'))).toBe('go2');
  // expect(dut.getNameForUID(dut.getForPath('0.1.2.2'))).toBe('go3');
  // console.log(got);


  done();

});






test("write large time stamps xml twice to file", async function(done) {
  
  const outputPaths = ['./large_stamp.fbl'];

  try {
    fs.unlinkSync(outputPaths[0]);
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


  // const dut = new BehaviorTreeFlatBuffer();
  // await dut.start();

  // dut.reset();

  const outputPath = outputPaths[0];

  await dut.setFilePath(outputPath);

  dut.registerActionNodes(actionNodes);
  dut.registerConditionNodes(conditionNodes);

  dut.parseXML(t05);

  // console.log(dut.treeNodeIds);

  injectD(dut, 1, 'idle', 'running', 0);
  injectD(dut, 2, 'idle', 'running', 1000);
  injectD(dut, 3, 'idle', 'running', 1010);
  injectD(dut, 4, 'idle', 'failure', 2000);
  injectD(dut, 4, 'failure', 'idle', 3000);
  injectD(dut, 3, 'running', 'failure', 4000);
  injectD(dut, 3, 'running', 'failure', 40000);
  injectD(dut, 3, 'running', 'failure', 400000);
  injectD(dut, 3, 'running', 'failure', 4000000);
  injectD(dut, 3, 'running', 'failure', 40000000);
  injectD(dut, 3, 'running', 'failure', 400000000);
  injectD(dut, 3, 'running', 'failure', 4000000000);
  injectD(dut, 3, 'running', 'failure', 40000000000);



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



