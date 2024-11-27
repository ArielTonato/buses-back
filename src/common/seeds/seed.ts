import { DataSource } from 'typeorm';
import { userSeed } from './user.seed';

export const runSeeds = async (dataSource: DataSource) => {
    try {
        console.log('Starting database seeding...');
        
        // Run user seeds
        await userSeed(dataSource);
        
        console.log('Database seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
};
