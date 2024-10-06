import React, { useState } from "react";
import { LogOut } from "lucide-react";


// Inline UI components
const Button = ({ children, variant, className, ...props }) => {
    const baseStyle = "px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variantStyles = {
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
        destructive: "bg-red-600 text-white hover:bg-red-700",
    };
    return (
        <button
            className={`${baseStyle} ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

const Card = ({ children, className }) => (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children, className }) => (
    <div className={`px-6 py-4 ${className}`}>
        {children}
    </div>
);

const CardTitle = ({ children, className }) => (
    <h2 className={`text-2xl font-bold ${className}`}>
        {children}
    </h2>
);

const CardDescription = ({ children }) => (
    <p className="text-gray-600 mt-1">
        {children}
    </p>
);

const CardContent = ({ children, className }) => (
    <div className={`px-6 py-4 ${className}`}>
        {children}
    </div>
);

const CardFooter = ({ children, className }) => (
    <div className={`px-6 py-4 bg-gray-50 ${className}`}>
        {children}
    </div>
);

// Mock toast function
const useToast = () => ({
    toast: ({ title, description }) => {
        console.log(`Toast: ${title} - ${description}`);
        // In a real app, you'd implement actual toast functionality here
    }
});

export default function LogoutPage() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { toast } = useToast();

    const handleLogout = async () => {
        setIsLoggingOut(true);
        // Simulate logout process
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoggingOut(false);
        toast({
            title: "Logged out successfully",
            description: "You have been securely logged out of your account.",
        });
    };

    return (
        <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Logout</CardTitle>
                    <CardDescription>Are you sure you want to log out?</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <LogOut className="w-16 h-16 text-gray-400" />
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" className="w-full mr-2">Cancel</Button>
                    <Button
                        variant="destructive"
                        className="w-full ml-2"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut ? "Logging out..." : "Logout"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}