import Image from "next/image";

const TransformationLoading = () => {
  return (
    <div className="relative w-full min-h-dvh">
      <div className="transforming-loader">
        <Image
          src="/assets/icons/spinner.svg"
          width={50}
          height={50}
          alt="spinner"
        />
        <p className="text-white/80">Please wait...</p>
      </div>
    </div>
  );
};

export default TransformationLoading;
