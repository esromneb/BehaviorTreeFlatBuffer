[![Build Status](https://travis-ci.com/esromneb/BehaviorTreeFlatBuffer.svg?branch=master)](https://travis-ci.com/esromneb/BehaviorTreeFlatBuffer)
# BehaviorTreeFlatBuffer
A wrapper for [BehaviorTree.CPP](https://github.com/BehaviorTree/BehaviorTree.CPP) for the purpose of writing FlatBuffers.  Pass a javascript callback and a valid [Groot](https://github.com/BehaviorTree/Groot) xml file.  A log in FlatBuffer format will be written via the callback in Int8Array Buffers.

# Dependencies
* emscripten compiler (I'm using) `1.39.11`
* https://github.com/BehaviorTree/BehaviorTree.CPP (included via submodule)

# Publish notes to myself
* Publish with:
```bash
nvm use 14
source emsdk/emsdk_env.sh
make wasm build
npm publish
```


# Quirks about WASM
* Not sure if I know how to shutdown the wasm properly. It may be better to only have one instance
  * This stems from how I am including the `.js` file output by emscripten.  Not sure how to fix this.
* My test has the wasm file in the path of `/out` where it is built, but publish requires a different path
  * Thus I patch the `.js` file


# See Also Emscripten
* https://github.com/Planeshifter/emscripten-examples/tree/master/01_PassingArrays  Arrays js->C
* https://stackoverflow.com/questions/28904273/struct-operations-in-javascript-through-emscripten Arrays c->js
* https://stackoverflow.com/questions/47248045/webassembly-calling-javascript-methods-from-wasm-i-e-within-c-code Arrays c->js
* https://stackoverflow.com/questions/55446258/emscripten-pass-uint8-t-array-to-javascript Arrays c->js
* https://emscripten.org/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html#calling-javascript-functions-as-function-pointers-from-c Types for c->js


