import { memo, useCallback } from "react";
import footerlogo from "../../../assets/footerlogo.png";
import "./Footer.css";

const Footer = memo(() => {
  const year = new Date().getFullYear();

  const openRefundPolicy = useCallback(() => {
    window.open(
      "../../../assets/privacy policy.pdf",
      "_blank",
      "noopener,noreferrer"
    );
  }, []);

  return (
    <>
      <div className="Footer">
        <img
          className="FooterLogo"
          src={footerlogo}
          alt="Footer Logo"
          loading="lazy"
        />

        <span className="CopyRightsText">
          COPYRIGHT &copy; {year} DTD - AutoML Ainshams class 2026
        </span>

        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <span
            className="CopyRightsText"
            style={{ cursor: "pointer" }}
            onClick={openRefundPolicy}
          >
            Privacy Policy
          </span>
        </div>
      </div>
    </>
  );
});

export default Footer;
