import { AppDataSource } from "../data-source";
import { Admin } from "../entity/Admin";

const adminRepository = AppDataSource.getRepository(Admin);

export const resolvers = {
    Query: {
        admins: async () => {
            return await adminRepository.find();
        },
        admin: async (_: any, { userName }: { userName: string }) => {
            return await adminRepository.findOne({ where: { userName } });
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
    },
};
