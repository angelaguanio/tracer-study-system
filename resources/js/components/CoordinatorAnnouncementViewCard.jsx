import React from "react";
import homecoming from "@/assets/homecoming.png";

export default function CoordinatorAnnouncementViewCard() {
  return (
    <div className="w-full max-w-5xl">

      {/* TITLE */}
      <h1 className="text-[32px] font-bold text-[#1E4EA8]">
        CECT ALUMNI HOMECOMING 2025
      </h1>

      {/* DATE + TIME */}
      <div className="mt-2 text-gray-600">
        <p>February 20, 2025</p>
        <p>8:11 PM</p>
      </div>

      {/* IMAGE */}
      <div className="flex justify-end mt-10 mb-10">
        <img
          src={homecoming}
          alt="Homecoming"
          className="w-[380px] sm:w-[420px] lg:w-[450px] object-cover -translate-x-10"
        />
      </div>

      {/* DESCRIPTION */}
      <div className="text-gray-800 leading-relaxed text-justify mb-6 w-full break-words ml-60">
        <p className="mb-4">
          The College of Engineering and Computer Technology (CECT) of
          Wesleyan University–Philippines is pleased to announce the upcoming
          CECT Alumni Homecoming 2025, which will be held on March 15, 2025
          (Saturday) at 6:00 PM at the Wesleyan University–Philippines
          Gymnasium, Cabanatuan City.
        </p>

        <p className="mb-4">
          This special event aims to reunite alumni from different batches and
          programs under CECT, giving them an opportunity to reconnect with
          former classmates, faculty members, and the university community.
          Activities include recognition programs, networking opportunities,
          and celebration of achievements of the alumni.
        </p>

        <p>
          All graduates of the College of Engineering and Computer Technology
          are warmly invited to attend and participate in this meaningful
          gathering. We encourage everyone to join and celebrate the continued
          success and growth of the CECT alumni community.
        </p>
      </div>

    </div>
  );
}