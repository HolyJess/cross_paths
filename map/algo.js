var pathA, pathB, sortedA,
    markersA, markersB,
    gotA, gotB;

getPath("Метро Щёлковская", "Метро Дмитровская", function (path) {
    pathA = path;
    gotA = true;

    var markersA = setMarkers(pathA, map, 'A');
});

getPath("Метро Бульвар Рокоссовского", "Метро Динамо", function (path) {
    pathB = path;

    var markersB = setMarkers(pathB, map, 'B');

    if (gotA) {
        algo();
    }
});

function algo() {
    sortedA = normalize(pathA, true);
    pathB = normalize(pathB);

    //АХТУНГ! Определить направления путей

    var crossPathsPoints = [];
    for (var i = 0; i < pathB.length; i++) {
        var point;
        if (point = binSearch(sortedA, pathB[i])) {
            crossPathsPoints.push(point);
        }
    }
    for (var i = 0; i < crossPathsPoints.length; i++) {
        var circle = new google.maps.Circle({
            map: map,
            fillOpacity: 1,
            center: crossPathsPoints[i].a,
            radius: 10
        });
    }

    var ai, bi;
    ai = crossPathsPoints[0].a.i;
    bi = crossPathsPoints[0].b.i;

    var crossEnd = false;
    var crossPath = [];
    crossPath.push(pathA[ai]);
    var c = 0;
    while (!crossEnd) {

        //Точка от которой считается угол
        var a = pathA[ai];
        var b = pathB[bi];

        //a1 и b1 - точки, между которыми считается угол
        var a1 = {
            lat: pathA[ai + 1].lat - a.lat,
            lng: pathA[ai + 1].lng - a.lng,
        };
        var b1 = {
            lat: pathB[bi + 1].lat - a.lat,
            lng: pathB[bi + 1].lng - a.lng,
        };
        //        console.log(a1, b1);

        var cosAng;
        var scalMult = a1.lat * b1.lat + a1.lng * b1.lng;
        var vectMult = Math.sqrt(a1.lat * a1.lat + a1.lng * a1.lng) *
            Math.sqrt(b1.lat * b1.lat + b1.lng * b1.lng);

        cosAng = (scalMult) /
            (vectMult);
        var ang = Math.acos(cosAng);

        if (ang <= 0.3) {
            crossPath.push(pathA[ai]);
        } else {
            crossPath.push(pathA[ai]);

            var circle = new google.maps.Circle({
                map: map,
                fillOpacity: 1,
                fillColor: '#00F',
                center: pathA[ai],
                radius: 15
            });
            crossEnd = true;
        }


        ai++;
        bi++;
        c++;
    }

    if (crossPath.length > 1) {
        console.log('Cross Path:', crossPath);
        var pathLine = new google.maps.Polyline({
            path: crossPath,
            strokeColor: '#03F',
            strokeOpacity: 1.0,
            strokeWeight: 3
        });
    }
}
