// This is a .hpp file that defines a few static vars used for testing
// This is not a normal .hpp file that can be included anywhere

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
