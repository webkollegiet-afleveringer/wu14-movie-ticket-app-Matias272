import { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import "./Profile.scss";

export default function Profile() {
    const { user, isAuthenticated, login, register, logout } = useAuth();
    const [mode, setMode] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const firstName = (user?.email || "").split("@")[0] || "User";

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setError("");
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Email and password are required");
            return;
        }

        if (mode === "register" && password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            if (mode === "register") {
                await register({ email, password });
            } else {
                await login({ email, password });
            }
            resetForm();
        } catch (err) {
            setError(err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-page">
            <section className="profile-page_header">
                <h1>Profile</h1>
            </section>

            {isAuthenticated ? (
                <section className="profile-card">
                    <div className="profile-card_avatar">{firstName[0].toUpperCase()}</div>
                    <h2>{firstName}</h2>
                    <p>{user.email}</p>
                    <button type="button" className="auth-btn" onClick={logout}>
                        Log out
                    </button>
                </section>
            ) : (
                <section className="auth-card">
                    <div className="auth-tabs">
                        <button
                            type="button"
                            className={mode === "login" ? "active" : ""}
                            onClick={() => {
                                setMode("login");
                                setError("");
                            }}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            className={mode === "register" ? "active" : ""}
                            onClick={() => {
                                setMode("register");
                                setError("");
                            }}
                        >
                            Register
                        </button>
                    </div>

                    <form className="auth-form" onSubmit={onSubmit}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete={mode === "register" ? "new-password" : "current-password"}
                        />

                        {mode === "register" ? (
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                        ) : null}

                        {error ? <p className="auth-error">{error}</p> : null}

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading
                                ? "Please wait..."
                                : mode === "register"
                                    ? "Create account"
                                    : "Log in"}
                        </button>
                    </form>
                </section>
            )}

            <Navbar />
        </div>
    );
}