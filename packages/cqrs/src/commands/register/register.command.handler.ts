import {
  IUserRepository,
  UserFactory,
  WithUserColor,
  WithUserEmail,
  WithUserId,
  WithUserPassword,
  WithUsername,
} from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import { IRegisterCommandOutput } from './register.command.interface.js'
import type { RegisterCommand } from './register.command.js'

type IRegisterCommandHandler = ICommandHandler<RegisterCommand, IRegisterCommandOutput>

export class RegisterCommandHandler implements IRegisterCommandHandler {
  constructor(protected readonly repo: IUserRepository) {}

  async execute({ email, password }: RegisterCommand): Promise<IRegisterCommandOutput> {
    const exists = await this.repo.exists(WithUserEmail.fromString(email))
    if (exists) throw new Error('user already exists')

    const user = UserFactory.create(
      WithUserEmail.fromString(email),
      WithUserPassword.fromString(password),
      WithUserId.create(),
      WithUsername.fromEmail(email),
      WithUserColor.random(),
    )

    await this.repo.insert(user)

    return { email, sub: user.userId.value }
  }
}
