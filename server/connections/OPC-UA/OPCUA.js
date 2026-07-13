import {
    OPCUAClient,
    MessageSecurityMode,
    SecurityPolicy,
    AttributeIds,
    DataType,
    Variant
} from "node-opcua";


async function browseNode(session, nodeId, indent = "") {

    const result = await session.browse(nodeId);

    for (const ref of result.references) {

        /*console.log(
            indent +
            ref.browseName.toString() +
            "    " +
            ref.nodeId.toString() +
            "    " +
            ref.nodeClass.toString()
        );*/

        console.log(
            `
                Name: ${ref.browseName.toString()}
                NodeId: ${ref.nodeId.toString()}
                NodeClass: ${ref.nodeClass.toString()}
            `
        )

        // Browse children recursively
        await browseNode(session, ref.nodeId.toString(), indent + "    ");
    }
}

(async () => {

    const client = OPCUAClient.create({
        endpointMustExist: true,
    });

    try {

        await client.connect("opc.tcp://192.168.0.20:4840");



        console.log("Connected");

        const session = await client.createSession();

        console.log("Session created");

        console.log(session)

        console.log("\nBrowsing PLC...\n");

        await browseNode(session, session.sessionId);
        console.log("\nBrowsing PLC...\n");

        //await browseNode(session, "ns=3;s=DataBlocksGlobal");
        //const ns = await session.readNamespaceArray();
        //console.log(ns);        //const result = await session.browse("ns=3;s=Data_block_1");

        //const result = await session.browse('ns=3;s="Data_block_1"."Motor"[1]."Line voltage"');
        //console.dir(result.references, { depth: null });

        /*const dv = await session.read({
            nodeId: 'ns=3;s="Data_block_1"."Motor"[0]."Line voltage"',
            attributeId: AttributeIds.Value
        });

        console.log(dv.value.value);*/

        const status = await session.write({
            nodeId: 'ns=3;s="OUTPUTS"',
            attributeId: AttributeIds.Value,
            value: {
                value: new Variant({
                    dataType: DataType.Int16,
                    value: 0x7FFF
                })
            }
        });

        console.log(status); // Should print "Good"

        const stat = await session.read({
            nodeId: 'ns=3;s="INPUTS"',
            attributeId: AttributeIds.UInt32,
        })
        console.log(stat.value.value)
        //console.log(result.references);

        /*await browseNode(session, "ns=3;s=DataBlocksGlobal.Motor");

        const dv = await session.read({
            nodeId: "ns=3;s=DataBlocksGlobal.Data_block_1.Motor[1].Active power",
            attributeId: AttributeIds.Value
        });

        console.log(dv.value.value);*/
        //await browseNode(session, "ns=3;s=Memory");
        await session.close();

        await client.disconnect();

    }
    catch (err) {
        console.log(err);
    }

})();
