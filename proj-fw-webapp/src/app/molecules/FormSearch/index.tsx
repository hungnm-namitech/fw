import React from 'react';
import { TextField, TextFieldProps } from '@/app/components/TextField';
import { FIELD_TYPE } from '@/lib/constants';
import SelectField from '@/app/components/SelectField';
import { CheckBox } from '@/app/components/CheckBox';
import clsx from 'clsx';
import { InputDatePicker } from '@/app/components/InputDatePicker';
import { ComboBox } from '@/app/components/ComboBox';

interface FormSearchProps {
  searchFields: any[];
  formClassName?: string;
}
export interface SearchFieldProps extends TextFieldProps {
  classfield?: string;
  isMulti?: boolean;
}

const FormSearch: React.FC<FormSearchProps> = ({
  searchFields,
  formClassName,
}) => {

  return (
    <div
      className={clsx('flex flex-wrap mx-4 mt-5 relative z-50', formClassName)}
    >
      {searchFields.map((item, index) => {
        switch (item.inputType) {
          case FIELD_TYPE.TEXT_INPUT:
            return (
              <div key={index} className={item.classfield}>
                <TextField {...item} />
              </div>
            );
          case FIELD_TYPE.INLINE_SELECT:
            return (
              <div key={index} className={item.classfield}>
                <SelectField {...item} />
              </div>
            );
          case FIELD_TYPE.CHECKBOX:
            return (
              <div key={index} className={item.classfield}>
                <CheckBox {...item} />
              </div>
            );
          case FIELD_TYPE.DATE_PICKER:
            return (
              <div key={index} className={item.classfield}>
                <InputDatePicker {...item} />
              </div>
            );
          case FIELD_TYPE.DIV:
            return (
              <div key={index} className={item.classfield}>
                {item.content}
              </div>
            );
          case FIELD_TYPE.COMBO_BOX:
            return (
              <div key={index} className={item.classfield}>
                <ComboBox {...item} />
              </div>
            );
          default:
            return (
              <div key={index} className={item.classfield}>
                <TextField {...item} />
              </div>
            );
        }
      })}{' '}
    </div>
  );
};

export default FormSearch;
