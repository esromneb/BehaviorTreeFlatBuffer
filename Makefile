.PHONY: wasm all important clean

all: wasm
wasm: out/btfb.wasm


WASM_MAIN = csrc/main.cpp

HPP_FILES = \
csrc/wrapper.hpp \


CPP_FILES = \
csrc/wrapper.cpp \
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


# this is a list of all C functions we want to publish to javascript
# In the main cpp file, each of these is wrapped in extern "C" {}
# the version here has a prepended underscore
# all lines must have trailing comma
EXPORT_STRING = \
"_somefn", \
"_int_sqrt", \
"_pass_write_fn", \
"_get_saved_node_count", \
"_get_saved_node_name", \
"_get_saved_node_id", \
"_get_child_node_count", \
"_get_child_node_id", \
"_register_action_node", \
"_register_condition_node", \
"_unregister_builder", \
"_parse_xml", \
"_lt", \

# Functions used in debugging
# "_callBoundJs", \
# "_debug_example", \


# warning and error flags
CLANG_WARN_FLAGS = \
-Wall -Wextra \
-Wno-ignored-qualifiers \
-Wundef \
-Werror=return-type \
-Wshadow \
# -Wconversion


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

# works however slows down
#-s DISABLE_EXCEPTION_CATCHING=0 \

out/btfb.wasm: $(WASM_MAIN) $(CPP_FILES) $(HPP_FILES) Makefile
	mkdir -p out
	emcc $(WASM_MAIN) $(CPP_FILES) -s WASM=1 -o out/btfb.html \
	-s ALLOW_MEMORY_GROWTH=1 \
	-s ALLOW_TABLE_GROWTH=1 \
	-s EXPORTED_FUNCTIONS='[$(EXPORT_STRING) "_main"]' \
	-s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "cwrap", "addOnPostRun", "addFunction", "setValue", "getValue"]' \
	'-std=c++2a' $(CLANG_O_FLAG) $(CLANG_WARN_FLAGS) $(CLANG_OTHER_FLAGS)



.PHONY: all build watch dev start test pretest lint jestc copydist
.PHONY: test

build:
	npm run build

test: jestc
	npm run test

jestc:
	npm run jestc

# jest watch tests
jestw:
	npm run jestw

copydist:
	npm run copydist


clean:
	rm -rf out/*
	rm -rf dist/*

