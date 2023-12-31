import { Mixin } from 'ts-mixer'
import { z } from 'zod'
import type { ISumFilter, ISumFilterOperator } from '../filter/sum.filter.js'
import type { RecordValueJSON } from '../record/record.schema.js'
import type { IRecordDisplayValues } from '../record/record.type.js'
import { AbstractAggregateField, AbstractLookupField, BaseField } from './field.base.js'
import type { ISumField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { SumFieldValue } from './sum-field-value.js'
import type { ICreateSumFieldInput, ICreateSumFieldValue, SumType } from './sum-field.type.js'
import { FieldId } from './value-objects/field-id.vo.js'

export class SumField extends Mixin(AbstractAggregateField<ISumField>, AbstractLookupField<ISumField>) {
  duplicate(name: string): SumField {
    return SumField.create({
      ...this.json,
      id: FieldId.createId(),
      name,
      display: false,
    })
  }

  type: SumType = 'sum'
  override get json() {
    return {
      ...super.json,
      referenceFieldId: this.referenceFieldId.value,
      aggregateFieldId: this.aggregateFieldId.value,
    }
  }

  override get primitive() {
    return true
  }

  static create(input: Omit<ICreateSumFieldInput, 'type'>): SumField {
    return new SumField({
      ...BaseField.createBase(input),
      referenceFieldId: FieldId.fromString(input.referenceFieldId),
      aggregateFieldId: FieldId.fromString(input.aggregateFieldId),
    })
  }

  static unsafeCreate(input: ICreateSumFieldInput): SumField {
    return new SumField({
      ...BaseField.unsafeCreateBase(input),
      referenceFieldId: FieldId.fromString(input.referenceFieldId),
      aggregateFieldId: FieldId.fromString(input.aggregateFieldId),
    })
  }

  getDisplayValue(valueJson: RecordValueJSON, displayValues?: IRecordDisplayValues): number | null {
    return valueJson[this.id.value] ?? null
  }

  createValue(value: ICreateSumFieldValue): SumFieldValue {
    return new SumFieldValue(value)
  }

  createFilter(operator: ISumFilterOperator, value: number | null): ISumFilter {
    return { operator, value, path: this.id.value, type: 'sum' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.sum(this)
  }

  get valueSchema() {
    const sum = z.number().int().nonnegative()
    return this.required ? sum : sum.nullable()
  }
}
