import LoginForm from "../components/LoginForm";
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001"; 

export default function LoginPage() {
    return (
        <div className="login-page">
            <LoginForm backendUrl={backendUrl} />
        </div>
    );
}