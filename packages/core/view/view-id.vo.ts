import { ValueObject } from '@egodb/domain'
import { z } from 'zod'
import type { ViewName } from './view-name.vo'

export const viewIdSchema = z.string().min(1)

export class ViewId extends ValueObject<string> {
  public get value() {
    return this.props.value
  }

  static fromName(viewName: ViewName) {
    return new this({ value: viewName.value })
  }

  static create(id: string) {
    return new this({ value: id })
  }
}
