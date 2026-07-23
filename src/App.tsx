import { Routes, Route } from 'react-router';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import Navbar from "@/components/Navbar.tsx";
import ProtectedRoute from "@/components/ProtectedRoute.tsx";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={
                <>
                    <Navbar />
                    <HomePage />
                </>
            } />
            <Route path="/profile" element={
                <ProtectedRoute>
                    <Navbar />
                    <div>Profile Page</div>
                </ProtectedRoute>
            } />
        </Routes>
    );
}

export default App;