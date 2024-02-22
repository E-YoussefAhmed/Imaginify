import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <Skeleton className="h-72 rounded-[20px] bg-dark-700/90 sm:block hidden" />
      <section className="sm:mt-12">
        <div className="collection-heading">
          <h2 className="h2-bold text-dark-600">Recent Edits</h2>
          <Skeleton className="rounded-2xl bg-dark-700/90 h-[50px] w-full md:max-w-96" />
        </div>
        <ul className="collection-list">
          <Skeleton className="rounded-2xl h-[292px] bg-dark-700/90" />
          <Skeleton className="rounded-2xl h-[292px] bg-dark-700/90" />
          <Skeleton className="rounded-2xl h-[292px] bg-dark-700/90" />
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

export default Loading;
