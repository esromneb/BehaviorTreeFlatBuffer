const fs = require('fs');

function _waitForStart(mod): Promise<void> {
  return new Promise((resolve, reject)=>{
    mod.addOnPostRun(resolve);
  });
}

function _catbuf(resultConstructor, ...arrays) {
    let totalLength = 0;
    for (const arr of arrays) {
        totalLength += arr.length;
    }
    const result = new resultConstructor(totalLength);
    let offset = 0;
    for (const arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
}


class BehaviorTreeFlatBuffer {
  wasm: any;

  logStartup: boolean = false;
  logWrites: boolean = false;

  constructor(public options = {}) {
    if( this.logStartup ) {
      console.log('ctons');
    }

    this.wasm = require('../out/btfb.js');
  }

  startCalled: boolean = false;

  async start(): Promise<void> {
    if( !this.startCalled ) {
      
      if( this.logStartup ) {
        console.log('start');
      }
      await _waitForStart(this.wasm);


      this.bindCWrap();
    }

    this.reset();

    this.startCalled = true;
  }


  reset(): void {
    // required to call as it calls new on needed objects
    this.c.reset_all();
  }

  // writeBufferContainer: {buf: Uint8Array};

  internalBuffer: Uint8Array;

  writeToBuffer(): void {
    // this.writeBufferContainer = o;

    this.setParseForFile(false);

    this.resetBuffer();

    this.bindBufferWriter();
  }

  getInternalBuffer(): Uint8Array {
    return this.internalBuffer;
  }

  resetBuffer(): void {
    this.internalBuffer = Uint8Array.of();
  }


  private bindBufferWriter(): void {

    const wasm = this.wasm;
    const that = this;

    // example of grabbing byte array directly from wasm memory
    this.boundFnPtr = wasm.addFunction(function(ptr, sz) {


      if(that.logWrites) {
        console.log(`in js bindBufferWriter ${ptr} ${sz}`);
      }

      var myCharArray: Uint8Array = wasm.HEAPU8.subarray(ptr, ptr+sz);

      
      that.internalBuffer = _catbuf(Uint8Array, that.internalBuffer, myCharArray);
      // console.log(that.internalBuffer);

    }, 'vii');


    let passFn = wasm.cwrap('pass_write_fn', 'void', ['number']);

    passFn(this.boundFnPtr);

  }











  filePath: string|undefined = undefined;
  fd: number|undefined = undefined;

  setFilePath(path: string): Promise<void> {

    this.setParseForFile(true);

    this.bindFileWriter();

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

  private _writeSync(buffer: Uint8Array): void {
    fs.writeSync(this.fd, buffer, 0, buffer.length, null);
  }

  private _write(buffer: Uint8Array): Promise<void> {

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

  bindCallback(): void {

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


    let passFn = wasm.cwrap('pass_write_fn', 'void', ['number']);

    passFn(this.boundFnPtr);

  }


  // this binds the file writer into c
  // every time the c has bytes to write to disk
  // the lambda inside this function gets called
  private bindFileWriter(): void {

    const wasm = this.wasm;
    const that = this;

    // example of grabbing byte array directly from wasm memory
    this.boundFnPtr = wasm.addFunction(function(ptr, sz) {


    if(that.logWrites) {
      console.log(`in js function2 ${ptr} ${sz}`);
    }

      var myCharArray: Uint8Array = wasm.HEAPU8.subarray(ptr, ptr+sz);

      if( that.fd == undefined ) {
        console.log("Error: bindFileWriter requires fd to be set ");
        return;
      }

      that._writeSync(myCharArray);
      
      if(that.logWrites) {
        console.log(myCharArray);
      }
      // console.log(wasm.HEAPU8);

    }, 'vii');


    let passFn = wasm.cwrap('pass_write_fn', 'void', ['number']);

    passFn(this.boundFnPtr);

  }













  c: {[name: string]: Function} = {};

  bindCWrap(): void {
    const wasm = this.wasm;
    const c = this.c;
    const w = wasm.cwrap;

    c.int_sqrt                 = w('int_sqrt',                'number', ['number']);
    c.debug_example            = w('debug_example',           'void', ['void'])
    c.callBoundJs              = w('callBoundJs',             'void', ['void']);
    c.get_saved_node_count     = w('get_saved_node_count',    'number', ['void']);
    c.get_saved_node_name      = w('get_saved_node_name',     'string', ['number']);
    c.get_saved_node_id        = w('get_saved_node_id',       'number', ['number']);
    c.get_child_node_count     = w('get_child_node_count',    'number', ['number']);
    c.get_child_node_id        = w('get_child_node_id',       'number', ['number','number']);
    c.lt                       = w('lt',                      'number', ['number','number','number']);
    c.ltd                      = w('ltd',                     'number', ['number','number','number','number']);
    c.register_action_node     = w('register_action_node',    'void', ['string']);
    c.register_condition_node  = w('register_condition_node', 'void', ['string']);
    c.unregister_builder       = w('unregister_builder',      'void', ['string']);
    c.parse_xml                = w('parse_xml',               'number', ['string', 'number']);
    c.reset_factory            = w('reset_factory',           'void', ['void']);
    c.reset_all                = w('reset_all',               'void', ['void']);
    c.reset_trackers           = w('reset_trackers',          'void', ['void']);
  }





  setParseForFile(e: boolean): void {
    this.parseForFile = e;
  }

  private parseForFile: boolean = true;

  // parse xml
  // for file is determined by member variable
  // this member is set based on which of
  //   setFilePath
  //   writeToBuffer
  // has been called
  parseXML(xml: string): void {
    this.parseXMLInternal(xml, this.parseForFile);
  }

  parseXMLInternal(xml: string, forFile: boolean): void {
    const ret = this.c.parse_xml(xml, forFile);

    if( ret !== 0 ) {
      throw new Error(`parse_xml() c function returned error: ${ret}`);
    }

    this.extractNodeIds();
  }

  registerActionNodes(ns: string[]): void {
    for(const n of ns) {
      this.c.register_action_node(n);
    }
  }

  registerConditionNodes(ns: string[]): void {
    for(const n of ns) {
      this.c.register_condition_node(n);
    }
  }

  logTransition(uid: number, prev_status: number, status: number): void {
    const ret = this.c.lt(uid, prev_status, status);
    if( ret !== 0 ) {
      throw new Error(`lt() c function returned error: ${ret}`);
    }
  }

  logTransitionDuration(uid: number, prev_status: number, status: number, duration_ms: number): void {
    const ret = this.c.ltd(uid, prev_status, status, duration_ms);
    if( ret !== 0 ) {
      throw new Error(`ltd() c function returned error: ${ret}`);
    }
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

    // console.log(this.treeNodeIds);
    // console.log(this.children);

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


  getNameForUID(u: number): string {
    return this.treeNodeIds[u];
  }


  // get UID by path
  getForPath(path: string): number {
    const ps = path.split('.').map(x=>parseInt(x,10));
    return this.getForPathArray(ps);
  }

  // get UID by path array
  getForPathArray(ps: number[]): number {

    // due to our patching of BehaviorTree.CPP, the first node is always 1
    const base = 1;


    if( ps[0] != 0 ) {
      throw new Error("Path starting at a number other than 0 is not valid");
    }

    let lut = base;

    const c = this.children;

    // j is the position in the path
    // i is the path value
    for(let j = 1; j < ps.length; j++) {
      const i = ps[j];

      lut = c[lut][i];
    }

    return lut;
  }

}


export {
BehaviorTreeFlatBuffer,
}
