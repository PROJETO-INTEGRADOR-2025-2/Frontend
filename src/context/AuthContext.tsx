import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface User extends JwtPayload {
    id: number;
    name: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    logout: () => void;
    updateAuthStatus: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const decodeToken = (token: string | null): User | null => {
    if (!token) return null;
    try {
        const decoded: any = jwtDecode(token);

        if (decoded.id && decoded.name) {
            return { id: decoded.id, name: decoded.name } as User;
        }

        return null;
    } catch (error) {
        console.error("Erro ao decodificar token:", error);
        return null;
    }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
       const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('coleta_token');
        const userData = decodeToken(token);

        if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
        } else {
            setUser(null);
            setIsAuthenticated(false);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('coleta_token');
        setUser(null);
        setIsAuthenticated(false);
        window.location.href = '/';
    };

    const updateAuthStatus = (token: string) => {
        const userData = decodeToken(token);
        if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, logout, updateAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
