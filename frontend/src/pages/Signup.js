import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ThemeLangContext } from "../ThemeLangContext";

function Signup() {
  const navigate = useNavigate();
  const { signup, login } = useAuth();
  const { theme } = useContext(ThemeLangContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 6) strength += 25;
    if (pwd.length >= 8) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9!@#$%^&*]/.test(pwd)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    setPasswordStrength(calculatePasswordStrength(pwd));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const result = await signup(email, password);

    if (result.success) {
      const loginResult = await login(email, password);
      if (loginResult.success) {
        navigate("/dashboard");
      } else {
        setError("Account created! Please login.");
        navigate("/login");
      }
    } else {
      setError(result.message || "Signup failed");
    }

    setLoading(false);
  };

  const pageStyle = {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "70px",
    background:
      theme === "dark"
        ? "radial-gradient(circle at 10% 10%, #1d2f6d 0%, #0b1231 38%, #03070f 83%)"
        : "radial-gradient(circle at 10% 10%, #f5f7ff 0%, #e5e9fb 35%, #cfd8f9 80%)",
    padding: "70px 16px 16px 16px",
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden",
  };

  const blobStyle = {
    position: "absolute",
    borderRadius: "50%",
    opacity: 0.1,
    animation: "float 15s infinite ease-in-out",
  };

  const cardStyle = {
    background:
      theme === "dark"
        ? "rgba(15, 15, 15, 0.7)"
        : "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(30px)",
    borderRadius: "20px",
    border:
      theme === "dark"
        ? "1px solid rgba(148, 163, 184, 0.15)"
        : "1px solid rgba(148, 163, 184, 0.2)",
    padding: "50px 40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow:
      theme === "dark"
        ? "0 20px 60px rgba(0, 0, 0, 0.4)"
        : "0 20px 60px rgba(79, 70, 229, 0.15)",
    position: "relative",
    zIndex: 10,
    animation: "slideInUp 0.6s ease-out",
  };

  const animationStyles = `
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(20px); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;

  const titleStyle = {
    fontSize: "36px",
    fontWeight: "900",
    marginBottom: "12px",
    background: "linear-gradient(135deg, #4f46e5, #8b5cf6, #ec4899)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
    letterSpacing: "-0.5px",
    animation: "slideInUp 0.8s ease-out",
  };

  const subtitleStyle = {
    textAlign: "center",
    color: theme === "dark" ? "#cbd5e1" : "#64748b",
    marginBottom: "40px",
    fontSize: "15px",
    fontWeight: "500",
    animation: "slideInUp 1s ease-out",
  };

  const formGroupStyle = {
    marginBottom: "22px",
    animation: "slideInUp 1.2s ease-out",
  };

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "10px",
    color: theme === "dark" ? "#e2e8f0" : "#334155",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const iconStyle = {
    marginRight: "8px",
    fontSize: "16px",
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    border:
      focusedField === "email"
        ? "2px solid #4f46e5"
        : theme === "dark"
        ? "1.5px solid rgba(148, 163, 184, 0.2)"
        : "1.5px solid rgba(148, 163, 184, 0.3)",
    borderRadius: "12px",
    background: theme === "dark"
      ? "rgba(30, 30, 30, 0.8)"
      : "rgba(255, 255, 255, 0.7)",
    color: theme === "dark" ? "#ffffff" : "#000000",
    fontSize: "15px",
    boxSizing: "border-box",
    outline: "none",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    backdropFilter: "blur(10px)",
  };

  const passwordStyle = {
    ...inputStyle,
    border:
      focusedField === "password"
        ? "2px solid #4f46e5"
        : theme === "dark"
        ? "1.5px solid rgba(148, 163, 184, 0.2)"
        : "1.5px solid rgba(148, 163, 184, 0.3)",
  };

  const confirmPasswordStyle = {
    ...inputStyle,
    border:
      focusedField === "confirmPassword"
        ? "2px solid #4f46e5"
        : theme === "dark"
        ? "1.5px solid rgba(148, 163, 184, 0.2)"
        : "1.5px solid rgba(148, 163, 184, 0.3)",
  };

  const strengthBarStyle = {
    height: "6px",
    background: theme === "dark"
      ? "rgba(148, 163, 184, 0.2)"
      : "rgba(148, 163, 184, 0.2)",
    borderRadius: "3px",
    marginTop: "6px",
    overflow: "hidden",
  };

  const strengthFillStyle = {
    height: "100%",
    background:
      passwordStrength <= 25
        ? "#ef4444"
        : passwordStrength <= 50
        ? "#f59e0b"
        : passwordStrength <= 75
        ? "#3b82f6"
        : "#10b981",
    width: `${passwordStrength}%`,
    transition: "all 0.3s ease",
  };

  const strengthTextStyle = {
    fontSize: "12px",
    marginTop: "6px",
    fontWeight: "600",
    color:
      passwordStrength <= 25
        ? "#ef4444"
        : passwordStrength <= 50
        ? "#f59e0b"
        : passwordStrength <= 75
        ? "#3b82f6"
        : "#10b981",
  };

  const buttonStyle = {
    width: "100%",
    padding: "14px 16px",
    background: loading
      ? "linear-gradient(90deg, #4f46e5, #8b5cf6)"
      : "linear-gradient(135deg, #4f46e5 0%, #8b5cf6 50%, #ec4899 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.8 : 1,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    marginBottom: "20px",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(79, 70, 229, 0.3)",
    letterSpacing: "0.5px",
    animation: "slideInUp 1.6s ease-out",
  };

  const errorStyle = {
    background: theme === "dark"
      ? "rgba(239, 68, 68, 0.15)"
      : "rgba(239, 68, 68, 0.1)",
    color: "#ef4444",
    padding: "14px 16px",
    borderRadius: "12px",
    fontSize: "14px",
    marginBottom: "20px",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    animation: "slideInUp 0.4s ease-out",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const linkStyle = {
    textAlign: "center",
    fontSize: "14px",
    color: theme === "dark" ? "#cbd5e1" : "#64748b",
    animation: "slideInUp 1.8s ease-out",
  };

  const linkAnchorStyle = {
    color: "#4f46e5",
    textDecoration: "none",
    fontWeight: "700",
    cursor: "pointer",
    backgroundImage: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  const spinnerStyle = {
    display: "inline-block",
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid #ffffff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    marginRight: "8px",
  };

  return (
    <div style={pageStyle}>
      <style>{animationStyles}</style>

      {/* Decorative blobs */}
      <div
        style={{
          ...blobStyle,
          width: "400px",
          height: "400px",
          background: "#8b5cf6",
          top: "-100px",
          left: "-100px",
        }}
      />
      <div
        style={{
          ...blobStyle,
          width: "300px",
          height: "300px",
          background: "#4f46e5",
          bottom: "-50px",
          right: "-50px",
        }}
      />

      <div style={cardStyle}>
        <h1 style={titleStyle}>Create Account</h1>
        <p style={subtitleStyle}>Join CyberSaarthi for email & invoice security</p>

        {error && (
          <div style={errorStyle}>
            <span>⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              <span style={iconStyle}>✉️</span>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              placeholder="your@email.com"
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              <span style={iconStyle}>🔐</span>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              placeholder="••••••••"
              style={passwordStyle}
            />
            {password && (
              <>
                <div style={strengthBarStyle}>
                  <div style={strengthFillStyle} />
                </div>
                <div style={strengthTextStyle}>
                  {passwordStrength <= 25 && "Weak"}
                  {passwordStrength > 25 && passwordStrength <= 50 && "Fair"}
                  {passwordStrength > 50 && passwordStrength <= 75 && "Good"}
                  {passwordStrength > 75 && "Strong"}
                </div>
              </>
            )}
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              <span style={iconStyle}>✓</span>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setFocusedField("confirmPassword")}
              onBlur={() => setFocusedField(null)}
              placeholder="••••••••"
              style={confirmPasswordStyle}
            />
            {password && confirmPassword && password === confirmPassword && (
              <div style={{ fontSize: "12px", color: "#10b981", marginTop: "6px", fontWeight: "600" }}>
                ✓ Passwords match
              </div>
            )}
          </div>

          <button
            type="submit"
            style={buttonStyle}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow =
                  "0 15px 40px rgba(79, 70, 229, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 10px 30px rgba(79, 70, 229, 0.3)";
            }}
          >
            {loading && <span style={spinnerStyle} />}
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div style={linkStyle}>
          Already have an account?{" "}
          <Link to="/login" style={linkAnchorStyle}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
