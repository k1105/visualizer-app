import { Sketch } from "@/components/Sketch";
import { PropertyProvider } from "@/components/context/PropertyContext";

const Home = () => {
  return (
    <>
      <PropertyProvider>
        <Sketch />
      </PropertyProvider>
    </>
  );
};

export default Home;
