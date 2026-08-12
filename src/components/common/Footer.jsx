import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-content">
        <p>
          © {currentYear} <strong>Student Management System</strong>
        </p>

        <p className="footer-developer">
          Developed by <span>Hala Jabban</span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
