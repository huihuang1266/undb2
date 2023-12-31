import { z } from 'zod'
import { baseFilter } from './filter.base.js'
import { attachmentFilterOperators } from './operators.js'

const attachmentFilterTypeValue = z.enum(['image', 'video', 'text', 'document', 'excel', 'ppt', 'pdf'])
export type IAttachmentFilterTypeValue = z.infer<typeof attachmentFilterTypeValue>
export const attachmentFilterValue = z.string().or(attachmentFilterTypeValue).or(z.string().array()).nullable()

export const attachmentFilter = z
  .object({
    type: z.literal('attachment'),
    operator: attachmentFilterOperators,
    value: attachmentFilterValue,
  })
  .merge(baseFilter)

export type IAttachmentFilter = z.infer<typeof attachmentFilter>
export type IAttachmentFilterOperator = z.infer<typeof attachmentFilterOperators>
