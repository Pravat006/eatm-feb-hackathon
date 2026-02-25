import db from "@/services/db";
import { CampusType, CampusStatus } from "@repo/shared";

export interface RegisterCampusDto {
    name: string;
    type: CampusType;
    contactEmail: string;
}

export interface ReviewCampusDto {
    action: "APPROVE" | "REJECT";
}

class CampusService {
    async registerCampus(data: RegisterCampusDto, userId: string) {
        const campus = await db.campus.create({
            data: {
                name: data.name,
                type: data.type,
                contactEmail: data.contactEmail,
                status: "PENDING"
            }
        });

        await db.user.update({
            where: { id: userId },
            data: {
                campusId: campus.id,
                role: "ADMIN"
            }
        });

        return campus;
    }

    async getPendingCampuses() {
        return await db.campus.findMany({
            where: { status: "PENDING" },
            include: {
                users: {
                    where: { role: "ADMIN" },
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: "asc" }
        });
    }

    async reviewCampusRequest(id: string, newStatus: CampusStatus) {
        return await db.campus.update({
            where: { id },
            data: { status: newStatus }
        });
    }

    async getActiveCampuses() {
        return await db.campus.findMany({
            where: { status: "ACTIVE" },
            select: { id: true, name: true, type: true }
        });
    }

    async inviteStaff(adminId: string, staffEmail: string) {
        // Find the admin to get their campusId
        const admin = await db.user.findUnique({ where: { id: adminId } });
        if (!admin || !admin.campusId || admin.role !== "ADMIN") {
            throw new Error("Only an active Organization Admin can invite staff.");
        }

        // Check if user already exists
        const existingUser = await db.user.findUnique({ where: { email: staffEmail } });
        if (existingUser) {
            throw new Error("A user with this email is already registered in the system.");
        }

        // Pre-provision the user
        return await db.user.create({
            data: {
                clerkId: `INVITE_${staffEmail}_${Date.now()}`,
                email: staffEmail,
                name: "Pending Staff",
                role: "MANAGER", // Staff maps to MANAGER role in system
                campusId: admin.campusId
            },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true
            }
        });
    }

    async getCampusMembers(adminId: string) {
        const admin = await db.user.findUnique({ where: { id: adminId } });
        if (!admin || !admin.campusId) {
            throw new Error("Admin is not assigned to any campus.");
        }

        return await db.user.findMany({
            where: { campusId: admin.campusId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            },
            orderBy: { role: 'asc' }
        });
    }
}

export default new CampusService();
