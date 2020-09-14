let wasm = require('../out/btfb.js');

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


    // mergeInto(wasm, {
    //   read_u8s: function(myStructPointer, size) {
    //     // Assumes the struct starts on a 4-byte boundary
    //     // var myNumber = HEAPU32[myStructPointer/4];
    //     // console.log(myNumber);
    //     // Assumes my_char_array is immediately after my_number with no padding
    //     var myCharArray = HEAPU8.subarray(myStructPointer, size);
    //     console.log(myCharArray);
    //   }
    // });

    this.bindCallback();
  }

  boundFnPtr: number;

  private bindCallback(): void {

    // example of grabbing byte array directly from wasm memory
    this.boundFnPtr = wasm.addFunction(function(ptr, sz) {

      console.log(`in js function ${ptr} ${sz}`);

      if( false ) {
        let v0;
        for(let i = 0; i < 5; i++) {
          v0 = wasm.getValue(ptr+i, 'i8');
          console.log(v0);
        }
      }


      var myCharArray = wasm.HEAPU8.subarray(ptr, ptr+sz);

      console.log(myCharArray);
      // console.log(wasm.HEAPU8);

    }, 'vii');


    let passFn = wasm.cwrap('passFnPointer', 'void', ['number']);

    passFn(this.boundFnPtr);

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

  callCallback(): void {
    let fn = wasm.cwrap('callBoundJs', 'void', ['void']);

    fn();
  }
}


export {
BehaviorTreeFlatBuffer,
}
