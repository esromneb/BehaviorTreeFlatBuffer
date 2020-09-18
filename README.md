[![Build Status](https://travis-ci.com/esromneb/BehaviorTreeFlatBuffer.svg?branch=master)](https://travis-ci.com/esromneb/BehaviorTreeFlatBuffer)
# BehaviorTreeFlatBuffer
A wrapper for BehaviorTree.CPP for the purpose of writing flatbuffers.  Pass a javascript callback and a valid Groot xml file.  A flatbuffer log will be written via the callback in Int8Array typed buffers.

# Dependencies
* emscripten compiler (I'm using) `1.39.11`
* https://github.com/BehaviorTree/BehaviorTree.CPP (included via submodule)

# Publish notes to myself
* Publish with:
```bash
make
npm run build
```


# Notes to myself
* Pass in xml
* write new code to grab uid from tree
* copy bt_file_logger calls

* I could practice writing the file with baked xml and a few baked uid calls


# See Also Emscripten
* https://github.com/Planeshifter/emscripten-examples/tree/master/01_PassingArrays  Arrays js->C
* https://stackoverflow.com/questions/28904273/struct-operations-in-javascript-through-emscripten Arrays c->js
* https://stackoverflow.com/questions/47248045/webassembly-calling-javascript-methods-from-wasm-i-e-within-c-code Arrays c->js
* https://stackoverflow.com/questions/55446258/emscripten-pass-uint8-t-array-to-javascript Arrays c->js
* https://emscripten.org/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html#calling-javascript-functions-as-function-pointers-from-c Types for c->js


