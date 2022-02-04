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
import { SendMessageTemplateDTO, SendMessageTemplateFieldDTO } from '@energinet-datahub/dh/shared/data-access-api';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ValidationRuleDto, ValidationRuleItemDto, ValidationRuleResultDto, ValidationRuleResultItemDto } from './validation-rule-dto';
import { JsonpClientBackend } from '@angular/common/http';

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
  sendMessageTemplateForm: FormGroup = this.formBuilder.group([]);
  formControlArray!: FormControl[];
  sendMessageTemplateDto!: SendMessageTemplateDTO;
  sendMessageTabIndex = 0;

  sendMessageTemplateId$ = this.route.params.pipe(
    map((params) => params[dhSendRawMessageTemplateIdParam] as string)
  );
  //Investigate further
  sendMessageTemplate$ = this.store.sendMessageTemplate$;
  // sendMessageTemplateFieldArray$ = sendMessageTemplate$.pipe(
  //   map((params) => params.ssen as string)
  // )
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

  displayedColumns: string[] = ['name', 'isMandatory', 'value','validationIcon','valueHint', /*'comment',*/ 'validation'];
  validationControlHints: Array<string> = [];

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
    this.formControlArray = this.sendMessageTemplateDto.fieldList.map((x,index) => this.formBuilder.control(x.value,this.getValidatorArray(x,index)));
    //console.error('form array test');
    const formArray = this.formBuilder.array(this.formControlArray);

      this.sendMessageTemplateForm = this.formBuilder.group({
        xmlTemplate: this.sendMessageTemplateDto.xmlTemplate,
        arrayList: formArray
      });

      //formArray.valueChanges.subscribe( (data,index) => {console.warn(data)});
      //formArray.setValidators(this.comparisonValidatorTwo());



      formArray.controls.forEach(
        control => {
            control.valueChanges.subscribe(
                 (data) => {

                  const valRuleResult : ValidationRuleResultDto = {
                    status : 'OK',
                    statusText : '',
                    alertMessage : '',
                    resultArray : []
                  }

                  const ctrlIndex = formArray.controls.indexOf(control);
                  const codeShortCurrent = this.sendMessageTemplateDto.fieldList[ctrlIndex].codeShort;
                console.log(codeShortCurrent); // logs index of changed item in form array
                console.log(data);
                const codeShortAndValueMap = this.getFormCodeShortAndValueMap();
                const fieldValueformArray = (<FormArray>this.sendMessageTemplateForm.get('arrayList'));
                  this.sendMessageTemplateDto.validationRuleList.forEach( (ruleItem) =>
                  {
                    const valRuleResultItem : ValidationRuleResultItemDto = {
                      ruleItem : ruleItem,
                      fieldNameArray : [],
                      ruleReplaced:''
                    }

                    let ruleReplaced = ruleItem.rule;
                    codeShortAndValueMap.forEach(( fieldDto: SendMessageTemplateFieldDTO, code: string) =>
                    {
                      //const code = fieldDto.codeShort;
                      if(ruleItem.rule.indexOf('{{'+code+'}}') !== -1)
                      {
                        valRuleResultItem.fieldNameArray.push(code);
                        const valueFromForm = codeShortAndValueMap.get(code);
                        // replace does not replace all instances - this is a workaround
                        ruleReplaced = ruleReplaced.split('{{'+code+'}}').join("'"+(valueFromForm?.value??'')+"'");
                        ;
                      }
                    });
                    valRuleResultItem.ruleReplaced = ruleReplaced;
                    if(eval(ruleReplaced))
                    {
                      valRuleResultItem.fieldNameArray.forEach((codeShort) =>
                      {
                        const fieldDto = codeShortAndValueMap.get(codeShort);
                        const fieldIndex = this.sendMessageTemplateDto.fieldList.findIndex((dto) => dto.codeShort === codeShort);
                        //if()
                        // console.error(codeShort);
                        // console.error(fieldDto);
                        // console.warn(fieldIndex);
                        const formControlFromCode = fieldValueformArray.controls[fieldIndex];
                        console.error(formControlFromCode.errors);
                        formControlFromCode?.setErrors(formControlFromCode.errors || { 'rule' : valRuleResultItem.ruleItem.text});
                        console.error(formControlFromCode.errors);
                        formControlFromCode?.markAsTouched();
                        //formControlFromCode?.status = 'NOTVALID';
                        // console.error(formControlFromCode);
                        // console.error(formControlFromCode?.status);
                        // console.error(formControlFromCode?.valid);
                        // console.log(valRuleResultItem.ruleItem.text);
                        //console.log(valRuleResultItem.ruleItem.action);
                      });

                    }
                    valRuleResult.resultArray.push(valRuleResultItem);
                  });
                 }
            )
        }
   )

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

  const codeValueMap = new Map<string, string>();

  // Test dictionary
  codeValueMap.set("MpType", "E17");
  codeValueMap.set("MeteringPointSubtype", "D03");
  console.warn(codeValueMap.get('PO1'));

  // const ruleArray: Array<ValidationRuleItemDto> = new Array<ValidationRuleItemDto>();
  // ruleArray.push(new ValidationRuleItemDto());

  const valRule : ValidationRuleDto = {
    name : 'SubTypeValidation',
    description :'desc',
    ruleArray : [
      { rule : '{{MpType}}=="E17"', action : 'ignore', text : 'equals E17'},
  ]
  };
  console.log(valRule);

  const servletAnswer = "<script type=\"text/javascript\">function dynamicResult_TemplateCreateUpdateMp(valRuleDto){    console.log(valRuleDto.name);}</script>";

  const chatScript = document.createElement("script");
  chatScript.type = "text/javascript";
  chatScript.text = servletAnswer;
  //chatScript.async = true;
  //chatScript.src = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js";
  //document.body.appendChild(chatScript);

  console.log(eval("'D04' == 'D04' & 'D04' != 'D03'"));

  // eslint-disable-next-line no-with
  // with (valRule) const res = eval('dynamicResult_TemplateCreateUpdateMp');
  // eval('dynamicResult_TemplateCreateUpdateMp()');
  //const result = dynamicResult_TemplateCreateUpdateMp()
 }

  // ngOnInit() {

    // private dynamicResult_TemplateCreateUpdateMp(valRuleDto : ValidationRuleDto, codeValueMap : Map<string, string>) : ValidationRuleResultDto {
    //   const valRuleResult : ValidationRuleResultDto = {
    //     name : 'SubTypeValidation',
    //     description :'desc',
    //     ruleArray : [
    //       { rule : '{{MpType}}=="E17"', action : 'ignore', text : 'equals E17'},
    //   ]
    //   };

    //   }

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

