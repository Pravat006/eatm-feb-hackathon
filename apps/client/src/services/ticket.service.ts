import api from "./api";
import { TicketDto } from "@repo/shared";

export type Ticket = TicketDto;

export const ticketService = {
    // Admin: get all tickets for campus
    getAll: async (): Promise<Ticket[]> => {
        const response = await api.get("/tickets/all");
        return response.data;
    },

    // User: get own tickets
    getMyTickets: async (): Promise<Ticket[]> => {
        const response = await api.get("/tickets/my-tickets");
        return response.data;
    },

    // Create a new ticket
    create: async (data: any): Promise<Ticket> => { // eslint-disable-line @typescript-eslint/no-explicit-any
        const response = await api.post("/tickets", data);
        return response.data;
    },

    // Admin/Manager: update ticket status
    updateStatus: async (id: string, status: string): Promise<Ticket> => {
        const response = await api.patch(`/tickets/${id}/status`, { status });
        return response.data;
    }
};
