
.PHONY: wasm all important clean e


wasm: out/btfb.wasm

all: test_png test_parse test_refl test_vec test_orbit wasm

important: wasm test_png


WASM_MAIN = csrc/main.cpp

HPP_FILES = \
csrc/other.hpp \


CPP_FILES = \
csrc/other.cpp \
lib/BehaviorTree.CPP/src/action_node.cpp \
lib/BehaviorTree.CPP/src/basic_types.cpp \
lib/BehaviorTree.CPP/src/behavior_tree.cpp \
lib/BehaviorTree.CPP/src/blackboard.cpp \
lib/BehaviorTree.CPP/src/bt_factory.cpp \
lib/BehaviorTree.CPP/src/decorator_node.cpp \
lib/BehaviorTree.CPP/src/condition_node.cpp \
lib/BehaviorTree.CPP/src/control_node.cpp \
lib/BehaviorTree.CPP/src/shared_library.cpp \
lib/BehaviorTree.CPP/src/tree_node.cpp \
lib/BehaviorTree.CPP/src/decorators/inverter_node.cpp \
lib/BehaviorTree.CPP/src/decorators/repeat_node.cpp \
lib/BehaviorTree.CPP/src/decorators/retry_node.cpp \
lib/BehaviorTree.CPP/src/decorators/subtree_node.cpp \
lib/BehaviorTree.CPP/src/decorators/delay_node.cpp \
lib/BehaviorTree.CPP/src/controls/if_then_else_node.cpp \
lib/BehaviorTree.CPP/src/controls/fallback_node.cpp \
lib/BehaviorTree.CPP/src/controls/parallel_node.cpp \
lib/BehaviorTree.CPP/src/controls/reactive_sequence.cpp \
lib/BehaviorTree.CPP/src/controls/reactive_fallback.cpp \
lib/BehaviorTree.CPP/src/controls/sequence_node.cpp \
lib/BehaviorTree.CPP/src/controls/sequence_star_node.cpp \
lib/BehaviorTree.CPP/src/controls/switch_node.cpp \
lib/BehaviorTree.CPP/src/controls/while_do_else_node.cpp \
lib/BehaviorTree.CPP/src/loggers/bt_cout_logger.cpp \
lib/BehaviorTree.CPP/src/loggers/bt_file_logger.cpp \
lib/BehaviorTree.CPP/src/private/tinyxml2.cpp \
lib/BehaviorTree.CPP/src/xml_parsing.cpp \

# lib/BehaviorTree.CPP/src/loggers/bt_minitrace_logger.cpp \

# WASM only cpp files
WASM_CPP_FILES = \

# this is a list of all C functions we want to publish to javascript
# In the main cpp file, each of these is wrapped in extern "C" {}
# the version here has a prepended underscore
# all lines must have trailing comma
EXPORT_STRING = \
"_somefn", \
"_int_sqrt", \
"_debug_example", \
"_passFnPointer", \
"_callBoundJs", \
"_get_saved_node_count", \
"_get_saved_node_name", \
"_get_saved_node_id", \

# TEMPLATE_FILE = template/proxy_controls.html
# JS_TEMPLATE_FILE = template/pre.ray.js

ifdef EXTRACT_HTML_TEMPLATE
  TEMPLATE_FILE = template/extract_script_template.html
endif

# this is a full command, put in your make body to mark wasm dirty for next build
MARK_WASM_DIRTY=touch src/main.cpp # force make to run again if "make all" is run next

# warning and error flags
CLANG_WARN_FLAGS = \
-Wall -Wextra \
-Wno-ignored-qualifiers \
-Wundef \
-Werror=return-type
# -Wconversion
# -Wshadow


CLANG_OTHER_FLAGS = \
--include-directory=lib/BehaviorTree.CPP/include \
--include-directory=lib/BehaviorTree.CPP/3rdparty \
-DBT_NO_COROUTINES \



CLANG_O_FLAG = '-O3'

ifdef NOOPT
  CLANG_O_FLAG = ' '
endif

ifdef OPT3
  CLANG_O_FLAG = '-O3'
endif

# works however adds 100ms or more to the
# render time
#-s DISABLE_EXCEPTION_CATCHING=0 \

# don't need this until we get poly working
#--preload-file 'root_fs'
out/btfb.wasm: $(WASM_MAIN) $(CPP_FILES) $(HPP_FILES) $(WASM_CPP_FILES) Makefile
	mkdir -p out
	emcc $(WASM_MAIN) $(WASM_CPP_FILES) $(CPP_FILES) -s WASM=1 -o out/btfb.html \
	-s ALLOW_MEMORY_GROWTH=1 \
	-s ALLOW_TABLE_GROWTH=1 \
	-s EXPORTED_FUNCTIONS='[$(EXPORT_STRING) "_main"]' \
	-s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "cwrap", "addOnPostRun", "addFunction", "setValue", "getValue"]' \
	'-std=c++2a' $(CLANG_O_FLAG) $(CLANG_WARN_FLAGS) $(CLANG_OTHER_FLAGS)



