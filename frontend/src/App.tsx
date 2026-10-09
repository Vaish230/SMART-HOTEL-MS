import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";

function ComingSoon({ page }: { page: string }) {
  return (<main className="placeholder-page"> <p>{page} page is coming next.</p> <a href="/login">Back to login</a> </main>
  );
}

export default function App() {
  return (<BrowserRouter> <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<ComingSoon page="Signup" />} />
    <Route path="/verify-otp" element={<ComingSoon page="OTP verification" />} />
    <Route path="/forgot-password" element={<ComingSoon page="Forgot password" />} />
    <Route path="/verify-reset-otp" element={<ComingSoon page="Reset OTP" />} />
    <Route path="/reset-password" element={<ComingSoon page="Reset password" />} /> </Routes> </BrowserRouter>
  );
}
