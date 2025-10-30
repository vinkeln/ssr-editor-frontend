import RegisterForm from "../components/RegisterForm";

export default function Register() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";  
    return (
        <div className="register-page">
            <RegisterForm backendUrl={backendUrl} /> {/* Change the url when deploying */}
        </div>
    );
}
