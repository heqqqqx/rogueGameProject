var mapWidth = 120;
var mapHeight = 60;
var maxRooms = 10;

var map = new ROT.Map.Digger(mapWidth, mapHeight, {
    roomWidth: [4, 20], 
    roomHeight: [4, 20], 
    corridorLength: [3, 10],
    dugPercentage: 0.5,
    timeLimit: 5000,
    maxRooms: maxRooms
});

var displayOptions = {
    width: mapWidth,
    height: mapHeight,
    fontSize: 170,
    fontFamily: "monospace",
    bg: "#000",
    fg: "#fff"
};
var display = new ROT.Display(displayOptions);

var mapContainer = document.getElementById("map-container");
mapContainer.appendChild(display.getContainer());

map.create(function (x, y, value) {
    display.draw(x, y, value ? "#" : ".");
});

var rooms = map.getRooms();
// for (var i = 0; i < rooms.length; i++) {
//     var room = rooms[i];
//     var left = room.getLeft();
//     var top = room.getTop();
//     var width = room.getRight() - left;
//     var height = room.getBottom() - top;

//     display.draw(left, top, ".", null, "lightgreen");
//     display.draw(left + 1, top + 1, null, null, "lightgreen", null, null, "lightgreen");
//     display.draw(left + 1, top + height - 1, null, null, "lightgreen", null, null, "lightgreen");
//     display.draw(left + width - 1, top + 1, null, null, "lightgreen", null, null, "lightgreen");
//     display.draw(left + width - 1, top + height - 1, null, null, "lightgreen", null, null, "lightgreen");
// }