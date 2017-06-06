function getPath(src, dst) {
    var dS = new google.maps.DirectionsService,
        path = [];

    dS.route({
        origin: src,
        destination: dst,
        travelMode: 'DRIVING'
    }, function (resp, status) {
        if (status === 'OK') {
            var route = resp.routes[0].overview_path;
            if (route.length > 0) {
                for (var i = 0; i < route.length; i++) {
                    path.push(route[i].toJSON());
                }
                return path;
            }
        } else {

        }
    });
}

function setMarkers(points, map, label) {
    var markers = [];

    for (var i = 0; i < points.length; i++) {
        var marker = new google.maps.Marker({
            position: points[i],
            map: map,
            label: label,
            i: i
        });
        markers.push(marker);
    }

    return markers;
}

function normalize(points, withSort) {
    var np = [];
    for (var i = 0; i < points.length; i++) {
        var distance = Math.sqrt(points[i].lat * points[i].lat + points[i].lng * points[i].lng);
        var obj = {
            lat: points[i].lat,
            lng: points[i].lng,
            dist: distance
        };
        np.push(obj);
    }
    if (withSort) {
        np.sort(function (a, b) {
            if (a.dist > b.dist) {
                return 1;
            }
            if (a.dist < b.dist) {
                return -1;
            }
            return 0;
        });
    }
    return np;
}

function binSearch(points, el) {
    var mid = Math.round(points.length / 2);
    var pmid = points.length - 1;
    //            debugger;
    var p = 0.01;
    while (mid >= 0 && mid <= points.length) {

        if (mid == pmid) {
            if (points[mid].dist == el.dist /* && points[mid].x == el.x*/ ) {
                //                        return [el, points[mid]];
                //                        if (Math.abs(el.lat - points[mid].lat) < p ||
                //                            Math.abs(el.lng - points[mid].lng) < p) {
                return {
                    a: el,
                    b: points[mid]
                };
                //                        }
            }
            break;
        }
        if (points[mid].dist > el.dist /* && points[mid].dist > el.dist + p && points[mid].dist > el.dist - p*/ ) {
            var tmp = mid;
            mid = mid - (Math.round((pmid - mid) / 2));
            pmid = tmp;
            continue;
        }
        if (points[mid].dist < el.dist /* && points[mid].dist < el.dist + p && points[mid].dist < el.dist - p*/ ) {
            var tmp = mid;
            mid = mid + (Math.round((pmid - mid) / 2));
            if (tmp > mid) {
                pmid = tmp;
            }
            continue;
        }
        //                if (Math.abs(el.lat - points[mid].lat) < p ||
        //                    Math.abs(el.lng - points[mid].lng) < p) {
        return {
            a: points[mid],
            b: el
        };
        //                }
        break;
    }
    return false;
}
