$(document).ready(function() {
    const apiBaseUrl = "https://egsignalrservicehub20190620.azurewebsites.net/";
    let data = { ready: false };
    textArrivedElem = document.getElementById("textArrived");
    textMessageElem = document.getElementById("textMessage");

    var receiveddata={};
    var deviceEntries ={};

    var receivedTable = document.getElementById("receiveddevices");
    var receivedTableNumOfCells = receivedTable.rows[0].cells.length;
    var receivedTableNumOfRows = receivedTable.rows.length;

    function createDeviceEntry(deviceid){
        var rows=[];
        var newCell = document.createElement("table");
        for(i=0;i<4;i++) {
            rows.push(newCell.insertRow(-1));
            var cell = rows[i].insertCell(-1);
            cell.appendChild(document.createTextNode(""));
        }
        rows[0].cells[0].firstChild.data = deviceid;
        return newCell;
    }

    function updateDeviceEntry(message){
        var targetCell=receiveddata[message.deviceid];
        targetCell.rows[1].cells[0].firstChild.data = message.epoctime;
        targetCell.rows[2].cells[0].firstChild.data = message.sensor;
        targetCell.rows[3].cells[0].firstChild.data = message.valuef;
    }

    getConnectionInfo().then(function(info) {
        let accessToken = info.accessToken;

        const options = {
            accessTokenFactory: function() {
                if (accessToken) {
                    const _accessToken = accessToken;
                    accessToken = null;
                    return _accessToken;
                } else {
                    return getConnectionInfo().then(function(info) {
                        return info.accessToken;
                    });
                }
            }
        };

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(info.url, options)
            .configureLogging(signalR.LogLevel.Information)
            .build();

        connection.on("SendData", function(obj) {
            var currenttime = new Date();
            var arrived = currenttime.getFullYear() + '/' + currenttime.getMonth() + '/' + currenttime.getDay() + '-'+currenttime.getHours()+':'+currenttime.getMinutes()+':'+currenttime.getSeconds();
            var recieved = JSON.parse(obj);
            var message = recieved;
            console.log('message:' + JSON.stringify(recieved));
            textArrivedElem.innerHTML = arrived;
            textMessageElem.innerHTML = JSON.stringify(recieved);

            if (!message.epoctime || !message.deviceid || !message.sensor) {
                return;
            }
            if (!receiveddata[message.deviceid]){
                receiveddata[message.deviceid] = createDeviceEntry(message.deviceid);
                var numOfDevice = Object.keys(receiveddata).length;
                if ((Object.keys(receiveddata).length%receivedTableNumOfCells)===0) {
                    receivedTable.insertRow(-1);
                    for(i=0;i<receivedTableNumOfCells;i++){
                        receivedTable.rows[receivedTableNumOfRows].insertCell(-1);
                    }
                    receivedTableNumOfRows++;
                }
                var indexRow = Math.floor((Object.keys(receiveddata).length-1)/receivedTableNumOfCells);
                var indexCell = (Object.keys(receiveddata).length-1)%receivedTableNumOfCells;
                receivedTable.rows[indexRow].cells[indexCell].appendChild(receiveddata[message.deviceid]);
                deviceEntries[message.deviceid]=receiveddata[message.deviceid];
            }
          //  receiveddata[message.deviceid] ={'epoctime':message.epoctime,'sensor-name':message.sensor,'sensor-value':message.valuef};
            updateDeviceEntry(message);
        });


        connection.onclose(function() {
            console.log('disconnected');
            setTimeout(function() { startConnection(connection); }, 2000);
        });

        console.log('connecting...');
        connection.start().then(() => data.ready = true)
            .catch(console.error);
    });

    function getConnectionInfo() {
        return $.post({
            url: `${apiBaseUrl}/api/SignalRInfo`,
            data: {}
        }).done(function(resp, textStatus, jqXHR) {
            return resp.data;
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        });
    }
});