import React from "react";
import NavbarAlumni from "../../components/navbar-alumni";
import elementaryBg from "../../assets/elementary-bg.jpg";

export default function AlumnaAssociation() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR — HINDI TINATANGGAL */}
      <NavbarAlumni />

      {/* PAGE TITLE */}
      <div style={styles.titleSection}>
        <h1 style={styles.mainTitle}>ALUMNI ASSOCIATION</h1>
        <p style={styles.subTitle}>LIST OF OFFICERS</p>
      </div>

      {/* IMAGE SECTION */}
      <div style={styles.imageWrapper}>
        <img
          src={elementaryBg}
          alt="Elementary Department"
          style={styles.image}
        />

        <div style={styles.overlay}></div>

        <div style={styles.imageText}>
          <h2 style={styles.imageTitle}>ELEMENTARY DEPARTMENT</h2>
          <p style={styles.imageSubtitle}>
            Located across the Wesley Divinity School Apartment.
          </p>
        </div>
      </div>

      {/* OFFICERS LIST — SCROLLABLE */}
      <div style={styles.scrollContent}>
        <h3 style={styles.officerTitle}>OFFICERS</h3>

        <ul style={styles.officerList}>
          <li>President</li>
          <li>Vice President</li>
          <li>Secretary</li>
          <li>Treasurer</li>
          <li>Auditor</li>
          <li>PRO</li>
        </ul>
      </div>
    </div>
  );
}

/* INLINE STYLES */
const styles = {
  titleSection: {
    textAlign: "center",
    padding: "40px 20px",
  },
  mainTitle: {
    fontSize: "80px",
    fontWeight: "bold",
    color: "#0A3DB8",
  },
  subTitle: {
    fontSize: "40px",
    fontWeight: "bold",
    color: "#0A3DB8",
    marginTop: "8px",
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: "470px",
    marginBottom: "40px",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  imageText: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    textAlign: "center",
  },
  imageTitle: {
    fontSize: "70px",
    fontWeight: "bold",
  },
  imageSubtitle: {
    fontSize: "30px",
    marginTop: "10px",
  },
  scrollContent: {
    padding: "80px 20px",
    textAlign: "center",
  },
  officerTitle: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  officerList: {
    lineHeight: "2.2",
    listStyleType: "none",
    padding: 0,
    fontSize: "18px",
  },
};
