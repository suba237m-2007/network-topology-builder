let devices = [];
let connections = [];

let selectedDevice = null;
let firstDevice = null;
let connectMode = false;


/* =========================
   GET HTML ELEMENTS
========================= */

const network = document.getElementById("network");

const addPC = document.getElementById("addPC");
const addRouter = document.getElementById("addRouter");
const addSwitch = document.getElementById("addSwitch");
const addServer = document.getElementById("addServer");

const connectBtn = document.getElementById("connectBtn");
const sendPacketBtn = document.getElementById("sendPacketBtn");
const deleteBtn = document.getElementById("deleteBtn");
const clearBtn = document.getElementById("clearBtn");

const deviceCount = document.getElementById("deviceCount");
const connectionCount = document.getElementById("connectionCount");
const status = document.getElementById("status");
const activityLog = document.getElementById("activityLog");
/* =========================
   NETWORK ACTIVITY
========================= */

function addActivity(message) {

    const activity = document.createElement("p");

    activity.innerText = message;

    activityLog.prepend(activity);

}


/* =========================
   ADD DEVICE
========================= */

function addDevice(type, icon) {

    // Remove welcome message
    const welcome = document.querySelector(".welcome");

    if (welcome) {
        welcome.style.display = "none";
    }


    // Create device
    const device = document.createElement("div");

    device.className = "network-device";


    // Generate IP address
const ipAddress = "192.168.1." + (10 + devices.length);

device.innerHTML = `
    <div class="device-icon">${icon}</div>
    <div class="device-name">${type}</div>
    <div class="device-ip">IP: ${ipAddress}</div>
`;


    // Random position
    const x = Math.floor(Math.random() * 700) + 50;
    const y = Math.floor(Math.random() * 300) + 50;


    let positions = [
    { left: 100, top: 100 },
    { left: 400, top: 100 },
    { left: 700, top: 100 },
    { left: 250, top: 300 },
    { left: 550, top: 300 },
    { left: 850, top: 300 }
];

let position = positions[devices.length % positions.length];

device.style.left = position.left + "px";
device.style.top = position.top + "px";


    // Add to network
    network.appendChild(device);


    const deviceObject = {
    element: device,
    type: type,
    ip: ipAddress
};

    devices.push(deviceObject);


    // Device click
    device.addEventListener("click", function(event) {

        event.stopPropagation();

        if (connectMode) {

            connectDevice(deviceObject);

        } else {

            selectDevice(deviceObject);

        }

    });


    updateDeviceCount();

    status.innerText = type + " added successfully";
    addActivity("✓ " + type + " added to network");
}


function selectDevice(device) {

    devices.forEach(function(d) {

        d.element.classList.remove("selected");

    });

    device.element.classList.add("selected");

    selectedDevice = device;

    status.innerText =
        device.type +
        " selected | IP: " +
        device.ip;

    addActivity(
        "🔍 " +
        device.type +
        " selected | IP: " +
        device.ip
    );
}


function connectDevice(device) {

    if (firstDevice === null) {

        firstDevice = device;

        device.element.classList.add("selected");

        status.innerText =
            "Now select another device";

    } else {

        if (firstDevice === device) {

            status.innerText =
                "Select a different device";

            return;
        }

        // Save device names BEFORE firstDevice becomes null
        const device1Name = firstDevice.type;
        const device2Name = device.type;

        // Create connection
        createConnection(
            firstDevice,
            device
        );

        firstDevice.element.classList.remove("selected");

        firstDevice = null;

        connectMode = false;

        connectBtn.innerText =
            "🔗 Connect";

        status.innerText =
            "Devices connected successfully";

        // Add activity message
        addActivity(
            "🔗 " + device1Name +
            " connected to " + device2Name
        );
    }
}

/* =========================
   CREATE CONNECTION
========================= */

function createConnection(device1, device2) {

    const line = document.createElement("div");

    line.className = "connection-line";


    network.appendChild(line);
    addActivity("📦 Packet transmission started");


    connections.push({

        from: device1,

        to: device2,

        element: line

    });


    drawConnection(
        line,
        device1.element,
        device2.element
    );


    updateConnectionCount();

}


function drawConnection(line, device1, device2) {

    const networkRect = network.getBoundingClientRect();
    const device1Rect = device1.getBoundingClientRect();
    const device2Rect = device2.getBoundingClientRect();

    const x1 =
        device1Rect.left - networkRect.left +
        device1Rect.width / 2;

    const y1 =
        device1Rect.top - networkRect.top +
        device1Rect.height / 2;

    const x2 =
        device2Rect.left - networkRect.left +
        device2Rect.width / 2;

    const y2 =
        device2Rect.top - networkRect.top +
        device2Rect.height / 2;

    const distance = Math.sqrt(
        Math.pow(x2 - x1, 2) +
        Math.pow(y2 - y1, 2)
    );

    const angle =
        Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    line.style.width = distance + "px";
    line.style.left = x1 + "px";
    line.style.top = y1 + "px";
    line.style.transform = `rotate(${angle}deg)`;
}


