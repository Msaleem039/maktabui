import dbConnect from '@/server/utils/dbConnect';
import { getParentById } from '@/server/controllers/ParentController';

dbConnect();

export async function POST(req) {
    return getParentById(req);
}
