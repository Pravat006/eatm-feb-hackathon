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
}

export default new CampusService();
