import {Component, Input, OnInit} from '@angular/core';
import {Info} from '../../../../models/Info';

@Component({
    selector: 'app-info-pop-up',
    templateUrl: './info-pop-up.component.html',
    styleUrls: ['./info-pop-up.component.scss'],
})
export class InfoPopUpComponent implements OnInit {
    @Input() info: Info;

    constructor() {
    }

    ngOnInit() {
    }

}
