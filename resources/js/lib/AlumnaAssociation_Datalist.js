import elementaryBg from "@/assets/elementary-bg.jpg";
import highschoolBg from "@/assets/highschool-bg.jpg";
import graduateBg from "@/assets/graduate-bg.jpg";
import tourismBg from "@/assets/tourism-management-bg.jpg";
import lawBg from "@/assets/law-bg.jpg";
import nursingBg from "@/assets/nursing-bg.jpg";
import cbaBg from "@/assets/cba-bg.jpg";
import cectBg from "@/assets/cect-bg.jpg";
import educationBg from "@/assets/education-bg.jpg";
import criminaljusticeBg from "@/assets/criminal-justice-bg.jpg";

export const departments = [
  { title: "ELEMENTARY DEPARTMENT", subtitle: "Wesley Divinity School", bg: elementaryBg },
  { title: "HIGHSCHOOL DEPARTMENT", subtitle: "Wesley Divinity School", bg: highschoolBg },
  { title: "GRADUATE SCHOOL", subtitle: "Wesley Divinity School", bg: graduateBg },
  { title: "JOHN WESLEY SCHOOL OF LAW AND GOVERNANCE", subtitle: "Wesley Divinity School", bg: lawBg },
  { title: "COLLEGE OF NURSING", subtitle: "Wesley Divinity School", bg: nursingBg },
  { title: "COLLEGE OF ALLIED MEDICAL SCIENCES", subtitle: "Wesley Divinity School", bg: cectBg },
  { title: "COLLEGE OF BUSINESS AND ACCOUNTANCY", subtitle: "Wesley Divinity School", bg: cbaBg },
  { 
    title: "COLLEGE OF ENGINEERING AND TECHNOLOGY", 
    subtitle: "Wesley Divinity School", 
    bg: cectBg,
    groups: [
      { name: "ENGINEERING", officers: ["President","Vice President","Secretary","Treasurer","Auditor","PRO"] },
      { name: "INFORMATION TECHNOLOGY", officers: ["President","Vice President","Secretary","Treasurer","Auditor","PRO"] },
    ]
  },
  { title: "COLLEGE OF ARTS AND SCIENCES", subtitle: "Wesley Divinity School", bg: cbaBg },
  { title: "COLLEGE OF EDUCATION", subtitle: "Wesley Divinity School", bg: educationBg },
  { title: "COLLEGE OF CRIMINAL JUSTICE EDUCATION", subtitle: "Wesley Divinity School", bg: criminaljusticeBg },
  { title: "COLLEGE OF HOSPITALITY AND TOURISM MANAGEMENT", subtitle: "Wesley Divinity School", bg: tourismBg },
];
