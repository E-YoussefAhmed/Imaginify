import Image from "next/image";

import Header from "@/components/shared/header";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileLoading = () => {
  return (
    <>
      <Header title="Profile" />

      <section className="profile">
        <div className="profile-balance">
          <p className="p-14-medium md:p-16-medium">CREDITS AVAILABLE</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/assets/icons/coins.svg"
              alt="coins"
              width={50}
              height={50}
              className="size-9 md:size-12"
            />
            <Skeleton className="rounded-2xl h-10 w-20 bg-dark-700/90" />
          </div>
        </div>

        <div className="profile-image-manipulation">
          <p className="p-14-medium md:p-16-medium">IMAGE MANIPULATION DONE</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/assets/icons/photo.svg"
              alt="coins"
              width={50}
              height={50}
              className="size-9 md:size-12"
            />
            <Skeleton className="rounded-2xl h-10 w-20 bg-dark-700/90" />
          </div>
        </div>
      </section>

      <section className="sm:mt-12">
        <div className="collection-heading">
          <h2 className="h2-bold text-dark-600">Recent Edits</h2>
        </div>
        <ul className="collection-list">
          <Skeleton className="rounded-2xl h-[292px] bg-dark-700/90" />
          <Skeleton className="rounded-2xl h-[292px] bg-dark-700/90" />
          <Skeleton className="rounded-2xl h-[292px] bg-dark-700/90" />
          <Skeleton className="rounded-2xl h-[292px] bg-dark-700/90" />
          <Skeleton className="rounded-2xl h-[292px] bg-dark-700/90" />
          <Skeleton className="rounded-2xl h-[292px] bg-dark-700/90" />
        </ul>
      </section>
    </>
  );
};

export default ProfileLoading;

{
  /* <div className="relative w-full min-h-dvh">
<div className="transforming-loader">
  <Image
    src="/assets/icons/spinner.svg"
    width={50}
    height={50}
    alt="spinner"
  />
  <p className="text-white/80">Please wait...</p>
</div>
</div> */
}
