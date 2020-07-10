import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HTTP} from '@ionic-native/http/ngx';

@Injectable({
    providedIn: 'root',

})
export class HttpClientService {
    private readonly BASE_URL = 'http://192.168.0.132:8085';

    constructor(private http: HttpClient,
                private httpNative: HTTP
    ) {
        this.httpNative.setDataSerializer('json');
    }

    private getURL(url: string) {
        return `${this.BASE_URL}${url}`;
    }

    getNative(url: string, params?: any, headers?: any): Promise<any> {
        params = params || {};
        headers = headers || {};
        return this.httpNative.get(this.getURL(url), params, headers);
    }

    postNative(url: string, body?: any, headers?: any): Promise<any> {
        body = body || {};
        headers = headers || {};
        // headers = Object.assign(headers, {'Content-Type': 'application/json'});
        // console.log('headers: ' + headers);
        // console.log('body: ' + body);

        return this.httpNative.post(this.getURL(url), body, headers);
    }

    get(url: string, options?: any): Observable<any> {
        return this.http.get(this.getURL(url), options);
    }

    post(url: string, body?: any, options?: any): Observable<any> {
        body = body || null;
        console.log('POSTING : ', url, JSON.stringify(body), JSON.stringify(options));
        return this.http.post(this.getURL(url), body, options);
    }
}

