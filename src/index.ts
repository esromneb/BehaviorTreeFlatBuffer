function _waitForStart(mod): Promise<void> {
  return new Promise((resolve, reject)=>{
    mod.addOnPostRun(resolve);
  });
}


class BehaviorTreeFlatBuffer {
  wasm: any;
  constructor(public options = {}) {
    console.log('ctons');

    this.wasm = require('../out/btfb.js');
  }

  async start(): Promise<void> {
    console.log('start');
    await _waitForStart(this.wasm);


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

    this.bindCWrap();

    this.bindCallback();
  }

  boundFnPtr: number;

  private bindCallback(): void {

    const wasm = this.wasm;

    // example of grabbing byte array directly from wasm memory
    this.boundFnPtr = wasm.addFunction(function(ptr, sz) {



      console.log(`in js function ${ptr} ${sz}`);

      if( false ) {
        let v0;
        for(let i = 0; i < 5; i++) {
          v0 = this.wasm.getValue(ptr+i, 'i8');
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


  c: {[name: string]: Function} = {};

  bindCWrap(): void {
    const wasm = this.wasm;
    const c = this.c;

    c.int_sqrt              = wasm.cwrap('int_sqrt', 'number', ['number']);
    c.debug_example         = wasm.cwrap('debug_example', 'void', ['void'])
    c.callBoundJs           = wasm.cwrap('callBoundJs', 'void', ['void']);
    c.get_saved_node_count  = wasm.cwrap('get_saved_node_count', 'number', ['void']);
    c.get_saved_node_name   = wasm.cwrap('get_saved_node_name', 'string', ['number']);
    c.get_saved_node_id     = wasm.cwrap('get_saved_node_id', 'number', ['number']);


  }

  testAnything(): number {
    // console.log(`${int_sqrt(12)} === 3`);
    const res = this.c.int_sqrt(12);
    return res;
  }

  debugExample(): void {
    // let int_sqrt = this.wasm.cwrap('debug_example', 'void', ['void'])
    // console.log(`${int_sqrt(12)} === 3`);
    this.c.debug_example();
  }

  callCallback(): void {
    // let fn = this.wasm.cwrap('callBoundJs', 'void', ['void']);

    // fn();
    this.c.callBoundJs();
  }

  treeNodeIds: any = {};

  extractNodeIds(): void {
    const c = this.c;
    const count = c.get_saved_node_count();

    for(let i = 0; i < count; i++) {
      const name = c.get_saved_node_name(i);
      const id = c.get_saved_node_id(i);
      this.treeNodeIds[name] = id;
    }

    console.log(this.treeNodeIds);

    // console.log(`Got ${count} xml nodes`);
  }
}


export {
BehaviorTreeFlatBuffer,
}
