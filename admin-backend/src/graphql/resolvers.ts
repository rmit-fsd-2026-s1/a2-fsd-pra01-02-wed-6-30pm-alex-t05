import { AppDataSource } from "../data-source";
import { Admin } from "../entity/Admin";
import { Event } from "../entity/Event";
import { User } from "../entity/User";
import { PreferredEvents } from "../entity/PreferredEvents";

const adminRepository = AppDataSource.getRepository(Admin);
const eventRepository = AppDataSource.getRepository(Event);
const userRepository = AppDataSource.getRepository(User);

export const resolvers = {
    Query: {
        admins: async () => {
            return await adminRepository.find();
        },
        admin: async (_: any, { userName }: { userName: string }) => {
            return await adminRepository.findOne({ where: { userName } });
        },
        events: async () => {
            return await eventRepository.find();
        },
        event: async (_: any, { id }: { id: number }) => {
            return await eventRepository.findOne({ where: { eventId: id } });
        },
        users: async () => {
            return await userRepository.find();
        },
        user: async (_: any, { userName }: { userName: string }) => {
            return await userRepository.findOne({ where: { userName } });
        },
    },
    Mutation: {
        createAdmin: async (_: any, args: any) => {
            const admin = adminRepository.create(args);
            return await adminRepository.save(admin);
        },
        updateAdmin: async (
            _: any,
            { userName, ...args }: { userName: string } & Partial<Admin>
        ) => {
            await adminRepository.update(userName, args);
            return await adminRepository.findOne({
                where: { userName: userName },
            });
        },
        deleteAdmin: async (_: any, { userName }: { userName: string }) => {
            const result = await adminRepository.delete(userName);
            return result.affected !== 0;
        },
        createEvent: async (_: any, args: any) => {
            const event = eventRepository.create(args);
            return await eventRepository.save(event);
        },
        updateEvent: async (
            _: any,
            { eventId, ...args }: { eventId: string } & Partial<Event>
        ) => {
            await eventRepository.update(eventId, args);
            return await eventRepository.findOne({
                where: { eventId: eventId },
                relations: ["user"],
            });
        },
        addEventToVendor: async (
            _: any,
            { userName, eventId }: { userName: string; eventId: string }
        ) => {
            const user = await userRepository.findOne({
                where: { userName },
                relations: ["events"],
            });

            if (!user) {
                throw new Error("User not found");
            }

            const event = await eventRepository.findOne({
                where: { eventId: parseInt(eventId) },
            });

            if (!user || !event) {
                throw new Error("User or Event not found");
            }

            event.user = user;

            return await eventRepository.save(event);
        },
    },
};
