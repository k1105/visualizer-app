import {Debugger} from "@/components/Debugger";
import {Sketch} from "@/components/Sketch";
import {CameraPropertyProvider} from "@/components/context/CameraPropertyContext";
import {PropertyProvider} from "@/components/context/PropertyContext";

const Home = () => {
  return (
    <>
      <PropertyProvider>
        <CameraPropertyProvider>
          <Sketch />
          <Debugger />
        </CameraPropertyProvider>
      </PropertyProvider>
    </>
  );
};

export default Home;
