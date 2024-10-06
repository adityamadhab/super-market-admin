import OrderMain from "../components/OrderMain";
import Sidebar from "../components/Sidebar";

export function Order() {

    return (
        <div>
            <div className="flex">
                <Sidebar />
                <OrderMain />
            </div>
        </div>
    )
}