import cectBg from "@/assets/cect-bg.jpg";

/* helper */
const o = (role, name) => ({ role, name });

export const departments = [
  {
    title: "COLLEGE OF ENGINEERING AND TECHNOLOGY",
    subtitle: "Located on the 2nd floor.",
    bg: cectBg,
    groups: [
      {
        name: "ELECTRONICS AND COMPUTER ENGINEERING",
        officers: [
          o("President", "Engr. Ralph Lery Guerrero"),
          o("Vice President", "Engr. Jazmine Liberty Tumibay"),
          o("Secretary", "Engr. Wenceslao Gabriel"),
          o("Treasurer", "Engr. Jason Santos"),
          o("Auditor", "Engr. Carlos Martin"),
          o("PRO", "Engr. Ezekiel Arceo"),
        ],
      },
      {
        name: "INFORMATION TECHNOLOGY",
        officers: [
          o("President", "Prof. Prince Mert O. Nicolas"),
          o("Vice President", "Ms. Kristine J. Ruma"),
          o("Secretary", "Crystalyn V. Macapagal"),
          o("Treasurer", "Jonathan B. Torres"),
          o("Auditor", "Christian R. Pangan"),
          o("PRO", "Prof. Patrick Jason Oanes"),
        ],
      },
    ],
  },
];