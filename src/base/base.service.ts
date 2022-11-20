import { DeleteResult, FindOneOptions, Repository } from 'typeorm';
import { generateUUID } from 'src/utils';
import { BaseEntityClass } from './base.entity';
import { isEmpty } from 'lodash';
import { NotFoundException } from '@nestjs/common';

export class BaseService<T extends BaseEntityClass, TCreation, TQueryRequest> {
  constructor(
    private readonly repository: Repository<T>,
    private readonly idPrefix: string,
  ) {}

  async findAll(): Promise<T[]> {
    return this.repository.find({});
  }

  async findBy(request: TQueryRequest): Promise<T[]> {
    return this.repository.find(request);
  }

  async findSingleBy(condition: any, option?: FindOneOptions<T>): Promise<T> {
    return this.repository.findOne({
      where: condition,
      ...option,
      relationLoadStrategy: 'query',
    });
  }

  async findById(id: string, options?: FindOneOptions<T>): Promise<T> {
    const foundObject = await this.findSingleBy({ id }, options);
    if (isEmpty(foundObject)) {
      throw new NotFoundException(`Can not found object with id ${id}`);
    } else return foundObject;
  }

  async create(req: BaseEntityClass | TCreation): Promise<T> {
    const data: any = this.repository.create(req as any);
    data['createdAt'] = new Date();
    data['updatedAt'] = new Date();
    data['id'] = data.id || generateUUID(this.idPrefix);
    await this.repository.insert(data as any);
    return data as T;
  }

  async update(id: string, req: any): Promise<T> {
    await this.repository.update(id, req);
    return req as T;
  }

  async deleteById(id: string): Promise<DeleteResult> {
    const foundObject = await this.findSingleBy({ id });
    if (isEmpty(foundObject)) {
      throw new NotFoundException(`Can not found object with id ${id}`);
    }
    return this.repository.delete(id);
  }
}
