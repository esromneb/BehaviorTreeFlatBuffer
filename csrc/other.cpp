///
/// See BehaviorTree.CPP/examples/t05_crossdoor.cpp
/// This is testing to see how I can hijack the logger
/// 
///
#include "other.hpp"

#include "behaviortree_cpp_v3/loggers/bt_cout_logger.h"
#include "behaviortree_cpp_v3/loggers/bt_minitrace_logger.h"
#include "behaviortree_cpp_v3/loggers/bt_file_logger.h"
#include "behaviortree_cpp_v3/bt_factory.h"



#include <iostream>

using namespace std;
using namespace BT;







static const char* xml_text = R"(
<root main_tree_to_execute = "MainTree">
    <!--------------------------------------->
    <BehaviorTree ID="DoorClosed">
        <Sequence name="door_closed_sequence">
            <Inverter>
                <Condition ID="IsDoorOpen"/>
            </Inverter>
            <RetryUntilSuccesful num_attempts="4">
                <OpenDoor/>
            </RetryUntilSuccesful>
            <PassThroughDoor/>
        </Sequence>
    </BehaviorTree>
    <!--------------------------------------->
    <BehaviorTree ID="MainTree">
        <Sequence>
            <Fallback name="root_Fallback">
                <Sequence name="door_open_sequence">
                    <IsDoorOpen/>
                    <PassThroughDoor/>
                </Sequence>
                <SubTree ID="DoorClosed"/>
                <PassThroughWindow/>
            </Fallback>
            <CloseDoor/>
        </Sequence>
    </BehaviorTree>
    <!---------------------------------------> 
</root>
 )";





NodeStatus DummyFunction(void) {
    return NodeStatus::SUCCESS;
}





void register_functions(BehaviorTreeFactory& factory) {
    factory.registerSimpleCondition("IsDoorOpen", std::bind(DummyFunction));
    factory.registerSimpleAction("PassThroughDoor", std::bind(DummyFunction));
    factory.registerSimpleAction("PassThroughWindow", std::bind(DummyFunction));
    factory.registerSimpleAction("OpenDoor", std::bind(DummyFunction));
    factory.registerSimpleAction("CloseDoor", std::bind(DummyFunction));
    factory.registerSimpleCondition("IsDoorLocked", std::bind(DummyFunction));
    factory.registerSimpleAction("UnlockDoor", std::bind(DummyFunction));
}


// dumps xml nodes before they have an id
// void dump_nodes(BehaviorTreeFactory& factory) {
//     auto map = factory.manifests();

//     for (auto i : map) {
//         std::cout << i.first << "   " << i.second.registration_ID  
//              << std::endl; 
//     }
// }


std::vector<std::string> node_names;
std::vector<uint32_t> node_ids;

void save_node_ids(const Tree &tree) {
    size_t i = 0;
    for( const auto& n : tree.nodes ) {
//         cout << n->registrationName() << "->" << n->UID() << "\n";
        node_names[i] = n->registrationName();
        node_ids[i] = n->UID();
        i++;
    }
}

extern "C" {

uint32_t get_saved_node_count(void) {
    return (uint32_t)node_ids.size();
}

const char* get_saved_node_name(const uint32_t i) {
    return node_names[i].c_str();
}

uint32_t get_saved_node_id(const uint32_t i) {
    return node_ids[i];
}



}


void dump_tree_nodes(const Tree &tree) {
    for( const auto& n : tree.nodes ) {
        cout << n->registrationName() << "->" << n->UID() << "\n";
    }
}

#include <fstream>
#include <deque>
#include <array>

#include "behaviortree_cpp_v3/loggers/abstract_logger.h"
#include "behaviortree_cpp_v3/flatbuffers/bt_flatbuffer_helper.h"


typedef void testExternalJSMethod(const unsigned char* const data, const size_t sz);


static testExternalJSMethod* gptr = 0;

extern "C" {

void passFnPointer(int ptr) {
    gptr = (testExternalJSMethod*)ptr;
    // ((testExternalJSMethod*)ptr)();
}


void callBoundJs(void) {
    unsigned char buf[8];
    buf[0] = 'a';
    buf[1] = 'b';
    buf[2] = 'c';
    buf[3] = '\0';
    gptr(buf, 4);
}

} // extern



void mywrite(const unsigned char* const data, const size_t sz) {
    for(size_t i = 0; i < sz; i++) {
        cout << (unsigned)data[i];
    }
    cout << "\n";
}



void my_dump(const Tree &tree) {
    // enableTransitionToIdle(true);

    flatbuffers::FlatBufferBuilder builder(1024);
    CreateFlatbuffersBehaviorTree(builder, tree);

    // //-------------------------------------

    // file_os_.open(filename, std::ofstream::binary | std::ofstream::out);

    // // serialize the length of the buffer in the first 4 bytes
    unsigned char size_buff[4];
    flatbuffers::WriteScalar(size_buff, static_cast<int32_t>(builder.GetSize()));

    mywrite(size_buff, 4);
    mywrite(reinterpret_cast<const unsigned char*>(builder.GetBufferPointer()), builder.GetSize());

    // file_os_.write(size_buff, 4);
    // file_os_.write(reinterpret_cast<const char*>(builder.GetBufferPointer()), builder.GetSize());
}


extern "C" {

void debug_example(void) {
    cout << "debug_example()\n";

    BT::BehaviorTreeFactory factory;

    cout << "-------- register --------\n";

    register_functions(factory);

    // dump_nodes(factory);

    cout << "-------- createTreeFromText --------\n";

    // Important: when the object tree goes out of scope, all the TreeNodes are destroyed
    auto tree = factory.createTreeFromText(xml_text);

    dump_tree_nodes(tree);
    save_node_ids(tree);

    // JSFlatLogger logger_file(tree, "bt_trace.fbl");

    my_dump(tree);
}


}
