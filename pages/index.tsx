import {Debugger} from "@/components/Debugger";
import {Sketch} from "@/components/Sketch";
import {CameraPropertyProvider} from "@/components/context/CameraPropertyContext";
import {PropertyProvider} from "@/components/context/PropertyContext";
import styles from "@/styles/Home.module.css";

const Home = () => {
  return (
    <>
      <main className={styles.main}>
        <PropertyProvider>
          <CameraPropertyProvider>
            <Sketch />
            <Debugger />
          </CameraPropertyProvider>
        </PropertyProvider>
      </main>
    </>
  );
};

export default Home;
