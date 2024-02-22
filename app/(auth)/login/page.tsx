import { redirect } from "next/navigation";

import { auth } from "@/auth";
import LoginForm from "@/components/auth/login-form";

const LoginPage = async () => {
  const session = await auth();

  if (session?.user) redirect("/");

  return <LoginForm />;
};

export default LoginPage;
