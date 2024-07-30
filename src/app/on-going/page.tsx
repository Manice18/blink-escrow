import DisplayEscrows from "@/components/Escrow/DisplayEscrows";

const Page = () => {
  return (
    <main>
      <section className="h-full overflow-hidden pt-36 md:pt-40 xl:pb-24 xl:pt-44">
        <div className="relative mx-auto flex max-w-c-1390 flex-col items-center justify-center space-y-10 px-4 md:px-8 2xl:px-0">
          <h1 className="font-dmsans text-4xl font-semibold">
            All On-going Escrows
          </h1>
          <DisplayEscrows />
        </div>
      </section>
    </main>
  );
};

export default Page;
