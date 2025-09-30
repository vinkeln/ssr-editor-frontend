import RegisterForm from "../components/RegisterForm";

export default function Register() {
    
    return (
        <div className="register-page">
            <RegisterForm backendUrl="https://backend.azurewebsites.net" /> {/* Change the url when deploying */}
        </div>
    );
}
