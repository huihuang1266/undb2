/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import type {
  AutoIncrementField as CoreAutoIncrementField,
  BoolField as CoreBoolField,
  CreatedAtField as CoreCreatedAtField,
  DateField as CoreDateField,
  DateRangeField as CoreDateRangeField,
  EmailField as CoreEmailField,
  IdField as CoreIdField,
  IFieldVisitor,
  NumberField as CoreNumberField,
  ParentField as CoreParentField,
  ReferenceField as CoreReferenceField,
  SelectField as CoreSelectField,
  StringField as CoreStringField,
  TreeField as CoreTreeField,
  UpdatedAtField as CoereUpdatedAtField,
} from '@egodb/core'
import { INTERNAL_COLUMN_ID_NAME } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import { wrap } from '@mikro-orm/core'
import type { Table } from '../../entity'
import {
  AutoIncrementField,
  BoolField,
  CreatedAtField,
  DateField,
  DateRangeField,
  EmailField,
  IdField,
  NumberField,
  Option,
  ParentField,
  ReferenceField,
  SelectField,
  StringField,
  TreeField,
  UpdatedAtField,
} from '../../entity'
import { AdjacencyListTable, ClosureTable } from '../../underlying-table/underlying-foreign-table'
import { BaseEntityManager } from '../base-entity-manager'

export class TableSqliteFieldVisitor extends BaseEntityManager implements IFieldVisitor {
  constructor(private readonly table: Table, em: EntityManager) {
    super(em)
  }
  id(value: CoreIdField): void {
    const field = new IdField(this.table, value)

    this.em.persist(field)
  }

  createdAt(value: CoreCreatedAtField): void {
    const field = new CreatedAtField(this.table, value)

    this.em.persist(field)
  }

  updatedAt(value: CoereUpdatedAtField): void {
    const field = new UpdatedAtField(this.table, value)

    this.em.persist(field)
  }

  autoIncrement(value: CoreAutoIncrementField): void {
    const field = new AutoIncrementField(this.table, value)

    this.em.persist(field)
  }

  string(value: CoreStringField): void {
    const field = new StringField(this.table, value)

    this.em.persist(field)
  }

  email(value: CoreEmailField): void {
    const field = new EmailField(this.table, value)

    this.em.persist(field)
  }

  number(value: CoreNumberField): void {
    const field = new NumberField(this.table, value)

    this.em.persist(field)
  }

  bool(value: CoreBoolField): void {
    const field = new BoolField(this.table, value)

    this.em.persist(field)
  }

  date(value: CoreDateField): void {
    const field = new DateField(this.table, value)

    this.em.persist(field)
  }

  dateRange(value: CoreDateRangeField): void {
    const field = new DateRangeField(this.table, value)

    this.em.persist(field)
  }

  select(value: CoreSelectField): void {
    const field = new SelectField(this.table, value)
    wrap(field).assign({ options: value.options.options.map((option) => new Option(field, option)) })
    this.em.persist(field)
  }

  reference(value: CoreReferenceField): void {
    const field = new ReferenceField(this.table, value)
    this.em.persist(field)

    const adjacencyListTable = new AdjacencyListTable(this.table.id, value)

    const queries = adjacencyListTable.getCreateTableSqls(this.em.getKnex())

    this.addQueries(...queries)
  }

  private initClosureTable(value: CoreTreeField | CoreParentField) {
    const tableId = this.table.id

    const closureTable = new ClosureTable(tableId, value)

    const knex = this.em.getKnex()

    const queries = closureTable.getCreateTableSqls(knex)
    this.addQueries(...queries)

    const insert = knex
      .insert(
        knex
          .select([
            `${INTERNAL_COLUMN_ID_NAME} as ${ClosureTable.CHILD_ID}`,
            `${INTERNAL_COLUMN_ID_NAME} as ${ClosureTable.PARENT_ID}`,
            knex.raw('? as ??', [0, ClosureTable.DEPTH]),
          ])
          .from(tableId),
      )
      .into(closureTable.name)
      .onConflict()
      .merge()
      .toQuery()
    this.addQueries(insert)
  }

  tree(value: CoreTreeField): void {
    const field = new TreeField(this.table, value)
    field.parentFieldId = value.parentFieldId!.value
    this.em.persist(field)

    this.initClosureTable(value)
  }

  parent(value: CoreParentField): void {
    const field = new ParentField(this.table, value)
    field.treeFieldId = value.treeFieldId.value
    this.em.persist(field)
  }
}
