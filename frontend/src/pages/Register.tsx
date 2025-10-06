import RegisterForm from "../components/RegisterForm";

export default function Register() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:1337"; 
    return (
        <div className="register-page">
            <RegisterForm backendUrl={backendUrl} /> {/* Change the url when deploying */}
        </div>
    );
}
