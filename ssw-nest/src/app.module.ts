import { Module } from '@nestjs/common';
import { ContentGateway } from './content/content.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [ContentGateway],
})
export class AppModule {}
