/*
  useEffect(() => {
    /* if (isSocketConnected) {
       setIsLoading(false);
       return;
     };*/
/*let mysocket = io("ws://192.168.1.230:8500");
socketRef.current = mysocket;
mysocket.on("connect", () => {
  console.log("Connected to server", mysocket.id, ' timestamp', new Date().toLocaleTimeString());
  setSocket(mysocket);
  setIsSocketConnected(true);*/
//if (socketRef.current) console.log('reference attached')
//socketRef.current = mysocket;
//let count = 0;
// mysocket.on("refresh", (data) => {
// --- begin dummy

// --- end dummy
//socket.emit("page", { clientId: socket.id, page: page });

/*mysocket.on("data-exchange", (data) => {
  database = { ...database, ...data };
})*/
/*
    });
*/


//mysocket.on("data-exchange", (data) => {
//DBRef.current[data.deviceID].buffer.set(data.buff, data.startFrom);
//modify DBRef.current[data.deviceID].buffer with data in range [data.startFrom, data.startFrom + data.length]
//const uint16buff = new Uint16Array(data.buff);
//console.log(uint16buff)
//for (let i = 0; i < data.length; i++) {
// convert databuf into UINT16
//DBRef.current[data.deviceID[1]].buffer[i + data.startFrom] = uint16buff[i];
//}
//console.log(data.deviceID[1], ':', DBRef.current)
//console.log(data);
//console.log("data recieved successfully");
//if (refreshingCbk.current) {
//refreshingCbk.current();
//}
//, [])



/* mysocket.on("disconnect", () => {
   console.log("Disconnected from server");
 });



 return () => {
   if (isSocketConnected) mysocket.disconnect();
 };

}, [page, isSocketConnected]);*/