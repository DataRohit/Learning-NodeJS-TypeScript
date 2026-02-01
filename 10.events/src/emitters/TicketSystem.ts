import { EventEmitter } from "node:events";

interface Ticket {
  id: string;
  user: string;
  issue: string;
}

export class TicketSystem extends EventEmitter {
  constructor() {
    super();
  }

  createTicket(user: string, issue: string) {
    const ticket: Ticket = {
      id: Math.random().toString(36).substring(7),
      user,
      issue,
    };

    console.log(`[Emitter] Creating ticket: ${ticket.id}`);

    // Emit 'ticketCreated' event
    this.emit("ticketCreated", ticket);
  }

  resolveTicket(id: string) {
    console.log(`[Emitter] Resolving ticket: ${id}`);

    // Emit 'ticketResolved' event
    this.emit("ticketResolved", id);
  }
}
