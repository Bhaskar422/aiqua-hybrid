import { SignInSchema, TSignInSchema } from "@/lib/validTypes";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { View, StyleSheet, SafeAreaView, Platform, ScrollView } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { user_endpoint } from "@/lib/config";
import { Input } from "@/components/ui/input";
import AiquaLogo from "@/assets/images/aiqua_logo.svg";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useSetRecoilState } from "recoil";
import { userIdState } from "@/components/store/atoms";

const LoginScreen = () => {
  const setUserId = useSetRecoilState(userIdState);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignInSchema>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: TSignInSchema) => {
    const urlEncoded = new URLSearchParams();
    urlEncoded.append("email", data.email);
    urlEncoded.append("password", data.password);

    try {
      const result = await fetch(`${user_endpoint}/auth/signin`, {
        method: "POST",
        body: urlEncoded.toString(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      const resJson = await result.json();
      setUserId(resJson.userId);
      if (resJson) {
        router.push(`/counting/`);
      }
    } catch (error) {
      console.log(error);
      alert("Invalid login credentials");
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="w-full mt-20 flex justify-center items-center">
          <AiquaLogo height={100} width={100} />
        </View>
        <View className="flext justify-center items-center mt-8">
          <Text
            style={{ fontFamily: "Poppins_700Bold", fontSize: 40 }}
            className="pt-12 pb-2 text-primary"
          >
            Let's Login
          </Text>
          <Text style={{ fontFamily: "Poppins_500Medium" }} className="pb-10">
            Welcome back! Please enter your details
          </Text>
        </View>
        <View style={styles.container}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                style={styles.input}
                className="bg-secondary my-4 text-primary"
                placeholder="Email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
              />
            )}
            name="email"
            rules={{ required: "You must enter your email" }}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                // {...field}
                className="bg-secondary mb-12 text-primary"
                style={styles.input}
                secureTextEntry={true}
                autoCorrect={false}
                // returnKeyType="go"
                placeholder="Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              >
                {/* <Eye /> */}
              </Input>
            )}
            name="password"
            rules={{
              required: "You must enter your password",
            }}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}

          <Button onPress={handleSubmit(onSubmit)}>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
              }}
            >
              Log In
            </Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    // fontFamily: "Poppins_100Thin",
    // fontFamily: "Poppins_300Light",
    // fontFamily: "Poppins_200ExtraLight",
    fontFamily: "Poppins_500Medium",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default LoginScreen;
