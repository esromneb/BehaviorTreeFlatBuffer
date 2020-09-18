#include "other.hpp"


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


int main(int argc, char ** argv) {
    (void)argc;
    (void)argv;
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



