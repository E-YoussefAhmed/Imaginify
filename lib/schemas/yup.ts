import { object, string, InferType, ref } from "yup";

export type RegisterData = InferType<typeof RegisterSchema>;

export type LoginData = InferType<typeof LoginSchema>;

export type TransformationData = InferType<typeof TransformationSchema>;

export const RegisterSchema = object({
  name: string()
    .required("Name is Required!")
    .min(3, "Name must be  at least 3 characters!"),
  email: string().email("Invalid Email!").required("Email is required!"),
  password: string()
    .required("Password is required!")
    .min(8, "Password must be  at least 8 characters!"),
  cPassword: string().oneOf([ref("password")], "Passwords doesn't match!"),
});

export const LoginSchema = object({
  email: string().email("Invalid Email!").required("Email is required!"),
  password: string()
    .required("Password is required!")
    .min(8, "Password must be  at least 8 characters"),
});

export const TransformationSchema = object({
  title: string().required(),
  aspectRatio: string(),
  color: string(),
  prompt: string(),
  publicId: string().required(),
});
