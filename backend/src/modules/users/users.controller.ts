import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Request,
  UseGuards,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';

type AuthRequest = { user: { id: number; role: UserRole } };

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createUserDto: CreateUserDto, @Request() req: AuthRequest) {
    const createdBy = req.user?.id;
    return this.usersService.create(createUserDto, createdBy);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Request() req: AuthRequest) {
    return this.usersService.findOne(req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.READER)
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('is_active') is_active?: string,
    @Request() req?: AuthRequest,
  ) {
    const filters = { search, role, is_active };
    return this.usersService.findAll(
      parseInt(page || '1'),
      parseInt(limit || '10'),
      filters,
      req?.user?.role,
      req?.user?.id,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.READER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Put('account')
  @UseGuards(JwtAuthGuard)
  async updateAccount(
    @Request() req: AuthRequest,
    @Body() updateDto: UpdateUserDto,
  ) {
    const userId = req.user.id;

    // Verificar si el email ya existe
    if (updateDto.email) {
      const existingUser = await this.usersService.findByEmail(updateDto.email);
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException('El email ya está en uso');
      }
    }

    const updatedUser = await this.usersService.update(userId, updateDto);

    // Retornar sin password
    const { password: _password, ...result } = updatedUser as unknown as Record<
      string,
      unknown
    > & {
      password?: string;
    };
    return result;
  }
}
