import ProductMain from "../components/ProductMain";
import Sidebar from "../components/Sidebar";

export function Product() {

    return (
        <div>
            <div className="flex">
                <Sidebar />
                <ProductMain />
            </div>
        </div>
    )
}