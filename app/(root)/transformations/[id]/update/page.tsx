import { auth } from "@/auth";
import { redirect } from "next/navigation";

import Header from "@/components/shared/header";
import TransformationForm from "@/components/shared/transformation-form";
import { transformationTypes } from "@/constants";
import { getImageById } from "@/lib/actions/image";

const Page = async ({ params: { id } }: SearchParamProps) => {
  const session = await auth();

  const image = await getImageById(id);

  if (session?.user.id !== image.author.user_id)
    redirect(`/transformations/${id}`);

  const transformation =
    transformationTypes[image.transformationType as TransformationTypeKey];

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />

      <section className="mt-10">
        <TransformationForm
          action="Update"
          userId={session?.user.id!}
          type={image.transformationType as TransformationTypeKey}
          creditBalance={session?.user.creditBalance!}
          config={image.config}
          data={image}
        />
      </section>
    </>
  );
};

export default Page;
