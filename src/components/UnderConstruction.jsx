import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HardHat, Cog, Hammer, Wrench } from "lucide-react"

// Inline Card components
const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow-lg ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="px-6 py-4 border-b border-gray-200">
    {children}
  </div>
);

const CardTitle = ({ children, className }) => (
  <h2 className={`text-2xl font-bold ${className}`}>
    {children}
  </h2>
);

const CardContent = ({ children }) => (
  <div className="px-6 py-4">
    {children}
  </div>
);

export default function UnderConstruction() {
  const [currentTool, setCurrentTool] = useState(0);
  const tools = [
    { icon: HardHat, text: "Planning" },
    { icon: Cog, text: "Configuring" },
    { icon: Hammer, text: "Building" },
    { icon: Wrench, text: "Tweaking" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTool((prevTool) => (prevTool + 1) % tools.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Under Construction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-32 h-32">
              {tools.map((Tool, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: currentTool === index ? 1 : 0,
                    scale: currentTool === index ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Tool.icon className="w-24 h-24 text-primary" />
                </motion.div>
              ))}
            </div>
            <motion.div
              key={currentTool}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-xl font-semibold text-center"
            >
              {tools[currentTool].text}
            </motion.div>
            <p className="text-center text-muted-foreground">
              Our developer is hard at work improving this page. Please check back soon!
            </p>
            <div className="flex justify-center space-x-2">
              {[0, 1, 2].map((_, index) => (
                <motion.div
                  key={index}
                  className="w-3 h-3 bg-primary rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}