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

    if(gotA){
        algo();
    }
});

    function algo(){
        sortedA = normalize(pathA, true);
        pathB = normalize(pathB);

        //АХТУНГ! Определить направления путей

        var crossPathsPoints = [];
        for(var i = 0; i < pathB.length; i++){
            var point;
            if(point = binSearch(sortedA, pathB[i])){
                    crossPathsPoints.push(point);
            }
        }
        for(var i = 0; i < crossPathsPoints.length; i++){
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
        while(!crossEnd){
            var a = pathA[ai];
            var b = pathB[bi];
            var a1 = pathA[ai + 1];
            var b1 = pathB[bi + 1];


            crossEnd = true;
        }
    }
