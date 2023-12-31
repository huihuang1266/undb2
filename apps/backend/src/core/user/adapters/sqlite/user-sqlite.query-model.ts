import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { IQueryUser, type UserSpecification } from '@undb/core'
import { EntityManager, UserSqliteQueryModel } from '@undb/sqlite'
import { Option } from 'oxide.ts'

@Injectable()
export class NestUserSqliteQueryModel extends UserSqliteQueryModel {
  constructor(protected readonly orm: MikroORM) {
    super(orm.em as EntityManager)
  }

  @UseRequestContext()
  override find() {
    return super.find()
  }

  @UseRequestContext()
  override findOne(spec: UserSpecification) {
    return super.findOne(spec)
  }

  @UseRequestContext()
  override async findOneById(id: string): Promise<Option<IQueryUser>> {
    return super.findOneById(id)
  }
}
