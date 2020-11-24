import React, { useState } from 'react';
import { Input } from 'antd';

const NumericInput = (props) => {
  const onChange = (e) => {
    const { value } = e.target;
    const reg = /^([1-9]{1}[0-9]{0,2}(,\d{3})*(\.\d{0,2})?|[1-9]{1}\d{0,}(\.\d{0,2})?|0(\.\d{0,2})?|(\.\d{1,2}))$|^-?\$?([1-9]{1}\d{0,2}(,\d{3})*(\.\d{0,2})?|[1-9]{1}\d{0,}(\.\d{0,2})?|0(\.\d{0,2})?|(\.\d{1,2}))$|^\(\$?([1-9]{1}\d{0,2}(,\d{3})*(\.\d{0,2})?|[1-9]{1}\d{0,}(\.\d{0,2})?|0(\.\d{0,2})?|(\.\d{1,2}))\)$/;

    if ((!isNaN(value) && reg.test(value)) || value === '') {
      props.onChange(value, props.index);
    }
  };

  return (
    <Input
      size='large'
      className={props.className}
      prefix={props.prefix}
      onChange={onChange}
      value={props.value}
      placeholder={props.placeholder}
      maxLength={25}
    />
  );
};

export default NumericInput;
