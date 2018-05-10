import { FieldTypeEnum } from './field-type.enum';

export interface FieldInterface {

    key: string;
    title: string;
    type: FieldTypeEnum;
    value: any;
    values?: any[];
    placeholder: string;
    isRequired: boolean;
    isEnabled: boolean;

}
