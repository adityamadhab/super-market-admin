import DashMain from "../components/DashboardComponents/DashMain";
import Sidebar from "../components/Sidebar";

export function Dashborad() {

    return (
        <div>
            <div className="flex">
                <Sidebar />
                <DashMain/>
            </div>
        </div>
    )
}