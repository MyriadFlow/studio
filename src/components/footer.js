import React, { useState, useEffect } from "react";
import Link from "next/link";

const Footer = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth > 768 && window.innerWidth <= 1024);
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const footerStyle = {
    background: "linear-gradient(90deg, #30D8FF 0%, #A32CC4 50%, #C243FE 100%)",
    padding: isMobile ? "20px" : isTablet ? "30px 40px" : "40px 60px",
  };

  const sectionStyle = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    justifyContent: "space-between",
    alignItems: isMobile ? "flex-start" : "flex-start",
    gap: isMobile ? "40px" : "20px",
  };

  const brandStyle = {
    textAlign: "left",
    width: isMobile ? "100%" : isTablet ? "30%" : "auto",
  };

  const logoStyle = {
    width: isMobile ? "150px" : "200px",
    height: "auto",
    marginBottom: "20px",
  };

  const descriptionStyle = {
    color: "white",
    maxWidth: isMobile ? "100%" : "350px",
    fontSize: "14px",
  };

  const copyrightStyle = {
    marginTop: "30px",
    color: "white",
    fontSize: "14px",
  };

  const linksContainerStyle = {
    textAlign: "left",
    color: "white",
    fontSize: "14px",
    width: isMobile ? "100%" : isTablet ? "30%" : "auto",
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    display: "block",
    marginTop: "12px",
    fontSize: "15px",
  };

  const socialLinksStyle = {
    display: "flex",
    justifyContent: isMobile ? "flex-start" : "flex-end",
    gap: "20px",
    flexWrap: "wrap",
    width: isMobile ? "100%" : "auto",
    marginTop: isMobile ? "20px" : "0",
  };

  const socialIconStyle = {
    borderRadius: "50%",
    border: "2px solid #0E46A3",
    padding: isMobile ? "12px" : "16px",
    backgroundColor: "#15063C",
  };

  return (
    <div>
      <footer style={footerStyle}>
        <section style={sectionStyle}>
          <div className="brand" style={brandStyle}>
            <Link href="https://myriadflow.com/" passHref>
              <img src="/images/MFlogo.png" style={logoStyle} alt="logo" />
            </Link>
            <p style={descriptionStyle}>
              Innovative next-gen platform for exploring and launching NFT
              Xperiences with AI-powered brand ambassadors and no-code tools.
            </p>
            <p style={copyrightStyle}>
              © Copyright 2024 MyriadFlow. All rights reserved
            </p>
          </div>

          {(!isMobile || isTablet) && (
            <>
              <div className="links" style={linksContainerStyle}>
                <h3 className="text-2xl font-semibold">About</h3>
                <Link
                  href="https://discover.myriadflow.com/guide"
                  target="_blank"
                  style={{ ...linkStyle, marginTop: "28px" }}
                >
                  Guide
                </Link>
                <Link
                  href="/MyriadFlow_Terms_of_Service.pdf"
                  target="_blank"
                  style={linkStyle}
                >
                  Terms of Service
                </Link>
                <Link
                  href="/MyriadFlow_Creator_Terms_and_Conditions.pdf"
                  target="_blank"
                  style={linkStyle}
                >
                  Creator Terms and Conditions
                </Link>
                <Link
                  href="/MyriadFlow_Privacy_Policy.pdf"
                  target="_blank"
                  style={linkStyle}
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/MyriadFlow_Community_Guidelines.pdf"
                  target="_blank"
                  style={linkStyle}
                >
                  Community Guidelines
                </Link>
              </div>

              <div className="platform" style={linksContainerStyle}>
                <h3 className="text-2xl font-semibold">Platform</h3>
                <Link
                  href="https://studio.myriadflow.com"
                  style={{ ...linkStyle, marginTop: "28px" }}
                >
                  Studio
                </Link>
                <Link href="https://discover.myriadflow.com" style={linkStyle}>
                  Discover
                </Link>
                <Link href="https://webxr.myriadflow.com" style={linkStyle}>
                  WebXR
                </Link>
              </div>
            </>
          )}

          <section
            id="connect"
            className="social-links"
            style={socialLinksStyle}
          >
            {[
              "/images/Vector3.png",
              "/images/Vector4.png",
              "/images/Vector2.png",
              "/images/Vector5.png",
            ].map((icon, index) => (
              <div key={index} style={socialIconStyle}>
                <Link href="#" target="_blank">
                  <img
                    src={icon}
                    width={isMobile ? 16 : 20}
                    height={isMobile ? 16 : 20}
                    alt="Social Icon"
                  />
                </Link>
              </div>
            ))}
          </section>
        </section>

        {isMobile && (
          <div style={{ marginTop: "40px", display: "flex", gap: "40px" }}>
            <div className="links" style={linksContainerStyle}>
              <h3 className="text-2xl font-semibold">About</h3>
              <Link
                href="https://discover.myriadflow.com/guide"
                target="_blank"
                style={{ ...linkStyle, marginTop: "28px" }}
              >
                Guide
              </Link>
              <Link
                href="/MyriadFlow_Terms_of_Service.pdf"
                target="_blank"
                style={linkStyle}
              >
                Terms of Service
              </Link>
              <Link
                href="/MyriadFlow_Creator_Terms_and_Conditions.pdf"
                target="_blank"
                style={linkStyle}
              >
                Creator Terms and Conditions
              </Link>
              <Link
                href="/MyriadFlow_Privacy_Policy.pdf"
                target="_blank"
                style={linkStyle}
              >
                Privacy Policy
              </Link>
              <Link
                href="/MyriadFlow_Community_Guidelines.pdf"
                target="_blank"
                style={linkStyle}
              >
                Community Guidelines
              </Link>
            </div>

            <div className="platform" style={linksContainerStyle}>
              <h3 className="text-2xl font-semibold">Platform</h3>
              <Link
                href="https://studio.myriadflow.com"
                style={{ ...linkStyle, marginTop: "28px" }}
              >
                Studio
              </Link>
              <Link href="https://discover.myriadflow.com" style={linkStyle}>
                Discover
              </Link>
              <Link href="https://webxr.myriadflow.com" style={linkStyle}>
                WebXR
              </Link>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
};

export default Footer;
