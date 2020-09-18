#include "wrapper.hpp"

#include "behaviortree_cpp_v3/loggers/bt_cout_logger.h"
#include "behaviortree_cpp_v3/loggers/bt_minitrace_logger.h"
#include "behaviortree_cpp_v3/loggers/bt_file_logger.h"
#include "behaviortree_cpp_v3/bt_factory.h"
#include "behaviortree_cpp_v3/basic_types.h"
#include "behaviortree_cpp_v3/loggers/abstract_logger.h"
#include "behaviortree_cpp_v3/flatbuffers/bt_flatbuffer_helper.h"


#include <fstream>
#include <deque>
#include <array>
#include <iostream>


using namespace std;
using namespace BT;


#ifdef INCLUDE_TEST_CODE_FUNCTIONS

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


static const char* xml_text2 = R"(
<?xml version="1.0"?>
<root main_tree_to_execute="MainTree">
    <!-- ////////// -->
    <BehaviorTree ID="DoorClosed">
        <Sequence name="door_closed_sequence">
            <Inverter>
                <Condition ID="IsDoorOpen"/>
            </Inverter>
            <RetryUntilSuccesful num_attempts="4">
                <Action ID="OpenDoor"/>
            </RetryUntilSuccesful>
            <Action ID="PassThroughDoor"/>
        </Sequence>
    </BehaviorTree>
    <!-- ////////// -->
    <BehaviorTree ID="MainTree">
        <Sequence>
            <Sequence>
                <Fallback name="root_Fallback">
                    <Sequence name="door_open_sequence">
                        <Condition ID="IsDoorOpen"/>
                        <Action ID="PassThroughDoor"/>
                    </Sequence>
                    <SubTree ID="DoorClosed"/>
                    <Action ID="PassThroughWindow"/>
                </Fallback>
                <Action ID="CloseDoor"/>
            </Sequence>
        </Sequence>
    </BehaviorTree>
    <!-- ////////// -->
    <TreeNodesModel>
        <Action ID="CloseDoor"/>
        <SubTree ID="DoorClosed"/>
        <Condition ID="IsDoorOpen"/>
        <Action ID="OpenDoor"/>
        <Action ID="PassThroughDoor"/>
        <Action ID="PassThroughWindow"/>
    </TreeNodesModel>
    <!-- ////////// -->
</root>

 )";

#endif


///
/// BehaviorTree library requires that a function is bound
/// before we parse the xml tree
/// This function is bound to every action and condition node
///
NodeStatus DummyFunction(void) {

    // This is just a convenient place/function to put
    // these to ignore unused variable warnings
#ifdef VERBOSE_WRAPPER
    (void)xml_text;
    (void)xml_text2;
#endif

    return NodeStatus::SUCCESS;
}



#ifdef INCLUDE_TEST_CODE_FUNCTIONS

void register_functions(BehaviorTreeFactory& factory) {
    factory.registerSimpleCondition("IsDoorOpen", std::bind(DummyFunction));
    factory.registerSimpleAction("PassThroughDoor", std::bind(DummyFunction));
    factory.registerSimpleAction("PassThroughWindow", std::bind(DummyFunction));
    factory.registerSimpleAction("OpenDoor", std::bind(DummyFunction));
    factory.registerSimpleAction("CloseDoor", std::bind(DummyFunction));
    factory.registerSimpleCondition("IsDoorLocked", std::bind(DummyFunction));
    factory.registerSimpleAction("UnlockDoor", std::bind(DummyFunction));
}

#endif

// dumps xml nodes before they have an id
// void dump_nodes(BehaviorTreeFactory& factory) {
//     auto map = factory.manifests();

//     for (auto i : map) {
//         std::cout << i.first << "   " << i.second.registration_ID  
//              << std::endl; 
//     }
// }


///
/// File scope (static) vectors used for feeding information to js
/// 
static std::vector<std::string> node_names;
static std::vector<uint32_t> node_ids;
static std::vector<std::vector<uint32_t>> children_ids;

/// Factory
static BT::BehaviorTreeFactory factory;

/// Used in timing
static std::chrono::steady_clock::time_point parse_time;

