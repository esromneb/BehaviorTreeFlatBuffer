#include <iostream>
#include <vector>
#include <unistd.h> //usleep
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


extern "C" {

void somefn(void) {
    cout << "hi " << "somefn" << "\n";
}

int int_sqrt(const int x) {
    return sqrt(x);
}


} // extern C

