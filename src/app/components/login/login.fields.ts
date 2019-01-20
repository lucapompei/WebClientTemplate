import { FieldInterface } from '../common/form/field.interface';
import { FieldTypeEnum } from '../common/form/field-type.enum';

/**
 * The login form fields
 */
export class LoginFields {

    /**
     * The login fields
     */
    loginFields: FieldInterface[] = [{
        title: 'username',
        type: FieldTypeEnum.STRING,
        key: 'username',
        value: null,
        isRequired: true,
        isEnabled: true
    },
    {
        title: 'password',
        type: FieldTypeEnum.PASSWORD,
        key: 'password',
        value: null,
        isRequired: true,
        isEnabled: true
    }];

}
