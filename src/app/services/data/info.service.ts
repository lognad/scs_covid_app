import {Injectable} from '@angular/core';
import {from, Observable, of} from 'rxjs';
import {Info} from '../../models/Info';
import {CovidInfo} from '../../models/CovidInfo';
import {HttpClientService} from '../http/http-client.service';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class InfoService {

    private infos: CovidInfo[];

    constructor(private http: HttpClientService) {
        this.getData();
    }

    getInfo(areaId: string): Info {
        const data = this.infos ? this.infos[0] : undefined;
        if (data) {
            const info = data.data.find(x => x.areaId === areaId);
            return info;
        }
        return {} as Info;

        // return of({areaId, total: 100, active: 20, cured: 70, critical: 2, deaths: 18} as Info);
    }

    getInfos(): CovidInfo[] {
        return this.infos;
    }

    getData()/*: Observable<CovidInfo[]>*/ {
        this.http.getNative('/data')
            .then(value => {
                console.log('data loading from server', value[0].id, value[0].name);
                this.infos = value;
            })
            .catch(err => {
                console.log(err.message);
                this.http.get('/data')
                    .subscribe(value => {
                        console.log('data loading from server with http', value);
                        this.infos = value;
                    });
            });

        // return from(this.http.getNative('/data'))
        //     .pipe(
        //         map((data) => {
        //             console.log('data loaded from server', data);
        //             this.infos = data as CovidInfo[];
        //             return this.infos;
        //         })
        //     );
    }
}
