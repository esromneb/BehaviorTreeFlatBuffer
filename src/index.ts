const fs = require('fs');

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


    this.bindCWrap();
    this.bindCallback();
  }

  filePath: string|undefined = undefined;
  fd: number|undefined = undefined;

  setFilePath(path: string): Promise<void> {

    const that = this;

    return new Promise((resolve, reject)=>{
      fs.open(path, 'w', function(err, fd) {
          if (err) {
            reject(err);
              // throw 'could not open file: ' + err;
              return;
          }
          that.fd = fd;
          resolve();
      });
    });

    

  }


  _write(buffer: any): Promise<void> {

    const that = this;

    return new Promise((resolve, reject)=>{
      
        fs.write(that.fd, buffer, 0, buffer.length, null, function(err) {
          if (err) {
            reject(err);
              // throw 'could not open file: ' + err;
              return;
          }
          resolve();
            // if (err) throw 'error writing file: ' + err;
            // fs.close(fd, function() {
            //     console.log('wrote the file successfully');
            // });
        });
    });
    // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
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

    c.int_sqrt              = wasm.cwrap('int_sqrt',              'number', ['number']);
    c.debug_example         = wasm.cwrap('debug_example',         'void', ['void'])
    c.callBoundJs           = wasm.cwrap('callBoundJs',           'void', ['void']);
    c.get_saved_node_count  = wasm.cwrap('get_saved_node_count',  'number', ['void']);
    c.get_saved_node_name   = wasm.cwrap('get_saved_node_name',   'string', ['number']);
    c.get_saved_node_id     = wasm.cwrap('get_saved_node_id',     'number', ['number']);
    c.get_child_node_count  = wasm.cwrap('get_child_node_count',  'number', ['number']);
    c.get_child_node_id     = wasm.cwrap('get_child_node_id',     'number', ['number','number']);
// uint32_t get_child_node_count(const uint32_t i) {
// uint32_t get_child_node_id(const uint32_t i, const uint32_t j) {

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
  // seems like node ids start at 1 not 0
  // this allows it to be similar to others
  children: any = [[]];
  // tree: any = {};

  extractNodeIds(): void {
    const c = this.c;
    const count = c.get_saved_node_count();

    for(let i = 0; i < count; i++) {
      const name = c.get_saved_node_name(i);
      const id = c.get_saved_node_id(i);
      this.treeNodeIds[id] = name;
      // console.log(`${name} -> ${id}`);


      this.children[id] = this.extractChildrenIds(id);

    }

    console.log(this.treeNodeIds);
    console.log(this.children);

    // console.log(`Got ${count} xml nodes`);
  }



  extractChildrenIds(id: number): number[] {
    const c = this.c;
    let ret = [];
    const count = c.get_child_node_count(id);

    for(let i = 0; i < count; i++) {
      const a_child_id = c.get_child_node_id(id, i);
      ret.push(a_child_id);
    }

    return ret;
  }

}


export {
BehaviorTreeFlatBuffer,
}
