"use client";

import { useState } from "react";
import {
    Send,
    User,
    Bot,
    AlertTriangle,
    Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_MESSAGES = [
    {
        id: 1,
        sender: "Alex (Student)",
        role: "USER",
        text: "The elevator in Block B is making a loud grinding noise. It feels unsafe.",
        time: "09:41 AM",
        type: "issue"
    },
    {
        id: 2,
        sender: "Sarah (Manager)",
        role: "MANAGER",
        text: "Acknowledged. I've flagged this as HIGH priority. Maintenance team is on the way.",
        time: "09:45 AM",
        type: "response"
    },
    {
        id: 3,
        sender: "Mike (Technician)",
        role: "STAFF",
        text: "Arrived at Block B. The motor bearings are worn out. Shutting down elevator for repairs.",
        time: "10:02 AM",
        type: "report"
    },
    {
        id: 4,
        sender: "Sarah (Manager)",
        role: "MANAGER",
        text: "Please update status to 'IN PROGRESS' once you start. Estimated time for fix?",
        time: "10:10 AM",
        type: "response"
    },
    {
        id: 5,
        sender: "Mike (Technician)",
        role: "STAFF",
        text: "About 3 hours. I have the replacement parts in the van.",
        time: "10:15 AM",
        type: "report"
    },
    {
        id: 6,
        sender: "Campus Care AI",
        role: "AI",
        text: "Anomaly Detected: Historical data shows Block B elevator motor often fails after high-load events. Suggesting preventive check on Block C elevator as well.",
        time: "10:16 AM",
        type: "ai"
    }
];

export default function ChatPage() {
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        const newMessage = {
            id: messages.length + 1,
            sender: "You (Operator)",
            role: "ADMIN",
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: "response"
        };
        setMessages([...messages, newMessage]);
        setInput("");
    };

    return (
        <div className="h-[calc(100vh-12rem)] flex flex-col border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            {/* Chat Header */}
            <div className="p-6 border-b-4 border-black bg-primary text-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Building2 className="w-8 h-8" />
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter">Maintenance Nexus</h2>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Connected to Block B Critical Group</p>
                    </div>
                </div>
                <div className="px-4 py-1 border-2 border-white text-[10px] font-black uppercase tracking-widest bg-black">
                    6_OPERATORS_ONLINE
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fafafa]">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, x: msg.role === "ADMIN" ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex flex-col ${msg.role === "ADMIN" ? "items-end" : "items-start"}`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                {msg.role === "AI" ? <Bot className="w-4 h-4 text-primary" /> : <User className="w-4 h-4 opacity-40" />}
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                    {msg.sender} • {msg.time}
                                </span>
                            </div>
                            <div className={`max-w-[80%] p-4 border-2 border-black font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${msg.role === "AI" ? "bg-primary text-white" :
                                msg.role === "ADMIN" ? "bg-black text-white" : "bg-white text-black"
                                }`}>
                                {msg.text}
                            </div>
                            {msg.type === "issue" && (
                                <div className="mt-2 flex items-center gap-2 px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase border-2 border-black">
                                    <AlertTriangle className="w-3 h-3" /> Critical Hazard Flagged
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-6 border-t-4 border-black bg-white">
                <div className="flex gap-4">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="TYPE_MESSAGE_TO_TEAM..."
                        className="flex-1 border-2 border-black rounded-none h-14 font-bold focus-visible:ring-0 focus-visible:border-primary transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    />
                    <Button
                        onClick={handleSend}
                        className="h-14 px-8 bg-black text-white hover:bg-primary transition-all border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                    >
                        <Send className="w-6 h-6" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
