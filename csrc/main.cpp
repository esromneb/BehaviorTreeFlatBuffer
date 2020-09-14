// #include <stdio.h>

// #include "Vec3.hpp"
// #include "Vec.hpp"
// #include "RayEngine.hpp"
// #include "fileio.h"
// #include "Parser.hpp"
// #include "RayApi.hpp"
// #include "JsApi.hpp"


#include <iostream>
#include <vector>
#include <stdint.h>
#include <chrono>
#include <unistd.h> //usleep
#include <functional>
#include <cmath>


#include <stdio.h>
#include <SDL/SDL.h>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif



using namespace std;


extern "C" {

// void setupEngine(void) {
//     engine = new RayEngine();
//     engine->resize(400,400);

//     setRayApiTarget(engine);

//     // engine->makeObjects();
//     // engine->render();

//     // uint32_t x = 400;
//     // uint32_t y = 400;
//     // buffer.resize(x);
//     // for(auto &row : buffer) {
//     //     row.resize(y);
//     // }

//     // engine->makeObjects();

//     // readWaveFront( *engine );

// }




} // extern C


// SDL_Surface *screen = 0;

std::chrono::steady_clock::time_point frames_then;
unsigned frames = 0;
unsigned frames_p = 0;


// unsigned frame_sleep = 0;



///
/// Lock the screen
/// call the RayEngine's internal copy to pixels
/// and done
///
// void officialCopyBuffer(void) {
//     if (SDL_MUSTLOCK(screen)) SDL_LockSurface(screen);

//     if( engine->enableAlpha ) {
//         engine->copyToPixels(SDL_MapRGBA, screen->pixels, screen->format);
//     } else {
//         engine->copyToPixels(SDL_MapRGB, screen->pixels, screen->format);
//     }


//     if (SDL_MUSTLOCK(screen)) SDL_UnlockSurface(screen);
//     SDL_Flip(screen);
// }




// sets global screen
// void initSetResolution(const unsigned x, const unsigned y) {
//     SDL_Init(SDL_INIT_VIDEO);
//     screen = SDL_SetVideoMode(x, y, 32, SDL_SWSURFACE);

//     #ifdef TEST_SDL_LOCK_OPTS
//     EM_ASM("SDL.defaults.copyOnLock = false; SDL.defaults.discardOnLock = true; SDL.defaults.opaqueFrontBuffer = false;");
//     #endif

//     xCanvas = x;
//     yCanvas = y;
// }

// bool sdlInitCalled = false;

// // This is for wasm only, however it should not be visible to javascript
// // this gets called by RayApi::resizeBuffer
// // we should not call resizeBuffer() from here to avoid recursion loop
// void resizeCanvasInternal(const unsigned x, const unsigned y) {

//     if( !sdlInitCalled ) {
//         SDL_Init(SDL_INIT_VIDEO);
//         sdlInitCalled = true;
//     }

//     screen = SDL_SetVideoMode(x, y, 32, SDL_SWSURFACE);

//     // resizeBuffer(x,y);
//     xCanvas = x;
//     yCanvas = y;
// }

// void gotB64String(const std::string& s, const int tag) {
//     postB64(s.c_str(), tag);
// }

int main(int argc, char ** argv) {
    cout << "Main run\n";
    (void)argc;
    (void)argv;


    // initSetResolution(400, 400);
    // setResizeCallback(resizeCanvasInternal);
    // setCopyGlCallback(officialCopyBuffer);
    // setCopyB64Callback(gotB64String);
    
    frames_then = std::chrono::steady_clock::now();


    // officialRenderRainbow(false, false);

    // SDL_Quit();

    return 0;
}




///
/// These are some of the Javascript -> C++ functions
///

extern "C" {

void somefn(void) {
    cout << "hi " << "somefn" << "\n";
}

int int_sqrt(int x) {
  return sqrt(x);
}


} // extern C





