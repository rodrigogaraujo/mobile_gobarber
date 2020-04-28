import React, {
    useEffect,
    useRef,
    useImperativeHandle,
    forwardRef,
    useState,
    useCallback,
} from "react";
import { useField } from "@unform/core";

import { TextInputProps } from "react-native";

import { Container, TextInput, Icon } from "./styles";

interface InputProps extends TextInputProps {
    name: string;
    icon: string;
}

interface InputValueReference {
    value: string;
}

interface InputRef {
    focus(): void;
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = (
    { name, icon, ...rest },
    ref,
) => {
    const inputElementRef = useRef<any>(null);

    const { registerField, defaultValue = "", fieldName, error } = useField(
        name,
    );
    const inputValueRef = useRef<InputValueReference>({ value: defaultValue });

    const [isFocused, setIsfocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    const handleInputFocus = useCallback(() => {
        setIsfocused(true);
    }, []);

    const handleInputBlur = useCallback(() => {
        setIsfocused(false);
        setIsFilled(!!inputValueRef.current?.value);
    }, []);

    useImperativeHandle(ref, () => ({
        focus() {
            inputElementRef.current?.focus();
        },
    }));

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputValueRef.current,
            path: "value",
            setValue(ref: any, value: string) {
                inputValueRef.current.value = value;
                inputElementRef.current.setNativeProps({ text: value });
            },
            clearValue() {
                inputValueRef.current.value = "";
                inputElementRef.current.clear();
            },
        });
    }, [fieldName, registerField]);

    return (
        <Container isFocused={isFocused} isErrored={!!error}>
            <Icon
                name={icon}
                size={20}
                color={isFocused || isFilled ? "#ff9000" : "#666360"}
            />
            <TextInput
                ref={inputElementRef}
                onChangeText={(value) => {
                    inputValueRef.current.value = value;
                }}
                defaultValue={defaultValue}
                keyboardAppearance="dark"
                placeholderTextColor="#666360"
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                {...rest}
            />
        </Container>
    );
};

export default forwardRef(Input);