private getFormCodeShortAndValueMap() : Map<string, SendMessageTemplateFieldDTO>
{
  const codeValueMap = new Map<string, SendMessageTemplateFieldDTO>();

  const fieldValueformArray = (<FormArray>this.sendMessageTemplateForm.get('arrayList'));
    fieldValueformArray.controls.forEach( (elem, index) =>
    {
      const fieldDto = this.sendMessageTemplateDto.fieldList[index];
      fieldDto.value = elem.value;
      codeValueMap.set(fieldDto.codeShort, fieldDto);
    });
return codeValueMap;
}

  private getValidatorArray(dto : SendMessageTemplateFieldDTO, index : number) : ValidatorFn []
  {
    //this.validationControlHints.push
    const validators : Array<ValidatorFn> = [];
    if(dto.isMandatory)
    {
      validators.push(Validators.required);
    }
    //https://developer.mozilla.org/en-US/docs/Glossary/Falsy
    switch (dto.fieldType) {
      case "String":
        if(dto.fieldTypeParam1)
        {
          // !dto.fieldTypeParam1 || dto.fieldTypeParam1.length === 0
          validators.push(Validators.maxLength(+dto.fieldTypeParam1));
          //validators.push(this.ValidateDynamicRules);

        }
        break;
        case "Number":
          validators.push(Validators.pattern("^[0-9]*$"))
        if(dto.fieldTypeParam1)
        {
          validators.push(Validators.min(+dto.fieldTypeParam1));
        }
        if(dto.fieldTypeParam2)
        {
          validators.push(Validators.max(+dto.fieldTypeParam2));
        }
        if(dto.fieldTypeParam3)
        {
          validators.push(Validators.maxLength(+dto.fieldTypeParam3));
          validators.push(Validators.minLength(+dto.fieldTypeParam3));
        }
        break;
    }
  return validators;
  }

  public comparisonValidator() : ValidatorFn {
    console.error('called');
    //const controlFormArray = this.sendMessageTemplateForm.get('arrayList');
    //controlFormArray.controls[2];
    const cottt = (<FormArray>this.sendMessageTemplateForm.get('arrayList')).controls[1];
    console.error(cottt);
    return Validators.required;
//     return (group: FormGroup): ValidationErrors => {
//        const control1 = group.controls['myControl1'];
//        const control2 = group.controls['myControl2'];
//        if (control1.value !== control2.value) {
//           control2.setErrors({notEquivalent: true});
//        } else {
//           control2.setErrors(null);
//        }
//        return null;
//  };
}

