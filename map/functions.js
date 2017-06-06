function getPath(src, dst, callBack) {
    var path = [];

    dS.route({
        origin: src,
        destination: dst,
        travelMode: 'DRIVING'
    }, function (resp, status) {
        if (status === 'OK') {
            var route = resp.routes[0].overview_path;
            if (route.length > 0) {
                for (var i = 0; i < route.length; i++) {
                    var point = route[i].toJSON();
//                    point.i = i;
                    path.push(point);
                }
                if (typeof callBack == 'function') {
                    callBack(path, status);
                }
            }
        } else {
            if (typeof callBack == 'function') {
                callBack(path, status);
            }
        }
    });
}

function setMarkers(points, map, label) {
    var markers = [];

    for (var i = 0; i < points.length; i++) {
        var marker = new google.maps.Marker({
            position: points[i],
            map: map,
            label: label
        });
        markers.push(marker);
    }

    return markers;
}

function normalize(points, withSort) {

    var newPoints = [];
    for (var i = 0; i < points.length; i++) {
        var distance = Math.sqrt(points[i].lat * points[i].lat + points[i].lng * points[i].lng);
        newPoints.push({
            lat: points[i].lat,
            lng: points[i].lng,
            dist: distance,
            i: i
        });
    }

    if (withSort) {
        newPoints.sort(function (a, b) {
            if (a.dist > b.dist) {
                return 1;
            }
            if (a.dist < b.dist) {
                return -1;
            }
            return 0;
        });
    }

    return newPoints;
}

//function normalize(points, withSort) {
//    var np = [];
//    for (var i = 0; i < points.length; i++) {
//        var distance = Math.sqrt(points[i].lat * points[i].lat + points[i].lng * points[i].lng);
//        var obj = {
//            lat: points[i].lat,
//            lng: points[i].lng,
//            dist: distance
//        };
//        np.push(obj);
//    }
//    if (withSort) {
//        np.sort(function (a, b) {
//            if (a.dist > b.dist) {
//                return 1;
//            }
//            if (a.dist < b.dist) {
//                return -1;
//            }
//            return 0;
//        });
//    }
//    return np;
//}

function binSearch(points, el) {
    var mid = Math.round(points.length / 2);
    var pmid = points.length - 1;
    var p = 0.01;
    while (mid >= 0 && mid <= points.length) {

        if (mid == pmid) {
            if (points[mid].dist == el.dist) {
                return {
                    a: el,
                    b: points[mid]
                };
            }
            break;
        }
        if (points[mid].dist > el.dist) {
            var tmp = mid;
            mid = mid - (Math.round((pmid - mid) / 2));
            pmid = tmp;
            continue;
        }
        if (points[mid].dist < el.dist) {
            var tmp = mid;
            mid = mid + (Math.round((pmid - mid) / 2));
            if (tmp > mid) {
                pmid = tmp;
            }
            continue;
        }
        return {
            a: points[mid],
            b: el
        };
        break;
    }
    return false;
}
