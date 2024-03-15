import { auth } from "@/auth";
import LoginForm from "@/components/auth/login-form";

const LoginPage = async () => {
  const session = await auth();

  return <LoginForm />;
};

export default LoginPage;
