import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import AuthLayout from "../../components/AuthLayout";
import { api } from "../../services/api";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            });

            if (response.data.requiresOtp) {
                sessionStorage.setItem("pendingLoginEmail", email);
                sessionStorage.setItem("rememberMe", String(rememberMe));
                navigate("/verify-otp");
            }
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                "Unable to sign in. Please try again."
            );
        } finally {
            setLoading(false);
        }

    };

    return (<AuthLayout
        title="Your journey begins."
        subtitle="Welcome back. Sign in to continue."
    > <form className="auth-form" onSubmit={handleSubmit}> <label htmlFor="email">Email address</label>
            <input
                id="email"
                type="email"
                placeholder="[you@example.com](mailto:you@example.com)"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
            />

            <div className="label-row">
                <label htmlFor="password">Password</label>
                <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <div className="password-field">
                <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
                <button
                    className="password-toggle"
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((previous) => !previous)}
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            <label className="remember-row">
                <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                />
                <span>Remember me</span>
            </label>

            {error && <p className="form-error">{error}</p>}

            <button className="primary-button" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
                {!loading && <ArrowRight size={17} />}
            </button>

            <p className="signup-prompt">
                Don't have an account? <Link to="/signup">Create one</Link>
            </p>
        </form>
    </AuthLayout>

    );
}
