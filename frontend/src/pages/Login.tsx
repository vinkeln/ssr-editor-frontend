import LoginForm from "../components/LoginForm";
const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:1337/api/auth"; 

export default function LoginPage() {
    return (
        <div className="login-page">
            <LoginForm backendUrl={backendUrl} />
        </div>
    );
}