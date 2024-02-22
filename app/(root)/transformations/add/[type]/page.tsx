import { redirect } from "next/navigation";

import { auth } from "@/auth";
import Header from "@/components/shared/header";
import TransformationForm from "@/components/shared/transformation-form";
import { transformationTypes } from "@/constants";

const AddTransformationTypePage = async ({
  params: { type },
}: SearchParamProps) => {
  const session = await auth();
  const transformation = transformationTypes[type];

  if (!session?.user) {
    const encodedCallbackUrl = encodeURIComponent(`/transformations/${type}`);
    redirect(`/login?callbackUrl=${encodedCallbackUrl}`);
  }

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />

      <section className="mt-10">
        <TransformationForm
          action="Add"
          userId={session?.user.id}
          type={transformation.type as TransformationTypeKey}
          creditBalance={session?.user.creditBalance}
        />
      </section>
    </>
  );
};

export default AddTransformationTypePage;
