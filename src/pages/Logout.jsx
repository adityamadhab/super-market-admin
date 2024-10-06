import LogoutPage from "../components/LogoutMain";
import Sidebar from "../components/Sidebar";

export function Logout() {

    return (
        <div>
            <div className="flex">
                <Sidebar />
                <LogoutPage />
            </div>
        </div>
    )
}