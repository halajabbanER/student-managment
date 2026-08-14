import { useNavigate, useParams } from "react-router-dom";

import useStudents from "../hooks/useStudents";

import "./StudentDocumentPage.css";

function StudentDocumentPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { getStudent } = useStudents();

  const student = getStudent(id);

  const issueDate = new Date().toLocaleDateString("tr-TR");

  // =========================
  // STUDENT NOT FOUND
  // =========================

  if (!student) {
    return (
      <div className="student-document-page">
        <div className="document-not-found">
          <h2>Student not found</h2>

          <button type="button" onClick={() => navigate("/academic/students")}>
            Back to Students
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // DOWNLOAD PDF
  // =========================

  const handleDownloadPDF = () => {
    window.print();
  };

  // =========================
  // PRINT
  // =========================

  const handlePrint = () => {
    window.print();
  };

  // =========================
  // PAGE
  // =========================

  return (
    <div className="student-document-page">
      {/* =====================
          TOOLBAR
      ====================== */}

      <div className="student-document-toolbar">
        <button
          type="button"
          className="document-back-btn"
          onClick={() => navigate(`/student/${student.id}`)}
        >
          ← Back
        </button>

        <div className="document-toolbar-actions">
          <button
            type="button"
            className="document-print-btn"
            onClick={handlePrint}
          >
            🖨 Print
          </button>

          <button
            type="button"
            className="document-download-btn"
            onClick={handleDownloadPDF}
          >
            📄 Download PDF
          </button>
        </div>
      </div>

      {/* =====================
          DOCUMENT
      ====================== */}

      <div className="student-document-wrapper">
        <article className="student-certificate">
          {/* HEADER */}

          <header className="certificate-header">
            <div className="certificate-logo">🎓</div>

            <div>
              <h2>Student Management System</h2>

              <p>Academic Administration</p>
            </div>
          </header>

          <div className="certificate-divider" />

          {/* TITLE */}

          <section className="certificate-title">
            <h1>ÖĞRENCİ BELGESİ</h1>

            <h2>STUDENT CERTIFICATE</h2>
          </section>

          {/* DATE */}

          <div className="certificate-date">
            <span>Belge Tarihi / Issue Date:</span>

            <strong>{issueDate}</strong>
          </div>

          {/* DESCRIPTION */}

          <p className="certificate-description">
            Aşağıda bilgileri bulunan öğrencinin üniversitemizde kayıtlı
            olduğunu gösterir öğrenci belgesidir.
          </p>

          <p className="certificate-description english">
            This document certifies that the student whose information is
            provided below is currently registered at the university.
          </p>

          {/* STUDENT INFO */}

          <section className="certificate-information">
            <div className="certificate-row">
              <span>Ad Soyad / Full Name</span>

              <strong>{student.name}</strong>
            </div>

            <div className="certificate-row">
              <span>Öğrenci No / Student ID</span>

              <strong>{student.studentId || student.id}</strong>
            </div>

            <div className="certificate-row">
              <span>E-posta / Email</span>

              <strong>{student.email || "-"}</strong>
            </div>

            <div className="certificate-row">
              <span>Bölüm / Department</span>

              <strong>{student.department || "-"}</strong>
            </div>

            <div className="certificate-row">
              <span>Sınıf / Academic Level</span>

              <strong>{student.level || "-"}</strong>
            </div>

            <div className="certificate-row">
              <span>Durum / Status</span>

              <strong
                className={
                  student.status === "Active" ? "certificate-active" : ""
                }
              >
                {student.status || "-"}
              </strong>
            </div>
          </section>

          {/* CERTIFICATE TEXT */}

          <section className="certificate-confirmation">
            <p>
              Yukarıda kimlik ve öğrenim bilgileri bulunan öğrencinin
              sistemimizde kayıtlı olduğu tasdik olunur.
            </p>

            <p>
              The student whose academic information appears above is certified
              as registered in the institution.
            </p>
          </section>

          {/* SIGNATURE */}

          <section className="certificate-signatures">
            <div>
              <div className="signature-line" />

              <strong>Öğrenci İşleri</strong>

              <span>Student Affairs</span>
            </div>

            <div>
              <div className="signature-line" />

              <strong>İmza / Kaşe</strong>

              <span>Signature / Stamp</span>
            </div>
          </section>

          {/* FOOTER */}

          <footer className="certificate-footer">
            <p>
              Bu belge Student Management System tarafından elektronik olarak
              oluşturulmuştur.
            </p>

            <p>This document was generated electronically.</p>
          </footer>
        </article>
      </div>
    </div>
  );
}

export default StudentDocumentPage;
