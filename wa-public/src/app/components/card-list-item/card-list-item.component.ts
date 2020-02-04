import { Component, OnInit, Input } from '@angular/core';
import { IFormConfig } from 'src/app/services/form-config.service';

@Component({
  selector: 'wap-card-list-item',
  template: `
    <div [ngSwitch]="formElement.type">
      <ion-item>
        <ion-label position="{{position}}">{{ formElement.label }}</ion-label>
        <ng-container *ngIf="formItem.value">
          <ion-badge [color]="color">
            <!-- TODO: handle field formatters, e.g.: dates -->
            <ion-text>{{ formItem.value }}</ion-text>
          </ion-badge>
        </ng-container>
        <ng-container *ngIf="!formItem.value">
          <ion-badge color="warning"><ion-text>not defined</ion-text></ion-badge>
        </ng-container>
      </ion-item>
    </div>
  `,
  styleUrls: ['./card-list-item.component.scss'],
})
export class CardListItemComponent implements OnInit {
  @Input() formElement: IFormConfig;
  @Input() formItem: { label: string; key: string; value: string };
  @Input() color:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'light'
    | 'medium'
    | 'dark' = 'dark';
  @Input() position = 'stacked';
  constructor() {}

  ngOnInit() {}
}
