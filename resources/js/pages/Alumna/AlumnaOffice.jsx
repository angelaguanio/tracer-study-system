import AlumnaLayout from "@/layouts/alumna-layout";
import { AlumnaOfficeSection } from "@/components/ui/AlumnaOfficeComponents";
import { officeData } from "../../lib/AlumnaOfficeDatalist";

function AlumnaOffice() {
  return (
    <div className="min-h-screen w-full flex flex-col pt-20">

      {/* PAGE TITLE */}
      <div className="text-center px-4 pb-20">
        <h1 className="text-4xl md:text-7xl font-bold text-blue-800 font-inria">
          ALUMNI AFFAIRS
        </h1>
        <p className="text-xl md:text-2xl text-blue-700 mt-2">
          LIST OF OFFICERS
        </p>
      </div>

      {/* OFFICE SECTION — full-width image, centered cards */}
      <AlumnaOfficeSection {...officeData} />

    </div>
  );
}

export default AlumnaOffice;

AlumnaOffice.layout = page => <AlumnaLayout>{page}</AlumnaLayout>;
