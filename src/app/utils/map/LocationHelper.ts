import {Coordinates} from '../../models/Coordinates';

export class LocationHelper {

    // Define Infinite (Using INT_MAX
    // caused overflow problems)
    static INF = 10000;

    // Given three colinear points p, q, r,
    // the function checks if point q lies
    // on line segment 'pr'
    static onSegment(p: Coordinates, q: Coordinates, r: Coordinates): boolean {
        if (q.lat <= Math.max(p.lat, r.lat) &&
            q.lat >= Math.min(p.lat, r.lat) &&
            q.lng <= Math.max(p.lng, r.lng) &&
            q.lng >= Math.min(p.lng, r.lng)) {
            return true;
        }
        return false;
    }

    // To find orientation of ordered triplet (p, q, r).
    // The function returns following values
    // 0 --> p, q and r are colinear
    // 1 --> Clockwise
    // 2 --> Counterclockwise
    static orientation(p: Coordinates, q: Coordinates, r: Coordinates): number {
        const val = (q.lng - p.lng) * (r.lat - q.lat)
            - (q.lat - p.lat) * (r.lng - q.lng);

        if (val === 0) {
            return 0; // colinear
        }
        return (val > 0) ? 1 : 2; // clock or counterclock wise
    }

    // The function that returns true if
    // line segment 'p1q1' and 'p2q2' intersect.
    static doIntersect(p1: Coordinates, q1: Coordinates,
                       p2: Coordinates, q2: Coordinates): boolean {
        // Find the four orientations needed for
        // general and special cases
        const o1 = LocationHelper.orientation(p1, q1, p2);
        const o2 = LocationHelper.orientation(p1, q1, q2);
        const o3 = LocationHelper.orientation(p2, q2, p1);
        const o4 = LocationHelper.orientation(p2, q2, q1);

        // General case
        if (o1 !== o2 && o3 !== o4) {
            return true;
        }

        // Special Cases
        // p1, q1 and p2 are colinear and
        // p2 lies on segment p1q1
        if (o1 === 0 && LocationHelper.onSegment(p1, p2, q1)) {
            return true;
        }

        // p1, q1 and p2 are colinear and
        // q2 lies on segment p1q1
        if (o2 === 0 && LocationHelper.onSegment(p1, q2, q1)) {
            return true;
        }

        // p2, q2 and p1 are colinear and
        // p1 lies on segment p2q2
        if (o3 === 0 && LocationHelper.onSegment(p2, p1, q2)) {
            return true;
        }

        // p2, q2 and q1 are colinear and
        // q1 lies on segment p2q2
        if (o4 === 0 && LocationHelper.onSegment(p2, q1, q2)) {
            return true;
        }

        // Doesn't fall in any of the above cases
        return false;
    }

    // Returns true if the Coordinates p lies
    // inside the polygon[] with n vertices
    public static isInside(polygon: Coordinates[], n: number, p: Coordinates): boolean {
        // There must be at least 3 vertices in polygon[]
        if (n < 3) {
            return false;
        }

        // Create a Coordinates for line segment from p to infinite
        const extreme = {lat: this.INF, lng: p.lng} as Coordinates;

        // Count intersections of the above line
        // with sides of polygon
        let count = 0;
        let i = 0;
        do {
            const next = (i + 1) % n;

            // Check if the line segment from 'p' to
            // 'extreme' intersects with the line
            // segment from 'polygon[i]' to 'polygon[next]'
            if (LocationHelper.doIntersect(polygon[i], polygon[next], p, extreme)) {
                // If the Coordinates 'p' is colinear with line
                // segment 'i-next', then check if it lies
                // on segment. If it lies, return true, otherwise false
                if (LocationHelper.orientation(polygon[i], p, polygon[next]) === 0) {
                    return LocationHelper.onSegment(polygon[i], p,
                        polygon[next]);
                }

                count++;
            }
            i = next;
        } while (i !== 0);

        // Return true if count is odd, false otherwise
        return (count % 2 === 1); // Same as (count%2 == 1)
    }
}
