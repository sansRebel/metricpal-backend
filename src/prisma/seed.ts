import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const org = await prisma.organization.create({
        data: {
        name: 'Default Org',
        users: {
            create: {
            name: 'Admin User',
            email: 'admin@metricpal.dev',
            password: hashedPassword,
            role: 'ADMIN',
            },
        },
        },
    });

    console.log('✅ Seeded organization with admin user:', org);
    }

    main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
