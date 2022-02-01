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
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map, Subject, takeUntil, tap } from 'rxjs';
import { LetModule,PushModule } from '@rx-angular/template';
import { TranslocoModule } from '@ngneat/transloco';

import { DhTestClientDataAccessApiStore } from '@energinet-datahub/dh/test-client/data-access-api';
import { WattAutocompleteModule, WattButtonModule, WattIconModule, WattInputModule, WattSpinnerModule, WattFormFieldModule, WattTabsModule,  } from '@energinet-datahub/watt';
import { MatTabsModule } from '@angular/material/tabs';

//import { WattButtonModule, WattAutocompleteModule, WattFormFieldModule, WattTabsModule, WattIconModule, WattInputModule } from '@energinet-datahub/watt';
//import { FormGroup, FormBuilder, ReactiveFormsModule, FormArray} from '@angular/forms';

//import { DhSecondaryMasterDataComponentScam } from './secondary-master-data/dh-secondary-master-data.component';
//import { DhBreadcrumbScam } from './breadcrumb/dh-breadcrumb.component';
// import { DhMeteringPointIdentityScam } from './identity/dh-test-client-identity.component';
import { dhSendRawMessageTemplateIdParam } from './routing/dh-send-raw-message-id-param';
// import { DhMeteringPointNotFoundScam } from './not-found/dh-test-client-not-found.component';
// import { DhMeteringPointPrimaryMasterDataScam } from './primary-master-data/dh-test-client-primary-master-data.component';
// import { DhMeteringPointServerErrorScam } from './server-error/dh-test-client-server-error.component';
// import { DhChargesScam } from './charges/dh-charges.component';
// import { DhChildMeteringPointTabContentScam } from './child-test-client-tab-content/dh-child-test-client-tab-content.component';
// import { DhIsParentPipeScam } from './shared/is-parent.pipe';

//import { DhSendRawMessageOverviewFormScam } from './form/dh-send-raw-message-overview-form.component';
//import { DhSendRawMessageTempPropsScam } from './templateProperties/dh-send-raw-message-temp-props.component';
import { SendMessageTemplateDTO } from '@energinet-datahub/dh/shared/data-access-api';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

