"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Zap,
  Building2,
  Users,
  ClipboardCheck,
  Lock,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary selection:text-white font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="border-b-2 border-black p-6 flex justify-between items-center bg-white sticky top-0 z-50">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2"
        >
          <Building2 className="w-8 h-8" /> Campus Care
        </motion.div>
        <div className="flex gap-4">
          <Link href="/onboarding">
            <Button variant="outline" className="h-12 px-8 font-black uppercase tracking-widest text-xs shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              Initialize
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col relative">
        {/* Floating Industrial Markers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ rotate: 0, opacity: 0.05 }}
              animate={{
                rotate: 360,
                x: [i * 20, (i + 1) * -15],
                y: [i * 15, (i + 1) * -20]
              }}
              transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
              className="absolute text-[10rem] font-black text-black select-none"
              style={{
                left: `${(i * 17) % 100}%`,
                top: `${(i * 23) % 100}%`,
              }}
            >
              {i % 2 === 0 ? "X" : "+"}
            </motion.div>
          ))}
        </div>

        {/* Hero Section */}
        <section className="px-6 pt-32 pb-48 max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block px-4 py-2 border-2 border-black text-[10px] font-black uppercase tracking-[0.4em] mb-8 bg-primary text-white shadow-neo"
          >
            Smarter Campus. Faster Fixes. Zero Chaos.
          </motion.div>

          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-7xl md:text-[10rem] font-black uppercase leading-[0.8] tracking-tighter mb-12"
          >
            Smart<br className="md:hidden" /><span className="text-secondary">Maintain</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl font-bold uppercase tracking-widest text-foreground/70 max-w-3xl mx-auto mb-16"
          >
            A centralized maintenance management platform for colleges, hospitals, and residential societies — built to streamline issue reporting, tracking, and resolution.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col md:flex-row gap-6 justify-center items-center"
          >
            <Link href="/onboarding">
              <Button size="lg" className="h-20 px-12 text-lg font-black uppercase tracking-widest border-2 border-black bg-black text-white shadow-[8px_8px_0px_0px_rgba(245,74,10,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all group">
                🚀 Request Your Campus Setup
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-20 px-12 text-lg font-black uppercase tracking-widest border-2 border-black bg-white text-black shadow-neo hover:bg-black hover:text-white transition-all">
              🎯 View Demo
            </Button>
          </motion.div>
        </section>

        {/* Why Us Section */}
        <section className="bg-black text-white py-32 px-6 border-y-2 border-black relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-12">🔥 Why Campus Care?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "LOST_COMPLAINTS", desc: "Never lose a request in emails or WhatsApp groups again.", icon: "01" },
                { title: "DELAYED_FIXES", desc: "Automated routing ensures issues reach technicians instantly.", icon: "02" },
                { title: "NO_ACCOUNTABILITY", desc: "Full audit logs of who fixed what and when.", icon: "03" },
                { title: "ZERO_SYNC", desc: "One real-time source of truth for all campus facilities.", icon: "04" }
              ].map((item) => (
                <div key={item.title} className="group border-2 border-white/20 p-8 text-left hover:bg-white hover:text-black transition-all">
                  <div className="text-4xl font-black text-primary mb-4">{item.icon}</div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-2 underline">{item.title}</h3>
                  <p className="font-bold text-xs uppercase tracking-widest opacity-60 group-hover:opacity-100">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industrial Marquee */}
        <div className="bg-secondary text-white py-4 border-b-2 border-black overflow-hidden flex whitespace-nowrap relative z-10">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ x: ["0%", "-100%"] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="flex gap-20 items-center px-10"
            >
              <span className="text-sm font-black uppercase tracking-[0.5em]">SYSTEM_STABLE</span>
              <span className="text-sm font-black uppercase tracking-[0.5em]">AI_ACTIVE</span>
              <span className="text-sm font-black uppercase tracking-[0.5em]">CAMPUS_SYNC_NORMAL</span>
              <span className="text-sm font-black uppercase tracking-[0.5em]">ZERO_DOWNTIME</span>
            </motion.div>
          ))}
        </div>

        {/* Key Features */}
        <section className="py-32 px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="text-6xl font-black uppercase tracking-tighter mb-20 text-center md:text-left"
            >
              ✨ Key Features
            </motion.h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[
                { icon: Building2, title: "Multi-Campus Support", desc: "Manage multiple campuses, hospitals, or societies from one platform with complete data isolation." },
                { icon: Users, title: "Role-Based Access Control", desc: "Super Admin, Organization Admin, Staff, and Students/Residents. Secure and structured operations." },
                { icon: ClipboardCheck, title: "Easy Complaint Submission", desc: "Users can report issues in seconds: Add description, Select location, and Track status live." },
                { icon: Zap, title: "Smart Assignment & Tracking", desc: "Admins assign complaints to staff. Staff update progress in real time (PENDING → IN PROGRESS → RESOLVED)." },
                { icon: LineChart, title: "Real-Time Dashboard", desc: "Visibility into Total open issues, Resolved complaints, Average resolution time, and Staff workload." },
                { icon: Bot, title: "AI-Powered Prioritization", desc: "Automatically prioritize hazards like electrical issues, water leakage, or safety concerns." }
              ].map((f, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, rotate: i % 2 === 0 ? 1 : -1 }}
                  className="p-8 border-2 border-black bg-white shadow-neo flex flex-col gap-6"
                >
                  <f.icon className="w-12 h-12 text-primary" />
                  <h3 className="text-2xl font-black uppercase tracking-tighter">{f.title}</h3>
                  <p className="font-bold text-sm text-foreground/60 uppercase leading-relaxed tracking-wider">
                    {f.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Who is it for */}
        <section className="py-32 px-6 bg-white border-y-2 border-black relative z-10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-20 items-center">
            <div className="md:w-1/2">
              <motion.h2
                initial={{ x: -40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="text-6xl font-black uppercase tracking-tighter mb-8 leading-none"
              >
                🎯 Who Is <br /> It For?
              </motion.h2>
              <div className="space-y-6">
                {[
                  "Colleges & Universities",
                  "Hospitals & Healthcare Facilities",
                  "Residential Societies",
                  "Corporate Campuses"
                ].map((item, idx) => (
                  <motion.div
                    key={item}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 border-l-8 border-primary pl-8 py-4 bg-background group hover:bg-secondary hover:text-white transition-all cursor-default"
                  >
                    <span className="text-2xl font-black uppercase tracking-widest">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="bg-black text-white p-12 border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,238,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all"
              >
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-6 flex items-center gap-4">
                  <Lock className="w-8 h-8 text-secondary" /> 🔐 Secure & Scalable
                </h3>
                <ul className="space-y-4 font-bold uppercase tracking-widest text-sm text-white/70">
                  <li className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-secondary transition-colors">• Multi-tenant architecture</li>
                  <li className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-secondary transition-colors">• Organization-level data isolation</li>
                  <li className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-secondary transition-colors">• Role-based access control</li>
                  <li className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-secondary transition-colors">• Designed for scalable SaaS deployment</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Status Flow Highlight */}
        <section className="bg-primary py-24 px-6 border-y-2 border-black overflow-hidden relative z-10">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
            <div className="text-white text-center lg:text-left">
              <h3 className="text-5xl font-black uppercase tracking-tighter mb-4">STATUS_FLOW</h3>
              <p className="font-bold uppercase tracking-widest text-white/80">The Real-time resolution pipeline.</p>
            </div>
            <div className="flex flex-wrap lg:flex-nowrap items-center justify-center gap-4 lg:gap-8 bg-black p-10 border-2 border-black shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]">
              <div className="flex flex-col items-center gap-2 min-w-[100px]">
                <div className="w-12 h-12 bg-white flex items-center justify-center border-2 border-black">
                  <span className="font-black text-black">01</span>
                </div>
                <span className="text-[10px] text-white font-black uppercase tracking-widest">PENDING</span>
              </div>
              <ArrowRight className="hidden lg:block text-white/30" />
              <div className="flex flex-col items-center gap-2 min-w-[100px]">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 bg-yellow-400 flex items-center justify-center border-2 border-black"
                >
                  <Zap className="text-black w-6 h-6" />
                </motion.div>
                <span className="text-[10px] text-white font-black uppercase tracking-widest">IN_PROGRESS</span>
              </div>
              <ArrowRight className="hidden lg:block text-white/30" />
              <div className="flex flex-col items-center gap-2 min-w-[100px]">
                <div className="w-12 h-12 bg-green-400 flex items-center justify-center border-2 border-black">
                  <CheckCircle2 className="text-black w-6 h-6" />
                </div>
                <span className="text-[10px] text-white font-black uppercase tracking-widest">RESOLVED</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Statistics Section ── */}
        <section className="py-32 px-6 bg-white border-t-4 border-black relative z-10">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Header */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-50">
                Platform Insights
              </p>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
                Numbers Don&apos;t Lie
              </h2>
              <p className="text-sm font-bold uppercase tracking-widest text-foreground/50 max-w-xl mx-auto">
                Real-time infrastructure intelligence powered by AI and live sensor data across 50+ campuses.
              </p>
            </motion.div>

            {/* KPI pills */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { label: "Campuses Onboarded", value: "50+", accent: "bg-black text-white" },
                { label: "Issues Resolved", value: "12,400+", accent: "bg-yellow-400" },
                { label: "Avg. Resolution Time", value: "2.4 hrs", accent: "bg-white border-black" },
                { label: "AI Detections / Month", value: "3,200+", accent: "bg-white border-black" },
              ].map((k, i) => (
                <div key={i} className={`p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${k.accent}`}>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">{k.label}</p>
                  <p className="text-3xl font-black tracking-tighter">{k.value}</p>
                </div>
              ))}
            </motion.div>

            {/* Charts 2x2 grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Chart 1: Daily issue trend */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="p-8 border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] bg-white"
              >
                <h3 className="text-base font-black uppercase tracking-tighter mb-6">
                  📊 Weekly Issue Trend (Platform-Wide)
                </h3>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { day: "Mon", issues: 148 },
                      { day: "Tue", issues: 212 },
                      { day: "Wed", issues: 189 },
                      { day: "Thu", issues: 290 },
                      { day: "Fri", issues: 231 },
                      { day: "Sat", issues: 97 },
                      { day: "Sun", issues: 68 },
                    ]}>
                      <defs>
                        <linearGradient id="landingGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#000" stopOpacity={0.12} />
                          <stop offset="95%" stopColor="#000" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                      <XAxis dataKey="day" tick={{ fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ border: "3px solid black", borderRadius: 0, fontWeight: 900, fontSize: 10 }} />
                      <Area type="monotone" dataKey="issues" stroke="#000" strokeWidth={3} fill="url(#landingGrad)"
                        dot={{ fill: "#000", r: 4, strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: "#f59e0b", stroke: "#000", strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Chart 2: Resolution by category */}
              <motion.div
                initial={{ x: 30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="p-8 border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] bg-white"
              >
                <h3 className="text-base font-black uppercase tracking-tighter mb-6">
                  🏗️ Issues by Infrastructure Type
                </h3>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { type: "Electrical", count: 420 },
                      { type: "Plumbing", count: 310 },
                      { type: "Structural", count: 280 },
                      { type: "IT/Net", count: 195 },
                      { type: "HVAC", count: 160 },
                      { type: "Safety", count: 230 },
                    ]} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                      <XAxis type="number" tick={{ fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="type" tick={{ fontSize: 9, fontWeight: 900 }} axisLine={false} tickLine={false} width={65} />
                      <Tooltip contentStyle={{ border: "3px solid black", borderRadius: 0, fontWeight: 900, fontSize: 10 }} />
                      <Bar dataKey="count" name="Issues" radius={0}>
                        {[0, 1, 2, 3, 4, 5].map((_, i) => (
                          <Cell key={i} fill={i % 2 === 0 ? "#000" : "#f59e0b"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Chart 3: Resolution rate trend */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-8 border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] bg-black text-white"
              >
                <h3 className="text-base font-black uppercase tracking-tighter mb-6 text-white">
                  📈 Resolution Rate Growth (Monthly)
                </h3>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { month: "Sep", rate: 62 },
                      { month: "Oct", rate: 68 },
                      { month: "Nov", rate: 74 },
                      { month: "Dec", rate: 81 },
                      { month: "Jan", rate: 85 },
                      { month: "Feb", rate: 91 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 900, fill: "rgba(255,255,255,0.6)" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[50, 100]} tick={{ fontSize: 10, fontWeight: 900, fill: "rgba(255,255,255,0.6)" }} axisLine={false} tickLine={false} unit="%" />
                      <Tooltip contentStyle={{ background: "#000", border: "2px solid #fff", borderRadius: 0, fontWeight: 900, fontSize: 10, color: "#fff" }} />
                      <Line type="monotone" dataKey="rate" stroke="#f59e0b" strokeWidth={4}
                        dot={{ fill: "#f59e0b", r: 5, strokeWidth: 0 }}
                        activeDot={{ r: 8, stroke: "#fff", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Chart 4: Campus health distribution */}
              <motion.div
                initial={{ x: 30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-8 border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] bg-yellow-400"
              >
                <h3 className="text-base font-black uppercase tracking-tighter mb-6">
                  🏥 Campus Health Distribution
                </h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Excellent (90-100%)", value: 18 },
                          { name: "Good (75-89%)", value: 22 },
                          { name: "Fair (60-74%)", value: 7 },
                          { name: "Critical (<60%)", value: 3 },
                        ]}
                        innerRadius={55} outerRadius={80} paddingAngle={4}
                        dataKey="value" strokeWidth={3} stroke="#000"
                      >
                        {["#22c55e", "#000", "#f59e0b", "#ef4444"].map((c, i) => (
                          <Cell key={i} fill={c} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ border: "3px solid black", borderRadius: 0, fontWeight: 900, fontSize: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    { label: "Excellent", color: "#22c55e" },
                    { label: "Good", color: "#000" },
                    { label: "Fair", color: "#f59e0b" },
                    { label: "Critical", color: "#ef4444" },
                  ].map((l, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-3 h-3 border border-black shrink-0" style={{ background: l.color }} />
                      <span className="text-[9px] font-black uppercase">{l.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-32 px-6 bg-background text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-12 leading-tight"
            >
              🚀 Transform Infrastructure Operations
            </motion.h2>
            <p className="text-xl font-bold uppercase tracking-widest text-foreground/70 mb-16">
              Stop managing complaints on paper, WhatsApp, or spreadsheets. Start managing them intelligently.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <Link href="/onboarding">
                <Button className="h-24 px-12 text-xl font-black uppercase tracking-widest border-2 border-black bg-primary text-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
                  🏢 Register Your Campus
                </Button>
              </Link>
              <Button variant="outline" className="h-24 px-12 text-xl font-black uppercase tracking-widest border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,238,1)] hover:bg-black hover:text-white transition-all">
                📞 Contact Support
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-black text-white p-20 border-t-2 border-black relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left">
            <h4 className="text-3xl font-black uppercase tracking-tighter mb-2">Campus<span className="text-secondary">Care</span></h4>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-50">Efficient. Transparent. Intelligent.</p>
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
            © 2026 Campus Care // All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
}

