import { useState } from "react";

export default function BirthForm({ onSubmit }) {
  const [form, setForm] = useState({ name: "", date: "", time: "", place: "" });
  const [errors, setErrors] = useState({});

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.date) errs.date = "Date of birth is required";
    if (!form.time) errs.time = "Time of birth is required";
    if (!form.place.trim()) errs.place = "Place of birth is required";
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit(form);
  }

  return (
    <div className="birth-form">
      <h2>Tell me about your birth</h2>
      <p className="subtitle">I need these details to read your chart accurately.</p>
      <form onSubmit={handleSubmit}>
        {["name", "date", "time", "place"].map((field) => (
          <div key={field} className="field">
            <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              id={field}
              type={field === "date" ? "date" : field === "time" ? "time" : "text"}
              placeholder={field === "place" ? "e.g. Mumbai, India" : ""}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
            {errors[field] && <span className="err">{errors[field]}</span>}
          </div>
        ))}
        <button type="submit">Begin Reading ✦</button>
      </form>
    </div>
  );
}
