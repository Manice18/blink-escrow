import DisplayEscrows from "@/components/Escrow/DisplayEscrows";

const Page = () => {
  return (
    <main>
      <section className="pt-35 xl:pb-25 xl:pt-46 h-screen overflow-hidden md:pt-40">
        <div className="max-w-c-1390 relative mx-auto flex flex-col items-center justify-center space-y-10 px-4 md:px-8 2xl:px-0">
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
