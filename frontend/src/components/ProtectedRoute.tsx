/* ProtectedRoute.tsx for protecting routes that require authentication 
'SavedDocs and CreateDocs' */
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
    showAlert?: boolean;
}

export default function ProtectedRoute({ children, showAlert = true }: ProtectedRouteProps) {
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);
    const alertShownRef = useRef(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData && !alertShownRef.current) {
            alertShownRef.current = true;

            if (showAlert) {
                setTimeout(() => {
                    alert('You must be logged in to access this page');
                }, 10);
            }
            navigate('/login');
        } else {
            setIsChecking(false);
        }
    }, [navigate, showAlert]);

    if (isChecking) {
        return <div>Redirecting to login...</div>;
    }

    return <>{children}</>;
}
