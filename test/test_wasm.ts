var fs = require('fs');


function waitForStart(mod): Promise<void> {
  return new Promise((resolve, reject)=>{
    mod.addOnPostRun(resolve);
  });
}



test("test wasm full", async function(done) {

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