import { ValueObject } from '@egodb/domain'
import { z } from 'zod'

export const viewNameSchema = z.string().min(1, { message: 'view name should has at least one character' })

export class ViewName extends ValueObject<string> {
  public get value() {
    return this.props.value
  }

  static create(name: string): ViewName {
    return new ViewName({ value: viewNameSchema.parse(name) })
  }
}
