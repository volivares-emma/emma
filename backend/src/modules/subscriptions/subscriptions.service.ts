import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import {
  Subscription,
  SubscriptionStatus,
} from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    const existing = await this.subscriptionRepository.findOne({
      where: { email: createSubscriptionDto.email },
    });

    if (existing && existing.deleted_at === null) {
      throw new ConflictException('Email already subscribed');
    }

    const subscription = this.subscriptionRepository.create(
      createSubscriptionDto,
    );
    return await this.subscriptionRepository.save(subscription);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Subscription[];
    total: number;
    page: number;
    limit: number;
  }> {
    const [data, total] = await this.subscriptionRepository.findAndCount({
      where: { deleted_at: IsNull() },
      skip: (page - 1) * limit,
      take: limit,
      order: { subscribed_at: 'DESC' },
    });

    return { data, total, page, limit };
  }

  async findActive(): Promise<Subscription[]> {
    return await this.subscriptionRepository.find({
      where: { status: SubscriptionStatus.ACTIVE, deleted_at: IsNull() },
      order: { subscribed_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
    return subscription;
  }

  async update(
    id: number,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    const subscription = await this.findOne(id);
    Object.assign(subscription, updateSubscriptionDto);
    return await this.subscriptionRepository.save(subscription);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.subscriptionRepository.softDelete(id);
  }
}
