import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { PrismaModule } from './prisma/prisma.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ServiciosModule } from './modules/servicios/servicios.module';
import { LeadsModule } from './modules/leads/leads.module';
import { CotizacionesModule } from './modules/cotizaciones/cotizaciones.module';
import { ProyectosModule } from './modules/proyectos/proyectos.module';
import { ContenidoModule } from './modules/contenido/contenido.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ServiciosModule,
    LeadsModule,
    CotizacionesModule,
    ProyectosModule,
    ContenidoModule,
    AnalyticsModule,
  ],
  controllers: [HealthController],
  providers: [
    // Autenticación global: todo requiere JWT salvo lo marcado @Public()
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
