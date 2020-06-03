import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { FieldInterface } from './field.interface';
import { FieldTypeEnum } from './field-type.enum';

/**
 * Form field component used to display and manage each application form
 */
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent extends BaseComponent implements OnInit, OnDestroy {

  /**
   * Boolean used to indicate if the view is just created and
   * there is no interaction with the user yet
   */
  private isTheInitializationPhase = true;

  /**
   * The form fields
   */
  @Input() fields: FieldInterface[] = [];

  /**
   * The field enum
   */
  fieldTypeEnum = FieldTypeEnum;

  /**
   * The event used to signal that there is a file to upload
   */
  @Output() uploadFileEvent: EventEmitter<any> = new EventEmitter();

  constructor() {
    super();
  }

  ngOnInit() { }

  ngOnDestroy() { }

  /**
   * Validates the form field
   *
   * @param field
   */
  private isValidateField(field: FieldInterface): boolean {
    /**
     * It validates a field in the following cases:
     *
     * 1. If the validation occurs during the initialization phase (the view has just created)
     * 2. If the field is not enabled
     * 3. If the field is not required and it is blank
     * 4. If the field is valorizated and compliant
     */
    if (
      this.isTheInitializationPhase ||
      !field.isEnabled ||
      (!field.isRequired && (field.type === FieldTypeEnum.BOOLEAN || field.value == null || field.value === ''))) {
      return true;
    } else if (field.type === FieldTypeEnum.PHONE) {
      const numberRegex = /[?\+]{0,1}[0-9]+/g;
      return field.value != null && field.value.length >= 3 && numberRegex.test(field.value);
    } else if (field.type === FieldTypeEnum.NUMBER) {
      const numberRegex = /\d+/g;
      return field.value != null && numberRegex.test(field.value);
    } else if (field.type === FieldTypeEnum.EMAIL) {
      const emailRegex = /^\S+@\S+$/;
      return field.value != null && emailRegex.test(field.value);
    } else if (field.type === FieldTypeEnum.PASSWORD) {
      // const passwordRegex = /^(?=.*[A-Za-z])(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
      // return field.value != null && passwordRegex.test(field.value);
      return field.value != null && field.value.replace(' ', '').length >= 3;
    } else if (field.type === FieldTypeEnum.CONFIRM_PASSWORD) {
      let passwordField = null;
      const fields = this.fields;
      for (let index = 0; index < fields.length; index++) {
        if (fields[index].key === 'password' && fields[index].type === FieldTypeEnum.PASSWORD) {
          passwordField = fields[index].value;
          break;
        }
      }
      return passwordField != null && field.value === passwordField;
    } else if (field.type === FieldTypeEnum.BOOLEAN) {
      return field.value === true;
    } else if (field.type === FieldTypeEnum.SELECT) {
      return field.value != null;
    } else /*FieldTypeEnum.STRING*/ {
      return field.value != null && field.value.replace(' ', '').length >= 3;
    }
  }

  /**
   * Checks the existence of at least one mandatory field
   */
  public isAtLeastOneFieldEditableAndRequired(): boolean {
    const listSize = this.fields.length;
    for (let index = 0; index < listSize; index++) {
      if (this.fields[index].isEnabled && this.fields[index].isRequired) {
        return true;
      }
    }
    return false;
  }

  /**
   * Validates the form and return the fields in case of positive response
   */
  public areValidatedFields(): boolean {
    this.isTheInitializationPhase = false;
    const listSize = this.fields.length;
    for (let index = 0; index < listSize; index++) {
      if (!this.isValidateField(this.fields[index])) {
        // Fields are not validated
        return false;
      }
    }
    return true;
  }

  /**
   * Return the field value corresponding to the given key
   *
   * @param key
   */
  public getValueByKey(key: string): any {
    const listSize = this.fields.length;
    for (let index = 0; index < listSize; index++) {
      if (this.fields[index].key === key) {
        return this.fields[index].value;
      }
    }
    return null;
  }

  /**
   * Force the force field value for the given key
   *
   * @param key
   * @param value
   */
  public forceFormFieldValue(key: string, value: any): void {
    const listSize = this.fields.length;
    for (let index = 0; index < listSize; index++) {
      if (this.fields[index].key === key) {
        this.fields[index].value = value;
      }
    }
  }

  /**
   * Reset the form fields
   */
  public resetFormFields(): void {
    const listSize = this.fields.length;
    for (let index = 0; index < listSize; index++) {
      this.fields[index].value = null;
    }
  }

  /**
   * Emits the event for the file to upload
   *
   * @param file
   */
  public uploadFile(file: any) {
    if (file != null) {
      this.uploadFileEvent.emit(file);
    }
  }

}
