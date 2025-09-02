import React from "react";

function Settings() {
  return (
    <div>
      <h3>Settings</h3>
      <div className="mb-3">
        <label>Language</label>
        <select className="form-select" style={{ maxWidth: "200px" }}>
          <option>English</option>
          <option>Hindi</option>
        </select>
      </div>
      <div className="form-check">
        <input className="form-check-input" type="checkbox" id="darkMode" />
        <label className="form-check-label" htmlFor="darkMode">Enable Dark Mode</label>
      </div>
    </div>
  );
}

export default Settings;
