import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService){}

    async getBookmarks(userId: number){
        return await this.prisma.bookmark.findMany({
            where: {
                userId: userId,
            },
        });
    }
    async getBookmarkById(userId:number, bookmarkId: number){
        return await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId,
                userId: userId,
            }
        });
    }

    async createBookmark(userId: number, dto: CreateBookmarkDto){
        const bookmark = await this.prisma.bookmark.create({
            data: {
                userId: userId,
                ...dto
            }
        });
        return bookmark;
    }

    async updateBookmark(userId: number, bookmarkId: number, dto: EditBookmarkDto){
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId,
            },
        });
        if(!bookmark || bookmark.userId !== userId)
            throw new ForbiddenException('Access denied to resource bookmark');
        return await this.prisma.bookmark.update({
            where:{
                id: bookmarkId
            },
            data: {...dto},
        });
    }
    async deleteBookmark(userId: number, bookmarkId: number){
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId,
            },
        });
        if(!bookmark || bookmark.userId !== userId)
            throw new ForbiddenException('Access denied to resource bookmark');
        await this.prisma.bookmark.delete({
            where:{
                id: bookmarkId
            },
        });
    }
}
