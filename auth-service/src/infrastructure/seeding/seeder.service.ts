import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { IPasswordHasher } from '@/application/ports/password-hasher.port';
import { User } from '@/domain/entities/user.entity';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,

    @Inject(IPasswordHasher)
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdminUser();
  }

  private async seedAdminUser() {
    const adminEmail = 'admin@bank.com';
    const adminPassword = 'Admin123!';

    const existingUser = await this.userRepository.findByEmail(adminEmail);

    if (existingUser) {
      console.log('Admin user already exists.');
      return;
    }

    const passwordHash = await this.passwordHasher.hash(adminPassword);

    const adminUser = User.create({
      email: adminEmail,
      passwordHash: passwordHash,
    });

    await this.userRepository.save(adminUser);
    console.log('Admin user seeded successfully!');
  }
}
