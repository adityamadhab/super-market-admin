import DashCount from "./DashCount";
import DashNav from "./DashNav";

export default function DashMain() {
    return (
        <div className="w-full overflow-x-hidden">
            <div className=" bg-white w-full p-4">
                <DashNav />
                <div
                    className="p-6 rounded-lg shadow-md mb-6"
                    style={{
                        backgroundImage: 'url(/adminback.webp)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '233px',
                        borderRadius: '12px'
                    }}
                >
                    <div className="flex items-center space-x-4">
                        <div className="text-3xl text-black font-bold" style={{ textShadow: '1px 1px 0 rgba(255, 255, 255, 0.5), -1px -1px 0 rgba(255, 255, 255, 0.5), 1px -1px 0 rgba(255, 255, 255, 0.5), -1px 1px 0 rgba(255, 255, 255, 0.5)' }}>
                            Hi, Admin
                        </div>
                    </div>
                </div>
                <DashCount />
            </div>
        </div>
    )
}