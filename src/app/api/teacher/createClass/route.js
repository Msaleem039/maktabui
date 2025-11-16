import dbConnect from '@/server/utils/dbConnect';
import { createClass } from '@/server/controllers/ClassController';

dbConnect();

export async function POST(req) {
    return createClass(req);
}
