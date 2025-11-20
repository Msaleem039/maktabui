import dbConnect from '@/server/utils/dbConnect';
import {getAllParentsWithStudents } from '@/server/controllers/ParentController';

dbConnect();

export async function POST(req) {
    return getAllParentsWithStudents(req);
}
