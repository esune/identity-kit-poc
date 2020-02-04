import { Component, OnInit, Input } from '@angular/core';
import { IFormConfig, FormConfigService } from 'src/app/services/form-config.service';

@Component({
  selector: 'wap-issue-preview',
  template: `
    <ion-list>
      <div *ngFor="let formElement of formTemplate">
        <wap-card-list-item [formElement]="formElement" [formItem]="formItem(formElement)"></wap-card-list-item>
      </div>
    </ion-list>
  `,
  styleUrls: ['./issue-preview.component.scss']
})
export class IssuePreviewComponent implements OnInit {
  @Input() values: { key: string; value: string; label: string }[];
  @Input() position = 'stacked';

  formTemplate: IFormConfig[];

  constructor() {}

  ngOnInit() {
    this.formTemplate = FormConfigService.fields;
  }

  formItem(formElement: IFormConfig) {
    const result = this.values.filter(item => {
      return item.key === formElement.fieldName;
    });
    if(result.length > 1) {
      throw Error(`More than one result was found for ${formElement.fieldName}`);
    }
    return result.shift();
  }
}
