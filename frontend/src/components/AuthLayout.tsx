import type { ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

export default function AuthLayout({
    children,
    title,
    subtitle,
}: AuthLayoutProps) {
    return (
        <main className="auth-page"> <div className="auth-topbar"> <a className="brand" href="/login"> <span className="brand-mark">H</span> <span>Haven<span className="brand-light">Stay</span></span> </a>

            <div className="auth-switch">
                <span>New here?</span>
                <a href="/signup">Sign up</a>
            </div>
        </div>

            <section className="auth-card">
                <div className="auth-heading">
                    <p className="eyebrow">YOUR STAY, SIMPLIFIED</p>
                    <h1>{title}</h1>
                    <p className="auth-subtitle">{subtitle}</p>
                </div>

                {children}

                <p className="auth-footer">
                    Secure access to your account
                </p>
            </section>

            <footer className="page-footer">
                <span>HAVENSTAY</span>
                <span>Hospitality, made simple.</span>
            </footer>
        </main>

    );
}
