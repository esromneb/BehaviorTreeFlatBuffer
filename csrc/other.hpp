#pragma once

#include <cstdint>

extern "C" {

void debug_example(void);




uint32_t get_saved_node_count(void);

const char* get_saved_node_name(const uint32_t i);

uint32_t get_saved_node_id(const uint32_t i);





}
