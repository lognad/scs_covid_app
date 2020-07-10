export class Coordinates {
    lat: number;
    lng: number;

    getCoordinates(): [number, number] {
        return [this.lat, this.lng];
    }
}
