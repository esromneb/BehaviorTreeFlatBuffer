#include "wrapper.hpp"

#include "debug_data.hpp"

#include "behaviortree_cpp_v3/flatbuffers/bt_flatbuffer_helper.h"

#include <vector>
#include <map>
#include <iostream>
#include <algorithm> // for max

using namespace std;
using namespace BT;





///
/// File scope (static) vectors used for feeding information to js
/// 
static std::vector<std::string> node_names;
static std::vector<uint16_t> node_ids;
static std::map<uint16_t,std::vector<uint16_t>> children_ids;

/// Factory
static BT::BehaviorTreeFactory* factory = 0;

/// Used in timing
static std::chrono::steady_clock::time_point parse_time;

/// Typedef used as part of c->js call
typedef void testExternalJSMethod(const unsigned char* const data, const size_t sz);

/// function pointer for c->js
static testExternalJSMethod* gptr = 0;

/// largest uid
static uint16_t largestUid = 0;

/// another patched variable
/// so I can produce consistent outputs
/// this global value (See lib/BehaviorTree.CPP/src/tree_node.cpp)
/// tree node id's are now set using this variable (after patch is applied)
extern uint16_t btfb_g_uid;




///
/// BehaviorTree library requires that a function is bound
/// before we parse the xml tree
/// This function is bound to every action and condition node
///
NodeStatus DummyFunction(void) {

    // This is just a convenient place/function to put
    // these to ignore unused variable warnings
    // see debug_data.hpp
#ifdef INCLUDE_TEST_CODE_FUNCTIONS
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

extern "C" {

void reset_trackers(void) {
    node_names.resize(0);
    node_ids.resize(0);
    children_ids.clear();
    largestUid = 0;
    btfb_g_uid = 1;
}

}

/// Saves tree node names, ids, and children to
/// the static vectors
void save_node_ids(const Tree &tree) {
    // size_t i = 0;

    reset_trackers();

    for( const auto& n : tree.nodes ) {
//         cout << n->registrationName() << "->" << n->UID() << "\n";
        node_names.push_back(n->registrationName());

        const auto uid = n->UID();

        node_ids.push_back(uid);
        largestUid = std::max(largestUid, uid);

        // this makes sure that children_ids
        // has an (empty) vector for every single
        // uid
        // we can use this as a quick way in
        // logTransition to tell if a uid is valid
        if( children_ids.count(uid) == 0 ) {
            children_ids[uid] = {};
        }
    }


    auto visitor = [](BT::TreeNode * node) {
        const uint32_t id = (uint32_t) node->UID();


#ifdef VERBOSE_WRAPPER
        cout << "Node (" << id << ") " << node->registrationName() << " has children: ";
#endif



        if (auto control = dynamic_cast<const BT::ControlNode*>(node))
        {
            for (const auto& child : control->children())
            {
                auto cc = static_cast<const TreeNode*>(child);

#ifdef VERBOSE_WRAPPER
                cout << " " << cc->registrationName();
#endif

                if( children_ids.count(id) == 0 ) {
                    children_ids[id] = {};
                }
                children_ids[id].push_back(cc->UID());
            }
        }
       else if (auto decorator = dynamic_cast<const BT::DecoratorNode*>(node))
        {
            auto cc = decorator->child();

#ifdef VERBOSE_WRAPPER
            cout << " " << cc->registrationName();
#endif

            if( children_ids.count(id) == 0 ) {
                children_ids[id] = {};
            }
            children_ids[id].push_back(cc->UID());
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

void pass_write_fn(int ptr) {
    gptr = (testExternalJSMethod*)ptr;
}

bool write_fn_is_set(void) {
    return gptr != 0;
}


#ifdef INCLUDE_TEST_CODE_FUNCTIONS
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
    if( !write_fn_is_set() ) {
        cout << "writeToJs() called when gptr was null (pass_write_fn() was not called), dropping these bytes:\n";
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


    const auto sz = static_cast<int32_t>(builder.GetSize());

    // cout << "write_tree_header_to_js: sz: " << sz << "\n";

    // file_os_.open(filename, std::ofstream::binary | std::ofstream::out);

    // // serialize the length of the buffer in the first 4 bytes
    unsigned char size_buff[4];
    flatbuffers::WriteScalar(size_buff, sz);

    // for(int i = 0; i < 4; i++) {
    //     cout << "    " << i << ": " << (int)size_buff[i] << "\n";
    // }

    // myPrintWrite(size_buff, 4);
    // myPrintWrite(reinterpret_cast<const unsigned char*>(builder.GetBufferPointer()), builder.GetSize());

    writeToJs(size_buff, 4);
    writeToJs(reinterpret_cast<const unsigned char*>(builder.GetBufferPointer()), sz);

    // file_os_.write(size_buff, 4);
    // file_os_.write(reinterpret_cast<const char*>(builder.GetBufferPointer()), builder.GetSize());
}




extern "C" {

// returns 0 for success
// log transition
int lt(const int uid, const int prev_status, const int status) {
    // grab now asap
    const auto now = std::chrono::high_resolution_clock::now();

    // verify if this is a valid uid
    if( children_ids.count(uid) == 0 ) {
        cout << "Error: UID " << uid << " is not valid\n";
        return 1;
    }

    const auto duration = now-parse_time;

    SerializedTransition buffer =
        SerializeTransition(uid, duration, (NodeStatus)prev_status, (NodeStatus)status);
    
    writeToJs(reinterpret_cast<const unsigned char*>(buffer.data()), buffer.size());
    return 0;
}

// returns 0 for success
// log transition duration
int ltd(const int uid, const int prev_status, const int status, const int duration_ms) {
    // grab now asap
    // const auto now = std::chrono::high_resolution_clock::now();


    // such a pain in the as to make a duration type
    // I got lucky and got the full descripton of the type in a compiler error
    std::chrono::milliseconds as_ms{duration_ms}; 
    std::chrono::duration<long int, std::ratio<1l, 1000000000l>> duration = as_ms;

    // verify if this is a valid uid
    if( children_ids.count(uid) == 0 ) {
        cout << "Error: UID " << uid << " is not valid\n";
        return 1;
    }

    // const auto duration = now-parse_time;

    SerializedTransition buffer =
        SerializeTransition(uid, duration, (NodeStatus)prev_status, (NodeStatus)status);
    
    writeToJs(reinterpret_cast<const unsigned char*>(buffer.data()), buffer.size());
    return 0;
}


#ifdef INCLUDE_TEST_CODE_FUNCTIONS

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
    factory->unregisterBuilder(name);
}

void register_action_node(const char* name) {
    factory->registerSimpleAction(name, std::bind(DummyFunction));
}

void register_condition_node(const char* name) {
    factory->registerSimpleCondition(name, std::bind(DummyFunction));
}

void reset_factory(void) {

    if( factory != 0 ) {
        delete factory;
        factory = 0;
    }

    factory = new BehaviorTreeFactory();
}

void reset_all(void) {
    try {
        reset_trackers();
        reset_factory();
    } catch (exception e) {
        cout << "Exception(reset_all): " << e.what() << "\n";
    }

}


///
/// Main entry point
/// returns non 0 for error, 1 for success
int parse_xml(const char* xml) {

    // move early as possible
    parse_time = std::chrono::steady_clock::now();

    if( xml == 0 ) {
        cout << "parse_xml() called with null string\n";
        return 1;
    }

    // a conservative minimum limit of an xml file
    // <rootmain_tree_to_execute?=""></root>
    // 

    const int minlen = 36; // xml less than this is clearly busted

    const int slen = strlen(xml);

    if( slen < minlen ) {
        cout << "parse_xml() called with too short string (" << slen << "<" << minlen << ") \n";
        return 2;
    }




    Tree tree;
    try {
        // parse BehaviorTree
        tree = factory->createTreeFromText(xml);
    } catch (BehaviorTreeException e) {
        cout << "Exception(3): " << e.what() << "\n";
        return 3;
    }

    if( !write_fn_is_set() ) {
        cout << "parse_xml() was called without the javascript callback being set first via pass_write_fn()\n";
        return 4;
    }

    try {

        // pull out the node IDS into the vectors in this file
        save_node_ids(tree);

        // write to the js callback with byte data for the log header
        write_tree_header_to_js(tree);

    } catch (exception e) {
        cout << "Exception(5): " << e.what() << "\n";
        return 5;
    }

    return 0;
}


} // extern c
