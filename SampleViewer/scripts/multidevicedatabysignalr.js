﻿$(document).ready(function () {
    var deviceData = {};
    var startTime = new Date();

    function createGraphBase(xDataBuf, yDataBuf, yAxisLabel, graphColor,bgColor, docElement ) {
        var dataGroup = {
            labels: xDataBuf,
            datasets: [
                {
                    fill: false,
                    label: 'Environment',
                    yAxisID: yAxisLabel,
                    borderColor: graphColor,
                    pointBoarderColor: graphColor,
                    backgroundColor: bgColor,
                    pointHoverBackgroundColor: graphColor,
                    pointHoverBorderColor: graphColor,
                    data: yDataBuf
                }
            ]
        };
        var basicOption = {
            title: {
                display: true,
                text: 'Real-time Data - ' + yAxisLabel,
                fontSize: 24
            },
            scales: {
                yAxes: [{
                    id: yAxisLabel,
                    type: 'linear',
                    scaleLabel: {
                        labelString: yAxisLabel,
                        display: true
                    },
                    position: 'left',
                }]
            }
        };
        var lineChart = new Chart(docElement, {
            type: 'line',
            data: dataGroup,
            options: basicOption
        });

        return lineChart;
    }


    function addGraphPart(tableElem, deviceId) {
        var timeData = [],
            tempData = [],
            presData=[],
            humData = [];

        var titleRowElem = tableElem.insertRow(-1);
        var titleCellElem = titleRowElem.insertCell(-1);
        titleCellElem.setAttribute("colSpan", "3");
        titleCellElem.appendChild(document.createTextNode(deviceId));

        var rowElem = tableElem.insertRow(-1);
        var tempElem = rowElem.insertCell(-1);
        var humElem = rowElem.insertCell(-1);
        var presElem = rowElem.insertCell(-1);
        var ctxTemp = tempElem.appendChild(document.createElement("canvas"));
        var ctxHum = humElem.appendChild(document.createElement("canvas"));
        var ctxPres = presElem.appendChild(document.createElement("canvas"));

        var optionsNoAnimation = { animation: false };

        var tempLineChart = createGraphBase(timeData, tempData, 'Temperature', "rgba(200, 2, 2, 1)", "rgba(240, 50, 50, 0.4)", ctxTemp);
        var humLineChart = createGraphBase(timeData, humData, 'Humidity', "rgba(2, 2, 200, 1)", "rgba(50, 50, 240, 0.4)", ctxHum);
        var presLineChart = createGraphBase(timeData, presData, 'Pressure', "rgba(2, 200, 2, 1)", "rgba(50, 240, 50, 0.4)", ctxPres);

        deviceData[deviceId] = {
            "time": timeData,
            "temperature": tempData, "humidity": humData, "pressure": presData,
            "tempChart": tempLineChart, "humChart": humLineChart, "presChart": presLineChart
        };
    }

    const apiBaseUrl = "https://egsignalrservicehub20190620.azurewebsites.net";
    let data = { ready: false };
    textArrivedElem = document.getElementById("textArrived");
    textMessageElem = document.getElementById("textMessage");

    getConnectionInfo().then(function (info) {
        let accessToken = info.accessToken;

        const options = {
            accessTokenFactory: function () {
                if (accessToken) {
                    const _accessToken = accessToken;
                    accessToken = null;
                    return _accessToken;
                } else {
                    return getConnectionInfo().then(function (info) {
                        return info.accessToken;
                    });
                }
            }
        };

        var graphTable = document.getElementById("graphTable");
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(info.url, options)
            .configureLogging(signalR.LogLevel.Information)
            .build();

        connection.on("SendData", function (obj) {
            var recieved = JSON.parse(obj);
            arrived = recieved.arrived;
            message = recieved.message;
            console.log('time:' + arrived + ',message:' + JSON.stringify(message));
            textArrivedElem.innerHTML = arrived;
            textMessageElem.innerHTML = JSON.stringify(message);

            if (!message.measured_time || !message.deviceid || !message.temperature || !message.humidity || !message.pressure) {
                return;
            }
            var mt = message.measured_time.split('T');
            var sendTime = Date.parse(mt[0] + ' ' + mt[1]);
            var tickFromStart = sendTime - startTime.getTime();
            tickFromStart /= 1000;
            if (!deviceData[message.deviceid]) {
                addGraphPart(graphTable, message.deviceid);
            }
            deviceData[message.deviceid]["time"].push(Math.round(tickFromStart));
            deviceData[message.deviceid]["temperature"].push(message.temperature);
            deviceData[message.deviceid]["humidity"].push(message.humidity);
            deviceData[message.deviceid]["pressure"].push(message.pressure);

            // only keep no more than 50 points in the line chart
            var len = deviceData[message.deviceid]["time"].length;
            if (len > 200) {
                deviceData[message.deviceid]["time"].shift();
                deviceData[message.deviceid]["temperature"].shift();
                deviceData[message.deviceid]["humidity"].shift();
                deviceData[message.deviceid]["pressure"].shift();
            }

            deviceData[message.deviceid]["tempChart"].update();
            deviceData[message.deviceid]["humChart"].update();
            deviceData[message.deviceid]["presChart"].update();
        });


        connection.onclose(function () {
            console.log('disconnected');
            setTimeout(function () { startConnection(connection); }, 2000);
        });

        console.log('connecting...');
        connection.start().then(() => data.ready = true)
            .catch(console.error);
    });

    function getConnectionInfo() {
        return $.post({
            url: `${apiBaseUrl}/api/SignalRInfo`,
            data: {}
        }).done(function (resp, textStatus, jqXHR) {
            return resp.data;
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        });
    }
});