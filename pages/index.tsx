import { Debugger } from "@/components/Debugger";
import { Sketch } from "@/components/Sketch";
import { PropertyProvider } from "@/components/context/PropertyContext";

const Home = () => {
  return (
    <>
      <PropertyProvider>
        <Sketch />
        <Debugger />
      </PropertyProvider>
    </>
  );
};

export default Home;
