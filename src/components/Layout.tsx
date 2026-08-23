import Navbar from './Navbar';
import CategoryBar from './CategoryBar';
import { Outlet } from 'react-router';

export default function Layout() {
    return (
        <>
            <Navbar />
            <CategoryBar />
            <Outlet />
        </>
    );
}