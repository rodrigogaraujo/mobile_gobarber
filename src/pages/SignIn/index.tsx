import React, { useCallback, useRef } from "react";
import {
    Image,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { Form } from "@unform/mobile";
import { FormHandles } from "@unform/core";
import * as Yup from "yup";

import { useAuth } from "../../hooks/Auth";
import Input from "../../components/Input";
import Button from "../../components/Button";
import {
    Container,
    Title,
    ForgotPassword,
    ForgotPasswordText,
    CreateAccountButton,
    CreateAccountButtonText,
} from "./styles";

import getValidationErros from "../../utils/getValidationErros";

import logoImg from "../../assets/logo.png";

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const navigation = useNavigation();

    const formRef = useRef<FormHandles>(null);
    const passwordInputRef = useRef<TextInput>(null);

    const { signIn } = useAuth();

    const handleSignIn = useCallback(
        async (data: SignInFormData) => {
            try {
                const schema = Yup.object().shape({
                    email: Yup.string()
                        .required("Digite seu email")
                        .email("Digite um email válido"),
                    password: Yup.string().required("Digite sua senha"),
                });
                await schema.validate(data, {
                    abortEarly: false,
                });

                await signIn({ email: data.email, password: data.password });
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const erros = getValidationErros(err);
                    formRef.current?.setErrors(erros);
                    return;
                }
                Alert.alert(
                    "Erro na autenticação",
                    "Ocorreu um erro ao fazer login, cheque as credenciais",
                );
            }
        },
        [signIn],
    );

    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                enabled
            >
                <ScrollView
                    contentContainerStyle={{ flex: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <Container>
                        <Image source={logoImg} />
                        <View>
                            <Title>Faça seu logon</Title>
                        </View>
                        <Form onSubmit={handleSignIn} ref={formRef}>
                            <Input
                                autoCorrect={false}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                name="email"
                                icon="mail"
                                placeholder="E-mail"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    passwordInputRef.current?.focus();
                                }}
                            />
                            <Input
                                ref={passwordInputRef}
                                secureTextEntry
                                name="password"
                                icon="lock"
                                placeholder="Senha"
                                returnKeyType="send"
                                onSubmitEditing={() => {
                                    passwordInputRef.current.focus;
                                }}
                            />

                            <Button
                                onPress={() => {
                                    formRef.current?.submitForm();
                                }}
                            >
                                Entrar
                            </Button>
                        </Form>
                        <ForgotPassword>
                            <ForgotPasswordText>
                                Esqueci minha senha
                            </ForgotPasswordText>
                        </ForgotPassword>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
            <CreateAccountButton
                onPress={() => {
                    navigation.navigate("SignUp");
                }}
            >
                <Icon name="log-in" size={20} color="#ff9000" />
                <CreateAccountButtonText>
                    Criar uma conta
                </CreateAccountButtonText>
            </CreateAccountButton>
        </>
    );
};

export default SignIn;
