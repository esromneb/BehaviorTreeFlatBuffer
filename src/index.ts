let wasm = require('../out/ray.js');

function _waitForStart(mod): Promise<void> {
  return new Promise((resolve, reject)=>{
    mod.addOnPostRun(resolve);
  });
}


class BehaviorTreeFlatBuffer {
  constructor(public options = {}) {
    console.log('ctons');
  }

  async start(): Promise<void> {
    console.log('start');
    await _waitForStart(wasm);
  }

  testAnything(): number {
    let int_sqrt = wasm.cwrap('int_sqrt', 'number', ['number'])
    // console.log(`${int_sqrt(12)} === 3`);
    const res = int_sqrt(12);
    return res;
  }

  debugExample(): void {
    let int_sqrt = wasm.cwrap('debug_example', 'void', ['void'])
    // console.log(`${int_sqrt(12)} === 3`);
    int_sqrt();
  }
}


export {
BehaviorTreeFlatBuffer,
}