# '-Wshadow-all'
#--proxy-to-worker \
#-s PROXY_TO_WORKER_FILENAME='custom.ray' \

# not working due to chrome not liking these options
#-s USE_PTHREADS=1 -s RESERVED_FUNCTION_POINTERS=1
#-s PTHREAD_POOL_SIZE=4

.PHONY: copy_files_target copy copy_fs copy_scenes

copy: copy_files_target copy_fs copy_scenes



# I forget how to copy file and do the sensativity list thing correctly
# so for now this needs to be manual

COPY_LIST = \
template/jquery-3.4.1.min.js \
template/LoadSave.js \
template/GIFEncoder.js \
template/LZWEncoder.js \
template/NeuQuant.js \
template/b64.js \
template/doubleRayInstantiate.js \
template/doubleRayControls.js


# copy files required to compile the project (js etc)
copy_files_target:
	cp $(COPY_LIST) out/



FS_COPY_LIST = \
models/scene2.txt \
models/unit_cube.txt \
models/scenep5.txt \
models/1tri.txt \
models/1triB.txt

# copy files which will act as the root filesystem
copy_fs:
	mkdir -p root_fs
	cp $(FS_COPY_LIST) root_fs/

copy_scenes:
	mkdir -p out/scenes
	cp scenes/*.json out/scenes



# files need only for test or desktop builds (aka not WASM builds)

HPP_TEST_FILES =


CPP_TEST_FILES =



# test_orbit2: src/test_orbit.cpp $(CPP_FILES) $(HPP_FILES) Makefile
# 	g++ test_orbit.cpp $(CPP_FILES) -o $@

# test_parse2: src/test_parse.cpp $(CPP_FILES) $(HPP_FILES) Makefile
# 	g++ $< $(CPP_FILES) -std=c++17  -g -o $@


# # $< name of first prerequisite
# # $@ name of target
# test_orbit: src/test_orbit.cpp $(CPP_FILES) $(HPP_FILES) Makefile
# 	clang++ $(CLANG_WARN_FLAGS) -std=c++2a $< $(CPP_FILES) -g -o $@

# test_vec: src/test_vec.cpp $(CPP_FILES) $(HPP_FILES) Makefile
# 	clang++ $(CLANG_WARN_FLAGS) -std=c++2a $< $(CPP_FILES) -g -o $@


# test_refl: src/test_refl.cpp $(CPP_FILES) $(HPP_FILES) Makefile
# 	clang++ $(CLANG_WARN_FLAGS) -std=c++2a $< $(CPP_FILES) -g -o $@


# test_parse: src/test_parse.cpp $(CPP_FILES) $(HPP_FILES) Makefile
# 	clang++ $(CLANG_WARN_FLAGS) -std=c++2a $< $(CPP_FILES) -g -o $@

# test_ang: src/test_ang.cpp $(CPP_FILES) $(HPP_FILES) Makefile
# 	clang++ $(CLANG_WARN_FLAGS) -std=c++2a $< $(CPP_FILES) -g -o $@



# test_png: src/test_png.cpp $(CPP_FILES) $(HPP_FILES) $(HPP_TEST_FILES) $(CPP_TEST_FILES) Makefile
# 	clang++ $(CLANG_WARN_FLAGS) -std=c++2a $< $(CPP_FILES) $(CPP_TEST_FILES) -O3 -o $@

.PHONY: all build watch dev start test pretest lint jestc
.PHONY: test

# test: test_png
# 	./test_png -a -g

build:
	npm run build

test: jestc
	npm run test

jestc:
	npm run jestc

# jest watch tests
jestw:
	npm run jestw


.PHONY: rmtest movetestideal rmideal

# rmtest: 
# 	rm -rf img/test/*.png

# rmideal: 
# 	rm -rf img/ideal/*.png

# movetestideal: rmideal
# 	mv img/test/*.png img/ideal/


clean:
	rm -rf out/*
	rm -rf dist/*


# .PHONY: build_publish copy_to_dist

# copy_to_dist: dist/ray.wasm

# PUBLISH_COPY = \
# out/ray.wasm \
# out/ray.js \
# out/doubleRayInstantiate.js \
# out/doubleRayControls.js \
# out/doubleRayBridge.js


# # copy everything we need over to dist
# dist/ray.wasm: out/ray.wasm out/ray.js
# 	mkdir -p dist
# 	cp $(PUBLISH_COPY) dist/

# build_publish: copy out/doubleRayBridge.js dist/ray.wasm 


