import { FieldTypeEnum } from './field-type.enum';

/**
 * The form field interface
 */
export interface FieldInterface {

    key: string;
    title: string;
    type: FieldTypeEnum;
    value: any;
    values?: any[];
    isRequired: boolean;
    isEnabled: boolean;

}