/* =========================
   CONNECT BUTTON
========================= */

connectBtn.addEventListener("click", function() {

    if (devices.length < 2) {

        status.innerText =
            "Add at least 2 devices first";

        return;

    }


    connectMode = !connectMode;


    firstDevice = null;


    if (connectMode) {

        connectBtn.innerText =
            "🔗 Connecting...";

        status.innerText =
            "Select two devices to connect";

    } else {

        connectBtn.innerText =
            "🔗 Connect";

        status.innerText =
            "Connection cancelled";

    }

});


/* =========================
   SEND PACKET
========================= */

sendPacketBtn.addEventListener("click", function() {

    if (connections.length === 0) {

        status.innerText =
            "Connect two devices first";

        return;
    }

    // Get the first connection
    const connection = connections[0];

    const device1 = connection.from.element;
    const device2 = connection.to.element;

    const networkRect = network.getBoundingClientRect();

    const device1Rect = device1.getBoundingClientRect();
    const device2Rect = device2.getBoundingClientRect();

    // Starting position
    const startX =
        device1Rect.left - networkRect.left +
        device1Rect.width / 2;

    const startY =
        device1Rect.top - networkRect.top +
        device1Rect.height / 2;

    // Ending position
    const endX =
        device2Rect.left - networkRect.left +
        device2Rect.width / 2;

    const endY =
        device2Rect.top - networkRect.top +
        device2Rect.height / 2;

    // Create packet
    const packet = document.createElement("div");

    packet.className = "packet";

    packet.innerHTML = "📦";

    packet.style.position = "absolute";
    packet.style.left = startX + "px";
    packet.style.top = startY + "px";
    packet.style.fontSize = "25px";
    packet.style.zIndex = "20";
    packet.style.transition = "1.5s linear";

    network.appendChild(packet);

    // Start animation
    setTimeout(function() {

        packet.style.left = endX + "px";
        packet.style.top = endY + "px";

    }, 50);

    // Remove packet after animation
    setTimeout(function() {

        packet.remove();

        status.innerText =
            "📦 Packet delivered successfully!";
            addActivity("✓ 📦 Packet delivered successfully");

    }, 1600);

});


/* =========================
   DELETE DEVICE
========================= */

deleteBtn.addEventListener("click", function() {

    if (selectedDevice === null) {

        status.innerText =
            "Select a device first";

        return;

    }


    // Remove related connections
    connections =
        connections.filter(function(connection) {

            if (
                connection.from === selectedDevice ||
                connection.to === selectedDevice
            ) {

                connection.element.remove();

                return false;

            }

            return true;

        });


    // Remove device
    selectedDevice.element.remove();


    // Remove from array
    devices =
        devices.filter(function(device) {

            return device !== selectedDevice;

        });


    selectedDevice = null;


    updateDeviceCount();

    updateConnectionCount();


    status.innerText =
        "Device deleted successfully";


    // Show welcome again
    if (devices.length === 0) {

        const welcome =
            document.querySelector(".welcome");

        if (welcome) {

            welcome.style.display =
                "block";

        }

    }

});


/* =========================
   CLEAR ALL
========================= */

clearBtn.addEventListener("click", function() {

    devices.forEach(function(device) {

        device.element.remove();

    });


    connections.forEach(function(connection) {

        connection.element.remove();

    });


    devices = [];

    connections = [];

    selectedDevice = null;

    firstDevice = null;

    connectMode = false;


    connectBtn.innerText =
        "🔗 Connect";


    updateDeviceCount();

    updateConnectionCount();


    status.innerText =
        "Network cleared";


    const welcome =
        document.querySelector(".welcome");


    if (welcome) {

        welcome.style.display =
            "block";

    }

});


/* =========================
   UPDATE DEVICE COUNT
========================= */

function updateDeviceCount() {

    deviceCount.innerText =
        devices.length;

}


/* =========================
   UPDATE CONNECTION COUNT
========================= */

function updateConnectionCount() {

    connectionCount.innerText =
        connections.length;

}


/* =========================
   BUTTON EVENTS
========================= */

addPC.addEventListener("click", function() {

    addDevice("PC", "💻");

});


addRouter.addEventListener("click", function() {

    addDevice("Router", "🌐");

});


addSwitch.addEventListener("click", function() {

    addDevice("Switch", "🔀");

});


addServer.addEventListener("click", function() {

    addDevice("Server", "🖥️");

});