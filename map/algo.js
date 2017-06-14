var pathA, pathB, sortedA,
    markersA, markersB,
    gotA, gotB;

getPath("Метро Царицыно", "ул. Академика Миллионщикова 22"/*"Метро Каширская"*/, function (path) {
    pathA = path;
    gotA = true;

    var markersA = setMarkers(pathA, map, 'A');
});

getPath("Метро Кантемироская", "Метро Варшавска", function (path) {
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
        //        var circle = new google.maps.Circle({
        //            map: map,
        //            fillOpacity: 0.5,
        //            center: crossPathsPoints[i].a,
        //            radius: 10
        //        });
    }

    if (crossPathsPoints.length > 1) {



        var aStep = crossPathsPoints[0].a.i - crossPathsPoints[1].a.i;
        var bStep = crossPathsPoints[0].b.i - crossPathsPoints[1].b.i;
        var isSameDir;
        if ((aStep < 0 && bStep < 0) || (aStep > 0 && bStep > 0)) {
            isSameDir = true;
            console.log('Paths in same ways');

        } else {
            isSameDir = false;
            console.log('Paths in diff ways');
        }
    } else {
        isSameDir = false;
        console.log('Paths dont cross over or in diff ways');
    }

    //Проверять пересечение только если путь идут в одном направлении и пересекаются
    if (isSameDir) {

        (function () {
            var mid = [];
            var ai = crossPathsPoints[0].a.i;
            var bi = crossPathsPoints[0].b.i;

            for (var i = 0; i < pathA.length; i++) {
                if (pathB[bi] != undefined && pathA[ai] != undefined) {
                    //                    console.log(pathA, pathB);
                    var tmpPoint = {
                        lat: (pathA[ai].lat + pathB[bi].lat) / 2,
                        lng: (pathA[ai].lng + pathB[bi].lng) / 2
                    };
                    mid.push(tmpPoint);
                }
                    ai++;
                    bi++;
            }

            console.log(pathA, pathB);
            for (var i = 0; i < mid.length; i++) {
                var circle = new google.maps.Circle({
                    map: map,
                    fillOpacity: 1,
                    center: mid[i],
                    radius: 2,
                    fillColor: '#426'
                });
            }
        })();

        //        var ai, bi;
        //        ai = crossPathsPoints[0].a.i;
        //        bi = crossPathsPoints[0].b.i;
        //
        //        var crossEnd = false;
        //        var crossPath = [];
        //        crossPath.push(pathA[ai]);
        //        //Будет искать пересекающийся путь пока угол не будет
        //        //меньше погрешности - 0.3 градуса
        //        while (!crossEnd) {
        //
        //            //Точка от которой считается угол
        //            var a = pathA[ai];
        //            var b = pathB[bi];
        //
        //            //a1 и b1 - точки, между которыми считается угол
        //            if (pathA[ai + 1] && a) {
        //                var a1 = {
        //                    lat: pathA[ai + 1].lat - a.lat,
        //                    lng: pathA[ai + 1].lng - a.lng,
        //                };
        //            }
        //            if (pathB[bi + 1] && a) {
        //                var b1 = {
        //                    lat: pathB[bi + 1].lat - a.lat,
        //                    lng: pathB[bi + 1].lng - a.lng,
        //                };
        //            }
        //            var cosAng;
        //            var scalMult = a1.lat * b1.lat + a1.lng * b1.lng;
        //            var vectMult = Math.sqrt(a1.lat * a1.lat + a1.lng * a1.lng) *
        //                Math.sqrt(b1.lat * b1.lat + b1.lng * b1.lng);
        //
        //            cosAng = (scalMult) /
        //                (vectMult);
        //            var ang = Math.acos(cosAng);
        //            console.log('ang ' + ang);
        //            console.log('cos ' + cosAng);
        //            console.log();
        //            cosAng = (cosAng > 1) ? 1 : cosAng;
        //
        //            if (cosAng < 1) { //Угол больше 0 градусов
        //                if (ang <= 0.2) {
        //                    crossPath.push(pathA[ai]);
        //                } else {
        //                    crossPath.push(pathA[ai]);
        //                    var circle = new google.maps.Circle({
        //                        map: map,
        //                        fillOpacity: 0.5,
        //                        fillColor: '#00F',
        //                        center: pathA[ai],
        //                        radius: 5
        //                    });
        //                    circle = new google.maps.Circle({
        //                        map: map,
        //                        fillOpacity: 0.5,
        //                        fillColor: '#0aff00',
        //                        center: pathB[bi + 1],
        //                        radius: 5
        //                    });
        //                    circle = new google.maps.Circle({
        //                        map: map,
        //                        fillOpacity: 0.5,
        //                        fillColor: '#d10000',
        //                        center: pathA[ai + 1],
        //                        radius: 5
        //                    });
        //                    crossEnd = true;
        //                }
        //            } else { //Угол 0 градусов
        //                crossPath.push(pathA[ai]);
        //            }

        //Старый метод
        //            if (ang <= 0.3) {
        //                crossPath.push(pathA[ai]);
        //            } else {
        //                crossPath.push(pathA[ai]);
        //                if (cosAng < 1) {
        //                    var circle = new google.maps.Circle({
        //                        map: map,
        //                        fillOpacity: 0.5,
        //                        fillColor: '#00F',
        //                        center: pathA[ai],
        //                        radius: 5
        //                    });
        //                    circle = new google.maps.Circle({
        //                        map: map,
        //                        fillOpacity: 0.5,
        //                        fillColor: '#0aff00',
        //                        center: pathB[bi + 1],
        //                        radius: 5
        //                    });
        //                    circle = new google.maps.Circle({
        //                        map: map,
        //                        fillOpacity: 0.5,
        //                        fillColor: '#d10000',
        //                        center: pathA[ai + 1],
        //                        radius: 5
        //                    });
        //                    crossEnd = true;
        //                }
        //
        //            }
        //            var deltaB1 = {
        //                lat: pathB[bi + 1].lat - a.lat,
        //                lng: pathB[bi + 1].lng - a.lng
        //            };
        //            var distAB1 = Math.sqrt(deltaB1.lat * deltaB1.lat + deltaB1.lng * deltaB1.lng);
        //            console.log(a, pathB[bi + 1]);
        //            console.log(distAB1);

        //            if (distAB1 < 0.00275) {
        //            bi++;
        //            //            }
        //            ai++;
        //        }

        /*if (crossPath.length > 1) {
            var pathLine = new google.maps.Polyline({
                path: crossPath,
                strokeColor: '#03F',
                strokeOpacity: 1.0,
                strokeWeight: 3,
                map: map
            });
        }*/
    }
}
