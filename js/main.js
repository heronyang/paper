var client;
var BROKER_URL = "broker.mqttdashboard.com";
var port = 8000;
var clientId = randomString();
var topic = "/null";

var PAPER_SIZE = 500;
var POINT_COLOR = "#000";
var POINT_SIZE = "7px";

function doConnect() {
    client = new Messaging.Client(BROKER_URL, port, clientId);
    client.onConnect = onConnect;
    client.onMessageArrived = onMessageArrived;
    client.onConnectionLost = onConnectionLost;
    client.connect({onSuccess:onConnect});
}

function doSubscribe() {
    client.subscribe(topic);
}

function doSend(msg) {
    console.log("[function]doSend");
    message = new Messaging.Message(msg);
    message.destinationName = topic;
    client.send(message);
}

function doDisconnect() {
    client.disconnect();
    console.log("[function]doDisconnect");
}

// Web Messaging API callbacks

function onConnect() {
    console.log("[function]onConnect: clientId=" + clientId + ", client.clientId=" + client.clientId);
    $("#connection_status").text("online (" + topic + ")");
    doSubscribe();
}

function onConnectionLost(responseObject) {
    console.log("[function]onConnectLost");
    $("#connection_status").text("offline");
    if (responseObject.errorCode !== 0) {
        //alert(client.clientId+"\n"+responseObject.errorCode);
        console.log("[function]error: clientId=" + client.clientId + ", errorCode=" + responseObject.errorCode);
    }
}

function onMessageArrived(message) {
    console.log("[function]onMessageArrived: " + message.payloadString);
    //$("#msg_box").text(message.payloadString);
    var decodedMsg = JSON.parse(message.payloadString);
    
    var sourceId = decodedMsg["sourceId"];
    var type = decodedMsg["type"];
    var data = decodedMsg["data"];

    if (sourceId == clientId)   return; //ignore

    console.log("sourceId = " + sourceId);
    console.log("type = " + type);
    console.log("data = " + data);

    if (type == "point") {
        drawPointAt(data["x"], data["y"]);
    }
}

$(document).ready(function(){
    //doConnect();
    newTopic();
    layoutSetup();
});

function layoutSetup() {
    $("#paper_canvas").width(PAPER_SIZE).height(PAPER_SIZE);
}

/* UI and Communication */
function publishPoint(x, y) {
    var dictPoint = {"x": x, "y": y};
    var type = "point";
    var dictMsg = {"sourceId": clientId,
                   "type": type,
                   "data": dictPoint};
    
    var msg = JSON.stringify(dictMsg);
    console.log("[publish point]: " + msg);
    doSend(msg);
}

/* UI Related */
function joinTopic(form) {
    var _topic = form.topicId.value;
    topic = _topic;
    doConnect();
}
function newTopic() {
    topic = randomString();
    doConnect();
}

/* Canvas Draw */
var isDragging = false;
$("#paper_canvas").mousedown(function() {
    isDragging = true;
});
$("body").mouseup(function() {
    isDragging = false;
});
$("body").mouseleave(function() {
    isDragging = false;
});
$("#paper_canvas").mousemove(function(e) {
    if(isDragging) {
        // do our things
        x = e.pageX;
        y = e.pageY;
        drawPointAt(x, y);
    }
});

function drawPointAt(x, y){
    console.log("[draw] (" + x + ", " + y + ")");

    publishPoint(x, y);

    var color = POINT_COLOR;
    var size = POINT_SIZE;
    $("body").append(
        $('<div></div>')
        .css('position', 'absolute')
        .css('top', y + 'px')
        .css('left', x + 'px')
        .css('width', size)
        .css('height', size)
        .css('background-color', color)
    );
}

/* Tools */
function randomString() {
    return ("0000+" + (Math.random()*Math.pow(36,5) << 0).toString(36)).substr(-5)
}
