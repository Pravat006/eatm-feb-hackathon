"use client";

import React, { createContext, useContext } from "react";
import { useAuthStore } from "@/lib/stores/auth.store";
import { CampusType } from "@repo/shared";

interface Terminology {
    user: string;
    users: string;
    complaint: string;
    complaints: string;
    location: string;
    organization: string;
}

const defaultTerminology: Terminology = {
    user: "User",
    users: "Users",
    complaint: "Complaint",
    complaints: "Complaints",
    location: "Location",
    organization: "Campus",
};

const terminologyMap: Record<CampusType, Terminology> = {
    [CampusType.COLLEGE]: {
        user: "Student",
        users: "Students",
        complaint: "Issue",
        complaints: "Issues",
        location: "Hostel/Block",
        organization: "College",
    },
    [CampusType.HOSPITAL]: {
        user: "Patient",
        users: "Patients",
        complaint: "Requirement",
        complaints: "Requirements",
        location: "Ward/Floor",
        organization: "Hospital",
    },
    [CampusType.CORPORATE]: {
        user: "Employee",
        users: "Employees",
        complaint: "Work Item",
        complaints: "Work Items",
        location: "Desk/Floor",
        organization: "Office",
    },
    [CampusType.RESIDENTIAL]: {
        user: "Resident",
        users: "Residents",
        complaint: "Maintenance Request",
        complaints: "Maintenance Requests",
        location: "Flat/Wing",
        organization: "Society",
    },
    [CampusType.SCHOOL]: {
        user: "Student",
        users: "Students",
        complaint: "Concern",
        complaints: "Concerns",
        location: "Classroom",
        organization: "School",
    },
};

const TerminologyContext = createContext<Terminology>(defaultTerminology);

export const TerminologyProvider = ({ children }: { children: React.ReactNode }) => {
    const user = useAuthStore((state) => state.user);
    const campusType = user?.campus?.type as CampusType;

    const terminology = campusType && terminologyMap[campusType]
        ? terminologyMap[campusType]
        : defaultTerminology;

    return (
        <TerminologyContext.Provider value={terminology}>
            {children}
        </TerminologyContext.Provider>
    );
};

export const useTerminology = () => useContext(TerminologyContext);
