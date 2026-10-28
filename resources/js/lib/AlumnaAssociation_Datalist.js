import cectBg from "@/assets/cect-bg.jpg";
import cectBuilding from "@/assets/engr_dept.jpg";

// Engineering Officers
import presEngr from "@/assets/officers/pres_engr.webp";
import vpEngr from "@/assets/officers/vp_engr.webp";
import secEngr from "@/assets/officers/sec_engr.webp";
import treaEngr from "@/assets/officers/trea_engr.webp";
import proEngr from "@/assets/officers/pro_engr.webp";

// IT Officers
import presIt from "@/assets/officers/pres_it.webp";
import vpIt from "@/assets/officers/vp_it.webp";
import secIt from "@/assets/officers/sec_it.webp";
import treaIt from "@/assets/officers/trea_it.webp";
import audiIt from "@/assets/officers/audi_it.webp";
import proIt from "@/assets/officers/pro_it.webp";

/* helper */
const o = (role, name, img = null) => ({ role, name, img });

export const departments = [
  {
    title: "ELECTRONICS AND COMPUTER ENGINEERING DEPARTMENT",
    subtitle: "Located at the right wing near the main gate.",
    bg: cectBuilding,
    groups: [
      {
        name: "ELECTRONICS AND COMPUTER ENGINEERING ALUMNI ASSOCIATION OFFICERS",
        officers: [
          o("President", "Engr. Ralph Lery Guerrero", presEngr),
          o("Vice President", "Engr. Jazmine Liberty Tumibay", vpEngr),
          o("Secretary", "Engr. Wenceslao Gabriel", secEngr),
          o("Treasurer", "Engr. Jason Santos", treaEngr),
          o("Auditor", "Engr. Carlos Martin"),
          o("PRO", "Engr. Ezekiel Arceo", proEngr),
        ],
      },
    ],
  },
  {
    title: "INFORMATION TECHNOLOGY DEPARTMENT",
    subtitle: "Located on the 2nd floor.",
    bg: cectBg,
    groups: [
      {
        name: "INFORMATION TECHNOLOGY ALUMNI ASSOCIATION OFFICERS",
        officers: [
          o("President", "Prof. Prince Mert O. Nicolas", presIt),
          o("Vice President", "Ms. Kristine J. Ruma", vpIt),
          o("Secretary", "Crystalyn V. Macapagal", secIt),
          o("Treasurer", "Jonathan B. Torres", treaIt),
          o("Auditor", "Christian R. Pangan", audiIt),
          o("PRO", "Prof. Patrick Jason Oanes", proIt),
        ],
      },
    ],
  },
];