/// Saves tree node names, ids, and children to
/// the static vectors
void save_node_ids(const Tree &tree) {
    // size_t i = 0;

    node_names.resize(0);
    node_ids.resize(0);
    children_ids.resize(0);
    for( const auto& n : tree.nodes ) {
//         cout << n->registrationName() << "->" << n->UID() << "\n";
        node_names.push_back(n->registrationName());
        node_ids.push_back(n->UID());
        // i++;
    }

    children_ids.resize(node_ids.size());


    auto visitor = [](BT::TreeNode * node) {
#ifdef VERBOSE_WRAPPER
        cout << "Node " << node->registrationName() << " has children: ";
#endif

        const uint32_t id = (uint32_t) node->UID();


        if (auto control = dynamic_cast<const BT::ControlNode*>(node))
        {
            for (const auto& child : control->children())
            {
                auto cc = static_cast<const TreeNode*>(child);

#ifdef VERBOSE_WRAPPER
                cout << " " << cc->registrationName();
#endif
                children_ids[id].push_back(cc->UID());

                // applyRecursiveVisitor(static_cast<const TreeNode*>(child), visitor);
            }
        }
       else if (auto decorator = dynamic_cast<const BT::DecoratorNode*>(node))
        {
            auto cc = decorator->child();

#ifdef VERBOSE_WRAPPER
            cout << " " << cc->registrationName();
#endif

            children_ids[id].push_back(cc->UID());
            // applyRecursiveVisitor(, visitor);
        }

#ifdef VERBOSE_WRAPPER
        cout << "\n";
#endif

    };
    BT::applyRecursiveVisitor(tree.rootNode(), visitor);

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

uint32_t get_child_node_count(const uint32_t i) {
    return children_ids[i].size();
}

uint32_t get_child_node_id(const uint32_t i, const uint32_t j) {
    return children_ids[i][j];
}


}




typedef void testExternalJSMethod(const unsigned char* const data, const size_t sz);


static testExternalJSMethod* gptr = 0;

extern "C" {

void pass_write_fn(int ptr) {
    gptr = (testExternalJSMethod*)ptr;
}


#ifdef VERBOSE_WRAPPER
void callBoundJs(void) {
    unsigned char buf[8];
    buf[0] = 'a';
    buf[1] = 'b';
    buf[2] = 'c';
    buf[3] = '\0';
    gptr(buf, 4);
}
#endif


} // extern



void myPrintWrite(const unsigned char* const data, const size_t sz) {
    for(size_t i = 0; i < sz; i++) {
        cout << (unsigned)data[i];
    }
    cout << "\n";
}

void writeToJs(const unsigned char* const data, const size_t sz) {
    if( gptr == 0 ) {
        cout << "writeToJs() called when gptr was null, dropping these bytes:\n";
        myPrintWrite(data, sz);
        return;
    }

    gptr(data, sz);
}



void write_tree_header_to_js(const Tree &tree) {
    // enableTransitionToIdle(true);

    flatbuffers::FlatBufferBuilder builder(1024);
    CreateFlatbuffersBehaviorTree(builder, tree);

    // //-------------------------------------

    // file_os_.open(filename, std::ofstream::binary | std::ofstream::out);

    // // serialize the length of the buffer in the first 4 bytes
    unsigned char size_buff[4];
    flatbuffers::WriteScalar(size_buff, static_cast<int32_t>(builder.GetSize()));

    // myPrintWrite(size_buff, 4);
    // myPrintWrite(reinterpret_cast<const unsigned char*>(builder.GetBufferPointer()), builder.GetSize());

    writeToJs(size_buff, 4);
    writeToJs(reinterpret_cast<const unsigned char*>(builder.GetBufferPointer()), builder.GetSize());

    // file_os_.write(size_buff, 4);
    // file_os_.write(reinterpret_cast<const char*>(builder.GetBufferPointer()), builder.GetSize());
}




extern "C" {


void lt(const int uid, const int prev_status, const int status) {
    const auto now = std::chrono::high_resolution_clock::now();
    const auto duration = now-parse_time;

    SerializedTransition buffer =
        SerializeTransition(uid, duration, (NodeStatus)prev_status, (NodeStatus)status);
    
    writeToJs(reinterpret_cast<const unsigned char*>(buffer.data()), buffer.size());
}


#ifdef VERBOSE_WRAPPER

void dump_tree_nodes(const Tree &tree) {
    for( const auto& n : tree.nodes ) {
        cout << n->registrationName() << "->" << n->UID() << "\n";
    }
}

void debug_example(void) {
    parse_time = std::chrono::steady_clock::now();
    cout << "debug_example()\n";

    

    cout << "-------- register --------\n";

    register_functions(factory);

    // dump_nodes(factory);

    cout << "-------- createTreeFromText --------\n";

    // Important: when the object tree goes out of scope, all the TreeNodes are destroyed
    auto tree = factory.createTreeFromText(xml_text);
    // auto tree = factory.createTreeFromText(xml_text2);

    dump_tree_nodes(tree);
    save_node_ids(tree);

    // JSFlatLogger logger_file(tree, "bt_trace.fbl");

    write_tree_header_to_js(tree);
}

#endif



// pass an action or condition node name
void unregister_builder(const char* name) {
    factory.unregisterBuilder(name);
}

void register_action_node(const char* name) {
    factory.registerSimpleAction(name, std::bind(DummyFunction));
}

void register_condition_node(const char* name) {
    factory.registerSimpleCondition(name, std::bind(DummyFunction));
}

///
/// Main entry point
///
void parse_xml(const char* xml) {
    parse_time = std::chrono::steady_clock::now();

    // parse BehaviorTree
    auto tree = factory.createTreeFromText(xml);

    // pull out the node IDS into the vectors in this file
    save_node_ids(tree);

    // write to the js callback with byte data for the log header
    write_tree_header_to_js(tree);
}

}
