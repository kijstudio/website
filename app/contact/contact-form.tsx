"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

type FieldName = "name" | "email" | "phone" | "type" | "message";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s-]{6,}$/;

function makeRef() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `KS-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${rand}`;
}

function encodeForm(data: Record<string, string>) {
  return Object.keys(data)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
    )
    .join("&");
}

export default function ContactForm() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    type: "",
    message: "",
  });
  const [invalid, setInvalid] = useState<Record<FieldName, boolean>>({
    name: false,
    email: false,
    phone: false,
    type: false,
    message: false,
  });
  const [consentInvalid, setConsentInvalid] = useState(false);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [ref] = useState(makeRef);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const firstInvalidRef = useRef<FieldName | "consent" | null>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(44, el.scrollHeight)}px`;
  }, [values.message]);

  function validateField(field: FieldName, value: string): boolean {
    if (field === "phone") {
      // Phone is optional
      return !value.trim() || PHONE_RE.test(value.trim());
    }
    if (!value.trim()) return false;
    if (field === "email") return EMAIL_RE.test(value.trim());
    return true;
  }

  function handleBlur(field: FieldName) {
    const ok = validateField(field, values[field]);
    setInvalid((prev) => ({ ...prev, [field]: !ok }));
  }

  function handleChange(field: FieldName, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setInvalid((prev) =>
      prev[field] ? { ...prev, [field]: !validateField(field, value) } : prev
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fields: FieldName[] = ["name", "email", "type", "message", "phone"];
    const nextInvalid = { ...invalid };
    let firstBad: FieldName | "consent" | null = null;

    fields.forEach((field) => {
      const ok = validateField(field, values[field]);
      nextInvalid[field] = !ok;
      if (!ok && !firstBad) firstBad = field;
    });

    let nextConsentInvalid = false;
    if (!consent) {
      nextConsentInvalid = true;
      if (!firstBad) firstBad = "consent";
    }

    setInvalid(nextInvalid);
    setConsentInvalid(nextConsentInvalid);

    if (firstBad) {
      firstInvalidRef.current = firstBad;
      return;
    }

    setStatus("sending");

    const payload = {
      "form-name": "contact",
      ref,
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      type: values.type,
      message: values.message.trim(),
    };

    try {
      const res = await fetch("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeForm(payload),
      });
      if (!res.ok) throw new Error("Submission failed");
      setStatus("done");
    } catch {
      // Fall back to a real (non-AJAX) submit so Netlify still receives it
      // and the visitor lands on /contact/thank-you.
      e.currentTarget.submit();
    }
  }

  useEffect(() => {
    if (!firstInvalidRef.current) return;
    const field = firstInvalidRef.current;
    firstInvalidRef.current = null;
    const el = document.getElementById(
      field === "consent" ? "rodo" : field
    ) as HTMLElement | null;
    el?.focus();
  }, [invalid, consentInvalid]);

  if (status === "done") {
    return (
      <div className={styles.done}>
        <p className={styles.eyebrow}>Enquiry received</p>
        <h1 className={styles.h1}>
          Thank you.
          <br />
          Your message is on its way.
        </h1>
        <p className={styles.intro}>
          We&apos;ll get back to you with a first estimate and timeline
          within one business day.
        </p>
        <p className={styles.ref}>
          Ref <span>{ref}</span> &nbsp;&middot;&nbsp;{" "}
          <a href="mailto:info@kijstudio.com" className={styles.refEmail}>
            info@kijstudio.com
          </a>
        </p>
      </div>
    );
  }

  return (
    <form
      name="contact"
      method="POST"
      action="/contact/thank-you"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      noValidate
      className={styles.form}
    >
      {/* Required for Netlify's build-time form detection */}
      <input type="hidden" name="form-name" value="contact" />
      <input type="hidden" name="ref" value={ref} />
      <p className={styles.honeypot} aria-hidden="true">
        <label>
          Don&apos;t fill this out if you&apos;re human:
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <p className={styles.eyebrow}>Start a project</p>
      <h1 className={styles.h1}>
        Let&apos;s bring your
        <br />
        space to life.
      </h1>
      <p className={styles.intro}>
        Tell us about your project — a single render, a full interior, or a
        film. We usually reply within one business day.
      </p>

      <div
        className={`${styles.field} ${styles.fieldFull} ${invalid.name ? styles.invalid : ""}`}
      >
        <label htmlFor="name">
          Name <span className={styles.req}>*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          required
          value={values.name}
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={() => handleBlur("name")}
        />
        <div className={styles.err}>Please enter your name.</div>
      </div>

      <div className={styles.row}>
        <div className={`${styles.field} ${invalid.email ? styles.invalid : ""}`}>
          <label htmlFor="email">
            Email <span className={styles.req}>*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
          />
          <div className={styles.err}>Enter a valid email.</div>
        </div>
        <div className={`${styles.field} ${invalid.phone ? styles.invalid : ""}`}>
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Optional"
            value={values.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            onBlur={() => handleBlur("phone")}
          />
          <div className={styles.err}>Check the phone number.</div>
        </div>
      </div>

      <div
        className={`${styles.field} ${styles.fieldFull} ${styles.fieldTypeGap} ${invalid.type ? styles.invalid : ""}`}
      >
        <label htmlFor="type">
          Project type <span className={styles.req}>*</span>
        </label>
        <div className={styles.selectWrap}>
          <select
            id="type"
            name="type"
            required
            value={values.type}
            onChange={(e) => handleChange("type", e.target.value)}
            onBlur={() => handleBlur("type")}
          >
            <option value="" disabled>
              Select…
            </option>
            <option>3D Visualization</option>
            <option>Interior Design</option>
            <option>Interior + Visualization</option>
            <option>Film / AI Animation</option>
            <option>Other</option>
          </select>
        </div>
        <div className={styles.err}>Please choose a project type.</div>
      </div>

      <div
        className={`${styles.field} ${styles.fieldFull} ${invalid.message ? styles.invalid : ""}`}
      >
        <label htmlFor="message">
          Message <span className={styles.req}>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={1}
          ref={textareaRef}
          placeholder="Area, location, timeline, scope, reference links — the more detail, the sharper the quote."
          required
          value={values.message}
          onChange={(e) => handleChange("message", e.target.value)}
          onBlur={() => handleBlur("message")}
        />
        <div className={styles.err}>Tell us a little about the project.</div>
      </div>

      <div
        className={`${styles.consent} ${consentInvalid ? styles.invalid : ""}`}
      >
        <input
          id="rodo"
          name="rodo"
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            if (e.target.checked) setConsentInvalid(false);
          }}
        />
        <label htmlFor="rodo">
          I agree to the processing of my personal data by KIJ Studio to
          respond to this enquiry, in line with GDPR.{" "}
          <span className={styles.req}>*</span>
        </label>
      </div>
      {consentInvalid && (
        <div className={styles.consentErr}>
          Consent is required to send the enquiry.
        </div>
      )}

      <button
        type="submit"
        className={styles.submit}
        disabled={status === "sending"}
      >
        <span>{status === "sending" ? "Sending…" : "Send enquiry"}</span>
        <span className={styles.arr} aria-hidden="true">
          →
        </span>
      </button>
    </form>
  );
}
