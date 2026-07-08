import {
    OPCUAClient,
    MessageSecurityMode,
    SecurityPolicy,
    AttributeIds
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
        securityMode: MessageSecurityMode.None,
        securityPolicy: SecurityPolicy.None,
        endpointMustExist: false
    });

    try {

        await client.connect("opc.tcp://192.168.0.1:4840");

        console.log("Connected");

        const session = await client.createSession();

        console.log("Session created");

        console.log("\nBrowsing PLC...\n");

        //await browseNode(session, "ns=3;s=PLC");
        console.log("\nBrowsing PLC...\n");

        await browseNode(session, "ns=3;s=DataBlocksGlobal");

        const dv = await session.read({
            nodeId: 'ns=3;i=5202',
            attributeId: AttributeIds.Value
        });

        console.log(dv.value.value);

        await session.close();

        await client.disconnect();

    }
    catch (err) {
        console.log(err);
    }

})();
