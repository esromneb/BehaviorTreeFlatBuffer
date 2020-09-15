


function waitForStart(mod): Promise<void> {
  return new Promise((resolve, reject)=>{
    mod.addOnPostRun(resolve);
  });
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



test("write baked xml to file via c", async function(done) {

  const dut = new BehaviorTreeFlatBuffer();

  await dut.start();

  await dut.setFilePath('./node.fbl');

  dut.bindCallback2();

  dut.debugExample();

  dut.extractNodeIds();

  dut.logTransition(1, 0, 1);
  dut.logTransition(6, 1, 1);

  // dut.callCallback();

  // expect(dut.testAnything()).toBe(3);

  // dut.debugExample();
  
  done();
});
