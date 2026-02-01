import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto, createdBy?: number) {
    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Hash de la contraseña
    const hashedPassword = await hash(createUserDto.password, 12);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      created_by: createdBy,
    });

    const savedUser = await this.userRepository.save(user);

    // Excluir password del resultado
    const { password: _password, ...result } = savedUser;
    return result;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: {
      search?: string;
      role?: string;
      is_active?: string;
    },
    userRole?: string,
    userId?: number,
  ) {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.creator', 'creator')
      .where('user.deleted_at IS NULL')
      .select([
        'user.id',
        'user.username',
        'user.email',
        'user.role',
        'user.first_name',
        'user.last_name',
        'user.phone',
        'user.is_active',
        'user.created_at',
        'user.updated_at',
        'creator.id',
        'creator.username',
        'creator.first_name',
        'creator.last_name',
      ]);

    // Restricción de visibilidad para editores y lectores
    if (userRole === 'editor' || userRole === 'reader') {
      queryBuilder.andWhere('user.created_by = :userId', { userId });
    }

    if (filters?.role) {
      queryBuilder.andWhere('user.role = :role', { role: filters.role });
    }

    if (filters?.is_active !== undefined) {
      queryBuilder.andWhere('user.is_active = :isActive', {
        isActive: filters.is_active === 'true',
      });
    }

    if (filters?.search) {
      queryBuilder.andWhere(
        '(user.username ILIKE :search OR user.email ILIKE :search OR user.first_name ILIKE :search OR user.last_name ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    const [users, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('user.created_at', 'DESC')
      .getManyAndCount();

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.creator', 'creator')
      .where('user.id = :id', { id })
      .andWhere('user.deleted_at IS NULL')
      .select([
        'user.id',
        'user.username',
        'user.email',
        'user.role',
        'user.first_name',
        'user.last_name',
        'user.phone',
        'user.is_active',
        'user.created_at',
        'user.updated_at',
        'creator.id',
        'creator.username',
        'creator.first_name',
        'creator.last_name',
      ])
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByUsername(username: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.deleted_at IS NULL')
      .andWhere('(user.username = :username OR user.email = :username)', {
        username,
      })
      .addSelect('user.password')
      .getOne();
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email, deleted_at: IsNull() },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    const updateData: Partial<User> = { ...updateUserDto };

    // Si se actualiza la contraseña, hashearla
    if (updateUserDto.password) {
      updateData.password = await hash(updateUserDto.password, 12);
    }

    await this.userRepository.update(id, updateData);

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.userRepository.softDelete(id);
    return { message: 'User deleted successfully' };
  }
}
