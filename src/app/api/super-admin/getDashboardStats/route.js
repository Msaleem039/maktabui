import dbConnect from '@/server/utils/dbConnect';
import { getDashboardStats } from '@/server/controllers/SuperAdminController';

dbConnect();

export async function POST(req) {
    return getDashboardStats(req);
}
