import { FieldInterface } from '../common/form/field.interface';
import { FieldTypeEnum } from '../common/form/field-type.enum';

export class LoginFields {

    /**
     * The login fields
     */
    loginFields: FieldInterface[] = [{
        title: 'email',
        type: FieldTypeEnum.EMAIL,
        key: 'email',
        value: null,
        placeholder: 'email_placeholder',
        isRequired: true,
        isEnabled: true
    },
    {
        title: 'password',
        type: FieldTypeEnum.PASSWORD,
        key: 'password',
        value: null,
        placeholder: 'password_placeholder',
        isRequired: true,
        isEnabled: true
    }];

}
