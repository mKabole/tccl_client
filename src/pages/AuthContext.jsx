import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if the user is logged in by checking local storage or cookies
        const token = localStorage.getItem("token"); // Check if token exists in local storage
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false); // Update the state explicitly to ensure it's false if no token found
        }
    }, []);

    // Function to perform login
    const login = (authToken, role_id) => {
        // Perform login logic
        setIsLoggedIn(true);
        localStorage.setItem("token", authToken);
        localStorage.setItem("role_id", role_id);
        navigate("/dashboard/home");
    };

    // Function to perform logout
    const logout = () => {
        // Perform logout logic
        setIsLoggedIn(false);
        localStorage.removeItem("token"); 
        localStorage.removeItem("role_id");
        navigate("/auth/sign-in");
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
