import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto';
import { EditBookmarkDto } from './dto/edit-bookmark.dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {

    constructor(private bookmarkService: BookmarkService) { }

    @Get()
    async getBookmarks(@GetUser('id') userId: number) {
        return await this.bookmarkService.getBookmarks(userId);
    }
    @Get(':id')
    async getBookmarkById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmarkId: number) {
        return await this.bookmarkService.getBookmarkById(userId, bookmarkId);
    }

    @Post()
    async createBookmark(@GetUser('id') userId: number, @Body() dto: CreateBookmarkDto) {
        return await this.bookmarkService.createBookmark(userId, dto);
    }

    @Patch(':bookmarkId')
    async updateBookmark(@GetUser('id') userId: number, @Param('bookmarkId', ParseIntPipe) bookmarkId: number, @Body() dto: EditBookmarkDto) {
        return await this.bookmarkService.updateBookmark(userId, bookmarkId, dto);
    }
    @Delete(':id')
    async deleteBookmark(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {
        return await this.bookmarkService.deleteBookmark(userId, bookmarkId);
    }
}
