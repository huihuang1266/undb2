import { EntityManager } from '@mikro-orm/better-sqlite'
import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import { IQueryWebhook, type WebhookSpecification } from '@undb/integrations'
import { WebhookSqliteQueryModel } from '@undb/sqlite'
import { Option } from 'oxide.ts'

export const WEBHOOK_QUERY_MODEL = Symbol('WEBHOOK_QUERY_MODEL')
export const InjectWebhookQueryModel = () => Inject(WEBHOOK_QUERY_MODEL)

@Injectable()
export class NestWebhookSqliteQueryModel extends WebhookSqliteQueryModel {
  constructor(public readonly orm: MikroORM) {
    super(orm.em as EntityManager)
  }

  @UseRequestContext()
  find(spec: WebhookSpecification | null): Promise<IQueryWebhook[]> {
    return super.find(spec)
  }

  @UseRequestContext()
  findOne(spec: WebhookSpecification): Promise<Option<IQueryWebhook>> {
    return super.findOne(spec)
  }

  @UseRequestContext()
  findOneById(id: string): Promise<Option<IQueryWebhook>> {
    return super.findOneById(id)
  }
}
