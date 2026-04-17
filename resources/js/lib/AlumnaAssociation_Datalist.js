import elementaryBg from "@/assets/elementary-bg.jpg";
import highschoolBg from "@/assets/highschool-bg.jpg";
import graduateBg from "@/assets/graduate-bg.jpg";
import tourismBg from "@/assets/tourism-management-bg.jpg";
import lawBg from "@/assets/law-bg.jpg";
import nursingBg from "@/assets/nursing-bg.jpg";
import cbaBg from "@/assets/cba-bg.jpg";
import cectBg from "@/assets/cect-bg.jpg";
import wesleyBg from "@/assets/wesley-bg.jpg";
import educationBg from "@/assets/education-bg.jpg";
import criminaljusticeBg from "@/assets/criminal-justice-bg.jpg";

/* helper */
const o = (role, name) => ({ role, name });

export const departments = [
  {
    title: "ELEMENTARY DEPARTMENT",
    subtitle: "Located across the Wesley Divinity School Apartment.",
    bg: elementaryBg,
    officers: [
      o("President", "Mr. Renato N. Ramirez"),
      o("Vice President", "Mr. Jose J. Pangilinan"),
      o("Secretary", "Ms. Elia Joy S. Villacorta"),
      o("Treasurer", "Ms. Enrica S. Franciscoeva"),
      o("Auditor", "Mr. Rudell De Guzman"),
      o("PRO", "Ms. Teresa M. Dulay"),
      o("PRO", "Ms. Susan S. Carpio"),
      o("PRO (SHARE)", "Mr. Jaron Kenneth R. Valdez"),
      o("PRO (CCD)", "Ms. Krizna R. Salmos"),
    ],
  },

  {
    title: "HIGHSCHOOL DEPARTMENT",
    subtitle: "Located across the Computer Science Building",
    bg: highschoolBg,
    officers: [
      o("President", "Ms. Enrica S. Francisco"),
      o("Vice President", "Dr. Emma V. Villaroman"),
      o("Secretary", "Mr. Racquel P. Dela Cruz"),
      o("Treasurer", "Ms. Susan C. Fajardo"),
      o("Auditor", "Ms. Elenita A. Peralta"),
      o("PRO", "Ms. Anita L. Cruz"),
      o("PRO", "Ms. Ma. Linda Dayao"),
    ],
  },

  {
    title: "WESLEY DIVINITY SCHOOL",
    subtitle: "Located on the SHS building.",
    bg: wesleyBg,
    officers: [
      o("President", "Rev. Efren Reyes"),
      o("Vice President", "Rev. Dr. Francis Fajardo"),
      o("Secretary", "Rev. Dr. Jayson Andrew Mallari"),
      o("Treasurer", "Rev. Mark Kevin Nebran"),
      o("Auditor", "Rev. Felecita Dela Cruz"),
    ],
  },

  {
    title: "GRADUATE SCHOOL",
    subtitle: "Located on the 2nd floor of SHS Building.",
    bg: graduateBg,
    officers: [
      o("President", "Mr. Richard Pletado"),
      o("Vice President", "Ms. Riza Fausto"),
      o("Secretary", "Mr. Apolinar Alfonso"),
      o("Treasurer", "Ms. Maureen Bondoc"),
      o("Auditor", "No endorsement"),
      o("PRO", "Ms. Jamie Christopher Valmonte"),
      o("PRO", "Ms. Rose Ann Curioso"),
    ],
  },

  {
    title: "JOHN WESLEY SCHOOL OF LAW AND GOVERNANCE",
    subtitle: "Located on the 3rd floor.",
    bg: lawBg,
    officers: [
      o("President", "Atty. Jan Kenrick Z. Sagum"),
      o("Vice President", "Atty. Reina Micah C. Mones"),
      o("Secretary", "Mr. Mark Joshua B. Yamazaki"),
      o("Treasurer", "Mr. Karl Daniel G. Cabilla"),
      o("Auditor", "Mr. Percival R. Tabor"),
      o("PRO", "Mr. Oliver O. Gaoat"),
      o("PRO", "Atty. Solimar A. Catacutan"),
    ],
  },

  {
    title: "COLLEGE OF NURSING",
    subtitle: "Located beside the auditorium.",
    bg: nursingBg,
    officers: [
      o("President", "Dr. Emma V. Villaroman"),
      o("Vice President", "Mr. Christian Manuel V. Ramos"),
      o("Secretary", "Dr. Wilfredo C. Ramos"),
      o("Treasurer", "Prof. Karmela C. Del Rosario"),
      o("Auditor", "Prof. Leover T. Caranto"),
      o("PRO", "Prof. Mariz E. Benico"),
      o("PRO", "Prof. Ma. Ericka D. Lapuz"),
    ],
  },

  {
    title: "COLLEGE OF ALLIED MEDICAL SCIENCES",
    subtitle: "Located on the 3rd floor.",
    bg: cectBg,
    officers: [
      o("President", "Ms. Karen S. Gumabon"),
      o("Vice President", "Ms. Jullana Mae S. Magtalas"),
      o("Secretary", "Ms. Jennifer O. Garcia"),
      o("Assistant Secretary", "Mr. John Michael S. Casison"), // fixed duplicate role
      o("Treasurer", "Ms. Renalou B. Cordova"),
      o("Auditor", "Mr. Kevin Patrick M. Santos"),
      o("PRO", "Mr. Paolo Hans P. Oanes"),
      o("PRO", "Mr. Rolly N. Rayo"),
    ],
  },

  {
    title: "COLLEGE OF BUSINESS AND ACCOUNTANCY",
    subtitle: "Located on the 4th floor.",
    bg: cbaBg,
    officers: [
      o("President", "Mr. Marlbert Del Rosario"),
      o("Vice President", "Mrs. Luzvimind Bondoc"),
      o("Secretary", "Mr. Rolando C. Iniwan"),
      o("Treasurer", "Mrs. Joan Marie S. Tuazon"),
      o("Auditor", "Mr. Jelwin Bautista"),
      o("PRO", "Mrs. Arlynn T. Martinez"),
      o("PRO", "Mr. Sirajy Murad"),
    ],
  },

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

  {
    title: "COLLEGE OF ARTS AND SCIENCES",
    subtitle: "Located on the 2nd floor.",
    bg: cbaBg,
    officers: [
      o("President", "Mr. King Patrick R. Gavino"),
      o("Vice President", "Ms. Ezra Mae Dimapawi"),
      o("Secretary", "Mr. Emmanuel John R. Pangan"), // typo fixed
      o("Treasurer", "Ms. Mildred G. Abiva"),
      o("Auditor", "Mr. Levy Richard B. Isidro"),
      o("PRO", "Mr. Melchor Tolentino"),
      o("PRO", "Ms. Nica Gregorio"),
    ],
  },

  {
    title: "COLLEGE OF EDUCATION",
    subtitle: "Located on the 1st floor.",
    bg: educationBg,
    officers: [
      o("President", "Ms. Carolina M. Santos"),
      o("Vice President", "Ms. Mercy P. Cariaga"),
      o("Secretary", "Mr. Mark Denisse A. De Jesus"),
      o("Treasurer", "Ms. Jamaica R. Valdez"),
      o("Auditor", "Mr. Karl S. Bernarte"),
      o("PRO", "Ms. Lily Abiog"),
      o("PRO", "Ms. Jane D. Santelices"),
    ],
  },

  {
    title: "COLLEGE OF CRIMINAL JUSTICE EDUCATION",
    subtitle: "Located on the 4th floor.",
    bg: criminaljusticeBg,
    officers: [
      o("President", "PCPT Noel B. Manalastas"),
      o("Vice President", "PCPT Orlando M. Garcia Jr."),
      o("Secretary", "Prof. Maricel C. Coleco"),
      o("Treasurer", "Mr. Genesis M. Tinio"),
      o("Auditor", "Mr. Heherson M. Bedron"),
      o("PRO", "PCPL Mark Christian P. Morales"),
      o("PRO", "Mr. Allen Caguiat"),
    ],
  },

  {
    title: "COLLEGE OF HOSPITALITY AND TOURISM MANAGEMENT",
    subtitle: "Located across the food court.",
    bg: tourismBg,
    officers: [
      o("President", "Mr. Marcos M. Trinidad"),
      o("Vice President", "Mrs. Kimberly Magtalapa-Carbonel"),
      o("Secretary", "Mrs. Vi Ann Cielo D. Alcantara"),
      o("Treasurer", "Mr. Kristian Marlou Abiog"),
      o("Auditor", "Mr. Jefty E. Segismundo"),
      o("PRO", "Ms. Mikaela Lomingkit"),
      o("PRO", "Mr. Catalino Simpliciano"),
    ],
  },
];