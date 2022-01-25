/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { CommonModule } from '@angular/common';
import {
  //ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import {SendMessageTemplateDTO } from '@energinet-datahub/dh/shared/data-access-api';
import { WattButtonModule, WattAutocompleteModule, WattFormFieldModule, WattTabsModule, WattIconModule, WattInputModule } from '@energinet-datahub/watt';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormArray} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

// import { DhMeteringPointStatusBadgeScam } from '../status-badge/dh-metering-point-status-badge.component';
//import { emDash } from '../'../shared/em-dash';

export interface MeteringPointIdentityTranslationKeys {
  meteringMethod: string;
  meteringPointType: string;
  readingOccurrence: string;
  settlementMethod: string;
}

@Component({
  //changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-send-raw-message-temp-props',
  styleUrls: ['./dh-send-raw-message-temp-props.component.scss'],
  templateUrl: './dh-send-raw-message-temp-props.component.html',
})
export class DhSendRawMessageTempPropsComponent implements OnInit{

  sendMessageTemplateForm!: FormGroup;


  @Input()
  sendMessageTemplateDto!: SendMessageTemplateDTO;
  @Output()
  sendMessage = new EventEmitter<SendMessageTemplateDTO>();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {


// create a form array for the groups
const formControlArray = this.sendMessageTemplateDto.fieldList.map(x => this.formBuilder.control(x.value));
const formArray = this.formBuilder.array(formControlArray);

  this.sendMessageTemplateForm = this.formBuilder.group({
    name: '',
    code: '',
    description:'',
    domain: '',
    rsmName: '',
    xmlTemplate: this.sendMessageTemplateDto.xmlTemplate,
    arrayList: formArray
  });
  }

  onUpdateAndSendMessage() {

    //(<FormControl>this.sendMessageTemplateForm.get('xmlTemplate')).value = this.sendMessageTemplateDto.xmlTemplate;
    this.onUpdateFormAndDto();
    this.sendMessage.emit(this.sendMessageTemplateDto);
  }

  onSendMessage() {
    this.sendMessage.emit(this.sendMessageTemplateDto);
  }

  onUpdateFormAndDto()
  {
    const fieldValueformArray = (<FormArray>this.sendMessageTemplateForm.get('arrayList'));
    fieldValueformArray.controls.forEach( (elem, index) =>
    {
      this.sendMessageTemplateDto.fieldList[index].value = elem.value;
      this.sendMessageTemplateDto.xmlTemplate = this.sendMessageTemplateDto.xmlTemplate.replace('{{'+this.sendMessageTemplateDto.fieldList[index].code+'}}',elem.value);
      console.warn(elem.value);
      console.warn(this.sendMessageTemplateDto.fieldList[index].code);

    }
    );
    this.sendMessageTemplateForm.patchValue({xmlTemplate: this.sendMessageTemplateDto.xmlTemplate});
  }

  openXmlInNewWindow() {

    const xmlTemplate =this.sendMessageTemplateDto.xmlTemplate;
    if(xmlTemplate !== undefined) {
        const blob = new Blob([xmlTemplate], {type: 'text/xml'});
        const url = URL.createObjectURL(blob);
        window.open(url);
        URL.revokeObjectURL(url);
    }
  }
}

@NgModule({
  declarations: [DhSendRawMessageTempPropsComponent],
  exports: [DhSendRawMessageTempPropsComponent],
  imports: [/*DhMeteringPointStatusBadgeScam,*/ WattFormFieldModule,
    WattInputModule,
    WattAutocompleteModule,
    WattButtonModule,
    WattIconModule,
    WattTabsModule,
    TranslocoModule,
    MatSelectModule,
    MatInputModule,
    //FormsModule,
    ReactiveFormsModule,
    CommonModule,],
})
export class DhSendRawMessageTempPropsScam {}
