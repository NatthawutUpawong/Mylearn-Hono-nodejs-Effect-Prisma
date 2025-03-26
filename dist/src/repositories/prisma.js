import { PrismaClient } from "@prisma/client";
import { Context, Layer } from "effect";
const prismaClient = new PrismaClient();
export class PrismaClientContext extends Context.Tag("Repository/PrismaClientLayer")() {
    static Live = Layer.succeed(this, prismaClient);
}
export default PrismaClientContext;
// สร้าว Layer ที่เป็น class  
// static live คือ สร้าง Service ที่จะใช้งานใน production แต่ยังไม่ได้ใช้งานในตอนนี้ 
