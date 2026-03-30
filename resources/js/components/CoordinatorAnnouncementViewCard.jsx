import React from "react";
import homecoming from "@/assets/homecoming.png";

export default function CoordinatorAnnouncementViewCard() {
  return (
    <div className="w-full space-y-6">

      {/* LEFT SIDE: TITLE + DATE ABOVE IMAGE */}
      <div className="flex flex-col items-center md:items-start space-y-4">

        {/* TITLE + DATE */}
        <div className="text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-1">
            CECT ALUMNI HOMECOMING 2025
          </h1>
          <p className="text-gray-600">
            February 20, 2025 • 8:11 PM
          </p>
        </div>

        {/* IMAGE */}
        <div className="flex justify-center w-full">
          <img
            src={homecoming}
            alt="Homecoming"
            className="w-full max-w-md sm:max-w-lg md:max-w-xl object-cover rounded-md shadow"
          />
        </div>

      </div>

      {/* DESCRIPTION (FULL WIDTH) */}
      <div className="text-gray-800 leading-relaxed text-justify text-sm sm:text-base space-y-4">
        <p>
          The College of Engineering and Computer Technology (CECT) of
          Wesleyan University–Philippines is pleased to announce the upcoming
          CECT Alumni Homecoming 2025, which will be held on March 15, 2025
          (Saturday) at 6:00 PM at the Wesleyan University–Philippines
          Gymnasium, Cabanatuan City.
        </p>

        <p>
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