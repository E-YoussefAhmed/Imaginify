import { redirect } from "next/navigation";

import { auth } from "@/auth";
import RegisterForm from "@/components/auth/register-form";

const RegisterPage = async () => {
  const session = await auth();

  if (session?.user) redirect("/");
  return <RegisterForm />;
};

export default RegisterPage;
