import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import {Vector as VectorSource} from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
// import Icon from 'ol/style/Icon';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import KML from 'ol/format/KML';
import GeoJSON from 'ol/format/GeoJSON';
import {Circle as CircleStyle, Icon, Fill, Stroke, Style, Text} from 'ol/style';
import Overlay from 'ol/Overlay';
import Select from 'ol/interaction/Select';
import {fromLonLat} from 'ol/proj';

import validate = WebAssembly.validate;
import {MapLayersEnum} from '../../../models/MapLayersEnum';
import {MapProperties} from '../../../models/PropertyConstants';
import {InfoService} from '../../../services/data/info.service';
import {Info} from '../../../models/Info';
import {cordova} from '@ionic-native/core';
import {Coordinates} from '../../../models/Coordinates';
import {Observable, Subject, Subscription} from 'rxjs';
import {V4MAPPED} from 'dns';
import {GeoLocationService} from '../../../services/location/geo-location.service';
import {createConsoleLogServer} from '@ionic/angular-toolkit/builders/cordova-serve/log-server';
import {ToastController} from '@ionic/angular';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() currentUserLocation: Observable<Coordinates>;

    @Output() event: EventEmitter<{ type: string, data: any }> = new EventEmitter<any>();

    private currentUserLocationSubscription: Subscription;

    map: any;
    areas: VectorLayer;
    features: VectorLayer;

    private areasSource: VectorSource;
    featureSource: VectorSource;
    selected: Select;
    info: Info;

    @ViewChild('popup', {static: false}) infoPopupElementRef: ElementRef;
    infoPopup: Overlay;

    private styles = {
        default_fill: new Fill({
            color: 'rgba(51,153,204,0.2)'
        }),
        danger_fill: new Fill({
            color: 'rgba(204,0,24,0.2)'
        }),
        mild_fill: new Fill({
            color: 'rgba(204,137,0,0.2)'
        }),
        safe_fill: new Fill({
            color: 'rgba(40,101,31,0.2)'
        }),
        default_stroke: new Stroke({
            color: '#3399CC',
            width: 3
        }),
        danger_stroke: new Stroke({
            color: '#cc0018',
            width: 3
        }),
        mild_stroke: new Stroke({
            color: '#cc8900',
            width: 3
        }),
        safe_stroke: new Stroke({
            color: '#28651f',
            width: 3
        }),

        user_icon: new Style({
            image: new Icon({
                anchor: [0.5, 1],
                src: '/assets/icon/baseline_location_on_black_18dp.png'
            })
        })
    };

    private styleFunction = (feature: Feature, resolution) => {
        if (feature /*&& feature.get('plz')*/ && feature.get('info')) {
            // const areaId = feature.get('plz');
            const info = feature.get('info');
            if (info.active > 20) {
                return [new Style({
                    stroke: this.styles.danger_stroke,
                    fill: this.styles.danger_fill
                })];
            } else if (info.active > 10) {
                return [new Style({
                    stroke: this.styles.mild_stroke,
                    fill: this.styles.mild_fill
                })];
            } else if (info.active === 0) {
                return [new Style({
                    stroke: this.styles.safe_stroke,
                    fill: this.styles.safe_fill
                })];
            }
        }
        return [new Style({
            stroke: this.styles.default_stroke,
            fill: this.styles.default_fill
        })];
    };


    constructor(
        private infoService: InfoService,
        private geoLocationService: GeoLocationService,
        public toastController: ToastController,
    ) {
        console.log('init map');
    }

    ngOnInit() {
        this.initMap()
            .then(value => {
                if (value) {
                    this.loadData();
                    this.setListeners();
                    this.addInteractions();
                    this.addUserLocation();
                } else {
                    alert('couldn\'t load map');
                }
            })
            .catch(e => alert('error occurred loading map'));
    }


    ngAfterViewInit(): void {
        this.infoPopup = new Overlay({
            element: this.infoPopupElementRef.nativeElement,
            positioning: 'bottom-center',
            stopEvent: false,
            // offset: [0, -50],
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        });
        this.map.addOverlay(this.infoPopup);
        console.log('popup added');
    }

    ngOnDestroy(): void {
        if (this.currentUserLocationSubscription) {
            this.currentUserLocationSubscription.unsubscribe();
        }
    }

    private initMap(): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const baseMap = new TileLayer({
                    source: new OSM(),
                    layerId: MapLayersEnum.BASE
                });
                baseMap.set(MapProperties.LAYER_ID, MapLayersEnum.BASE);

                this.map = new Map({
                    target: 'map',
                    layers: [baseMap],
                    view: new View({
                        center: olProj.fromLonLat([8.5663, 50.1207]),
                        zoom: 11
                    })
                });

                setTimeout(() => {
                    this.map.updateSize();
                    resolve(true);
                });
            } catch (e) {
                console.log(e);
                reject(false);
            }
        });
    }

    private setListeners() {
        this.map.on('singleclick', e => this.handleClickListener(e));
        this.map.on('click', e => {
            const feature = this.map.forEachFeatureAtPixel(e.pixel, (f) => f);
            if (!feature) {
                this.info = undefined;
                this.infoPopup.setPosition(undefined);
            }
        });
    }

    private handleClickListener(e) {
        // console.log(e.coordinate);
        this.map.forEachFeatureAtPixel(e.pixel, (feature, layer) => this.handleFeatureClick(feature, layer, e.coordinate));
    }

    private handleFeatureClick(feature, layer, coordinate?) {
        console.log('feature clicked', feature, coordinate);
        // console.log(layer);
        if (feature) {
            if (layer.get(MapProperties.LAYER_ID) === MapLayersEnum.FEATURES) {
                this.handleMarkerClick(feature);
            } else if (layer.get(MapProperties.LAYER_ID) === MapLayersEnum.AREAS) {
                this.handleAreaClick(feature, coordinate);
            }
        } else {
            this.info = undefined;
            this.infoPopup.setPosition(undefined);
            // this.infoPopup.popover('destroy');
        }
    }

    private handleAreaClick(feature, coordinate?) {
        console.log('area clicked', feature, coordinate);
        const areaId = feature.get('plz');
        const areaInfo = this.infoService.getInfo(areaId);
        this.displayInfo(feature, areaInfo, coordinate);
    }

    private handleMarkerClick(feature) {
        console.log('marker selected', feature);
    }

    private loadData() {
        this.featureSource = new VectorSource();
        this.features = new VectorLayer({source: this.featureSource, zIndex: 2});
        // this.features.setZIndex(2);
        this.map.addLayer(this.features);

        this.areasSource = new VectorSource({
            url: '/assets/kml/geo-api.json',
            format: new GeoJSON(),
        });

        this.areasSource.on('addfeature', (e) => this.updateInfoColors(e));

        this.areas = new VectorLayer({
            source: this.areasSource,
            zIndex: 1
            // style: this.styleFunction
        });
        this.areas.setStyle(this.styleFunction);
        this.areas.set(MapProperties.LAYER_ID, MapLayersEnum.AREAS);
        // this.areas.setZIndex(1);
        this.map.addLayer(this.areas);
    }

    private createFeature(i) {
        return new Feature({
            geometry: new
            Point(olProj.transform([Math.random() * 360 - 180, Math.random() * 180 - 90],
                'EPSG:4326', 'EPSG:3857')),
            name: 'Null Island ' + i,
            population: 4000,
            rainfall: 500
        });
    }

    private displayInfo(feature: Feature, value: Info, coordinate?): void {
        const coordinates = feature.getGeometry().getCoordinates();
        this.info = value;
        if (coordinate) {
            this.infoPopup.setPosition(coordinate);
        } else {
            this.infoPopup.setPosition(coordinates[0][0]);
        }
    }

    closeInfoPopUp() {
        this.infoPopup.setPosition(undefined);
        // closer.blur();
        // return false;
    }

    private addInteractions() {
        this.selected = new Select({
            // style: selectedStyle
        });
        this.map.addInteraction(this.selected);
        this.selected.on('select', (e) => this.handleFeatureSelection(e));
    }

    private handleFeatureSelection(e) {
        console.log(e);
        const selectedFeature = e.selected[0];
        if (selectedFeature) {
            const areaId = selectedFeature.get('plz');
        }
    }

    private addUserLocation() {
        this.currentUserLocationSubscription = this.currentUserLocation.subscribe((o) => this.updateUserLocation(o));
    }

    private updateUserLocation(coords: Coordinates) {
        if (!coords) {
            return;
        }

        // console.log('user location update');
        if (!this.featureSource.getFeatureById(MapProperties.USER_LOCATION)) {
            // add as new feature
            const user = new Feature({
                geometry: new Point(fromLonLat([coords.lat, coords.lng])),
            });
            user.setId(MapProperties.USER_LOCATION);
            user.setStyle(this.styles.user_icon);
            this.featureSource.addFeature(user);
            this.featureSource.changed();

            console.log('user location added', coords);
        } else {
            // update feature
            const user = this.featureSource.getFeatureById(MapProperties.USER_LOCATION);
            // this.featureSource.removeFeature(user);
            user.getGeometry().setCoordinates(fromLonLat([coords.lat, coords.lng]));
            // user.setId(MapProperties.USER_LOCATION);
            // user.setStyle(this.styles.user_icon);
            user.changed();
            // this.featureSource.addFeature(user);
            // this.featureSource.changed();
            // this.map.render();
            console.log('user location updated', coords);
            // alert('user location changed' + JSON.stringify(coords));
        }

        const isInside = this.areasSource.getFeatures().find(x => {
            if (x.getGeometry().intersectsCoordinate(fromLonLat([coords.lat, coords.lng]))) {
                return x;
            }
        });

        // console.log('inside the area: ', isInside);
        if (isInside) {
            const data = Object.assign({}, isInside.get('info'));
            if (data.active > 20) {
                console.log('you are inside highly affected area', isInside.get('info'));
                this.event.emit({type: 'toast', data: {info: data, status: 'danger'}});
            } else if (data.active > 10) {
                console.log('you are inside affected area', isInside.get('info'));
                this.event.emit({type: 'toast', data: {info: data, status: 'warning'}});
            } else {
                this.event.emit({type: 'toast', data: {info: data}});
            }
        }
    }

    private updateInfoColors(evt: any): Feature {
        if (!evt && !evt.feature) {
            return;
        }
        const feature = evt.feature;
        const areaId = feature.get('plz');
        feature.set('info', this.infoService.getInfo(areaId));
        // feature.changed();
        // return feature;
    }


}
