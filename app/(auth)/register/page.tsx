import { auth } from "@/auth";
import RegisterForm from "@/components/auth/register-form";

const RegisterPage = async () => {
  const session = await auth();

  return <RegisterForm />;
};

export default RegisterPage;
