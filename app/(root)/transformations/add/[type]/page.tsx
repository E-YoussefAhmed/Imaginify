import { auth } from "@/auth";
import Header from "@/components/shared/header";
import TransformationForm from "@/components/shared/transformation-form";
import { transformationTypes } from "@/constants";
import { getUserById } from "@/lib/data/user";

const AddTransformationTypePage = async ({
  params: { type },
}: SearchParamProps) => {
  const session = await auth();
  const transformation = transformationTypes[type];

  const user = await getUserById(session?.user?.id!);

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />

      <section className="mt-10">
        <TransformationForm
          action="Add"
          userId={session?.user.id!}
          type={transformation.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />
      </section>
    </>
  );
};

export default AddTransformationTypePage;
