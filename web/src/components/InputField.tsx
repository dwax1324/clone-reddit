import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from '@chakra-ui/core';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react'


type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    name: string;
    textarea?: boolean;
}

const inputField: React.FC<InputFieldProps> = ({
    label,
    size: _,
    textarea,
    ...props }) => {
    let InputOrTextarea = Input;
    textarea ? InputOrTextarea = Textarea : InputOrTextarea = Input;
    const [field, {error}] = useField(props);
    return (
            <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <InputOrTextarea
                {...field}
                {...props}
                id={field.name}/>
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
              </FormControl>
    );
}

export default inputField;