// let LogItXIGATEST: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-send-raw-message-overview',
  styleUrls: ['./dh-send-raw-message-overview.component.scss'],
  templateUrl: './dh-send-raw-message-overview.component.html',
  //This means the store is accessable from child components. Automatically cleaned up
  providers: [DhTestClientDataAccessApiStore],
})
export class DhSendRawMessageOverviewComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  sendMessageTemplateForm!: FormGroup;
  sendMessageTemplateDto!: SendMessageTemplateDTO;
  sendMessageTabIndex = 0;

  sendMessageTemplateId$ = this.route.params.pipe(
    map((params) => params[dhSendRawMessageTemplateIdParam] as string)
  );
  //Investigate further
  sendMessageTemplate$ = this.store.sendMessageTemplate$;
  sendMessageResult$ = this.store.sendMessageResult$;
  //.pipe(
    // tap((meteringPoint) => {
    //   this.childMeteringPointsCount =
    //     meteringPoint.childMeteringPoints?.length ?? 0;
    // })
  //);
  isLoading$ = this.store.isLoading$;
  sendMessageTemplateNotFound$ = this.store.sendMessageNotFound$;
  hasError$ = this.store.hasError$;
  //childMeteringPointsCount = 0;

  constructor(
    private route: ActivatedRoute,
    private store: DhTestClientDataAccessApiStore,
    private formBuilder: FormBuilder
  ) {

    //this.store.getDynamicRules();

    this.sendMessageTemplateId$
    .pipe(
      takeUntil(this.destroy$),
      map((sendMessageTemplateId) =>
        this.store.getSendMessageTemplate(sendMessageTemplateId)
      )
    )
    .subscribe();
    //using the pipe google says it is not necessary to use destroy. When do we need it?
    this.store.sendMessageTemplate$ .pipe(
      //When using async | no need to call this.destroy as it will be done automatically
      //Not sure I need it - I will leave it
      takeUntil(this.destroy$),
      map((dto) =>
      {
      this.sendMessageTemplateDto = dto //this.store.getSendMessageTemplate(sendMessageTemplateId)
       // create a form array for the groups
    const formControlArray = this.sendMessageTemplateDto.fieldList.map(x => this.formBuilder.control(x.value));
    const formArray = this.formBuilder.array(formControlArray);

      this.sendMessageTemplateForm = this.formBuilder.group({
        xmlTemplate: this.sendMessageTemplateDto.xmlTemplate,
        arrayList: formArray
      });
      }
      )
    )
    .subscribe();

  //   this.sendMessageResult$.pipe(
  //     takeUntil(this.destroy$),
  //     map((sendMessageResult) =>
  //     {
  //       console.error('xxxx2');
  //       console.error(sendMessageResult);
  //     }
  //     )
  //   ).subscribe();
 }

  // ngOnInit() {



  //     }

  ngOnDestroy(): void {
    console.warn('destroy called on overview form');
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  // onSubmit(sendMessageTemplateDto: SendMessageTemplateDTO) {
  //   console.warn('test submit overview:');
  //   console.warn(sendMessageTemplateDto);

  //   this.store.getSendMessage(sendMessageTemplateDto);

  //   //const sendMesResult =
  //   //this.store.sendMessageSimple(sendMessageTemplateDto);


  //   //console.error(sendMesResult);

  // }

  tabClick(event: MatTabChangeEvent) {
    console.warn(event);
    if(event.index === 1)
    {
      this.onUpdateFormAndDto();
    }
  }

  onSendMessageBeforeEdit() {

    //(<FormControl>this.sendMessageTemplateForm.get('xmlTemplate')).value = this.sendMessageTemplateDto.xmlTemplate;
    this.onUpdateFormAndDto();
    this.store.getSendMessage(this.sendMessageTemplateDto);
    this.sendMessageTabIndex = 3;
  }

  onSendMessageAfterEdit() {
    this.sendMessageTemplateDto.xmlTemplate = this.sendMessageTemplateForm.get('xmlTemplate')?.value;
    this.store.getSendMessage(this.sendMessageTemplateDto);
    this.sendMessageTabIndex = 3;
    //this.sendMessage.emit(this.sendMessageTemplateDto);
  }

  onUpdateFormAndDto()
  {
    this.updateXmlTemplateOnDto();
    //console.warn(this.sendMessageTemplateDto.xmlTemplate);
    //console.warn(this.sendMessageTemplateForm.get('xmlTemplate'));
    this.sendMessageTemplateForm.patchValue({xmlTemplate: this.sendMessageTemplateDto.xmlTemplate});
    //this.sendMessageTemplateForm.get('xmlTemplate')?.setValue(this.sendMessageTemplateDto.xmlTemplate);
    //console.warn(this.sendMessageTemplateDto.xmlTemplate);
    //console.warn(this.sendMessageTemplateForm.get('xmlTemplate'));
  }

updateXmlTemplateOnDto()
{
  const fieldValueformArray = (<FormArray>this.sendMessageTemplateForm.get('arrayList'));
    this.sendMessageTemplateDto.xmlTemplate = this.sendMessageTemplateDto.xmlOriginal;
    fieldValueformArray.controls.forEach( (elem, index) =>
    {
      this.sendMessageTemplateDto.fieldList[index].value = elem.value;
      this.sendMessageTemplateDto.xmlTemplate = this.sendMessageTemplateDto.xmlTemplate.replace('{{'+this.sendMessageTemplateDto.fieldList[index].code+'}}',elem.value);
      console.warn(this.sendMessageTemplateDto.fieldList[index].code);
      console.warn(elem.value);


    }
    );
}

  openXmlInNewWindowBeforeEdit() {
    // LogItXIGATEST('what.....');
    this.updateXmlTemplateOnDto();
    const xmlTemplate =this.sendMessageTemplateDto.xmlTemplate;
    if(xmlTemplate !== undefined) {
        const xml = new Blob([xmlTemplate], {type: 'text/xml'});
        const url = URL.createObjectURL(xml);
        window.open(url);
        URL.revokeObjectURL(url);
    }
  }

  openXmlInNewWindowAfterEdit() {

    const xmlTemplate =this.sendMessageTemplateForm.get('xmlTemplate')?.value;
    if(xmlTemplate !== undefined) {
        const xml = new Blob([xmlTemplate], {type: 'text/xml'});
        const url = URL.createObjectURL(xml);
        window.open(url);
        URL.revokeObjectURL(url);
    }
  }


}

@NgModule({
  declarations: [DhSendRawMessageOverviewComponent],
  imports: [
    CommonModule,
    //DhSendRawMessageOverviewFormScam,
    //DhSendRawMessageTempPropsScam,
    WattFormFieldModule,
    WattInputModule,
    WattAutocompleteModule,
    WattButtonModule,
    WattIconModule,
    TranslocoModule,
    MatSelectModule,
    MatInputModule,
    MatTabsModule,
    //DhBreadcrumbScam,
    // DhMeteringPointIdentityScam,
    // DhMeteringPointNotFoundScam,
    // DhMeteringPointPrimaryMasterDataScam,
    // DhMeteringPointServerErrorScam,
    LetModule,
    WattSpinnerModule,
    // DhSecondaryMasterDataComponentScam,
    // DhChargesScam,
 //   DhChildMeteringPointTabContentScam,
 PushModule,
    TranslocoModule,
    ReactiveFormsModule,
 //   DhIsParentPipeScam,
  ],
})
export class DhSendRawMessageOverviewScam {}