// : ValidationErrors
public comparisonValidatorTwo() : ValidationErrors{
  return (group: FormArray)  : ValidationErrors | null => {
    console.warn('ddd');
    return null;
    // return Validators.required;
    //  const control1 = group.controls['myControl1'];
    //  const control2 = group.controls['myControl2'];
    //  if (control1.value !== control2.value) {
    //     control2.setErrors({notEquivalent: true});
    //  } else {
    //     control2.setErrors(null);
    //  }
    //  // eslint-disable-next-line sonarjs/no-redundant-jump
    //  return;
};
}

  ValidateDynamicRules(control: AbstractControl) {
    const validationTextArray : Array<string> = [];
    console.error('one');

    console.error(this.sendMessageTemplateForm.controls);
    console.error('two');
    //const controlFormArray = this.sendMessageTemplateForm.get('arrayList');

    // if(!controlFormArray)
    // {
    //    return null;
    // }
    // console.error('three');
    // console.error(controlFormArray);
    // const fieldValueformArray = (<FormArray>controlFormArray);
    // fieldValueformArray.controls.forEach( (elem, index) =>
    // {
    //   const ddd = elem.value;
    // });
    //if (true) {
      return { dependencyValidation: {message: "your message here"} };
    //}
    return null;
  }

  getValidityCheck(i: number) {
    const invalid = (<FormArray>this.sendMessageTemplateForm.get('arrayList')).controls[i].invalid;
    const dirty = (<FormArray>this.sendMessageTemplateForm.get('arrayList')).controls[i].dirty;
    const touched = (<FormArray>this.sendMessageTemplateForm.get('arrayList')).controls[i].touched;
    return `invalid. ${invalid}. Dirty. ${dirty}. Touched. ${touched}`;
  }

// getArrayControl(i: number)
// {

// }

  getValidity(i: number) : boolean {
    const validControl = (<FormArray>this.sendMessageTemplateForm.get('arrayList')).controls[i];
    if(validControl.invalid && (validControl.dirty || validControl.touched))
    {
      // console.warn('getval:');
      // console.warn(validControl);// object.required
      // console.warn(validControl.errors);// object.required
      // if (validControl.errors != null) {
      //   Object.keys(validControl.errors).forEach(keyError => {
      //     //keyError??''
      //     if (validControl.errors != null) {
      //    console.log('Key control: ' + ', keyError: ' + keyError + ', err value: ', validControl.errors[keyError]);
      //     }
      //   });
      // }

      return false;
    }
    return true;
  }

  getValidationMessages(i: number) : Array<string> {
    const validControl = (<FormArray>this.sendMessageTemplateForm.get('arrayList')).controls[i];
    const errorMessageArray :  Array<string> = [];
    if(validControl.invalid && (validControl.dirty || validControl.touched))
    {
      // console.warn('getval:');
      // console.warn(validControl);// object.required
      // console.warn(validControl.errors);// object.required
      if (validControl.errors != null) {
        Object.keys(validControl.errors).forEach(keyError => {
          //keyError??''
          if (validControl.errors != null) {
              switch (keyError) {
                case 'pattern':
                  //console.warn(JSON.stringify( validControl.errors[keyError] ));
                  if(JSON.stringify( validControl.errors[keyError] ).indexOf('^[0-9]*$') > 0)
                  {
                    errorMessageArray.push('Must be a number');
                  }
                  else
                  {
                    errorMessageArray.push(this.prettyfyJsonErrorMessage(JSON.stringify( validControl.errors[keyError] )));
                  }
                  //errorMessageArray.push(this.prettyfyJsonErrorMessage(JSON.stringify( validControl.errors[keyError] )).replace('requiredPattern:^[0-9]*$','Must be a number'));
                  break;
                  case 'minlength':
                    //let minLengthErrorMessage = ;

                    errorMessageArray.push(this.prettyfyJsonErrorMessage(JSON.stringify( validControl.errors[keyError] )).replace('requiredLength','Required').replace('actualLength','Actual'));
                      //.substring(1,validControl.errors[keyError].split('"').join('').replace('requiredLength','Required:'));
                    // Object.keys(validControl.errors).forEach(keyError => {
                    //   errorMessageArray.push(validControl.errors[keyError]);
                    // });
                    break;
                default:
                  errorMessageArray.push(this.prettyfyJsonErrorMessage(JSON.stringify( validControl.errors[keyError] )));
                  break;
              }
         //console.log('Key control: ' + ', keyError: ' + keyError + ', err value: ', validControl.errors[keyError]);

          }
        });
      }
    }
    return errorMessageArray;
  }
  // getValidityItem(i: number) : Array<string | boolean> {
  //   const validControl = (<FormArray>this.sendMessageTemplateForm.get('arrayList')).controls[i];
  //   let validArray : Array<string | boolean> = [];
  //   if(validControl.invalid && (validControl.dirty || validControl.touched))
  //   {
  //     return  ;
  //   }
  //   return true;
  // }

  private prettyfyJsonErrorMessage(jsonErrorMessage : string) : string {
    return jsonErrorMessage.substring(1,jsonErrorMessage.length-1).split('"').join('');
  }

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
  if(this.sendMessageTemplateForm === undefined)
{
  return;
}
  const fieldValueformArray = (<FormArray>this.sendMessageTemplateForm.get('arrayList'));
    this.sendMessageTemplateDto.xmlTemplate = this.sendMessageTemplateDto.xmlOriginal;
    fieldValueformArray.controls.forEach( (elem, index) =>
    {
      this.sendMessageTemplateDto.fieldList[index].value = elem.value;
      this.sendMessageTemplateDto.xmlTemplate = this.sendMessageTemplateDto.xmlTemplate.replace('{{'+this.sendMessageTemplateDto.fieldList[index].code+'}}',elem.value);
    });
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
    MatTableModule,
    MatIconModule,
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
