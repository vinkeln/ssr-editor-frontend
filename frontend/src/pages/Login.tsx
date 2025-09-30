import LoginForm from "../components/LoginForm";

export default function LoginPage() {
    return (
        <div className="login-page">
            <LoginForm backendUrl="https://api.example.com/api" />
        </div>
    );
}