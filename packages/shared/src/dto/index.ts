

export * from './common';
export * from './entities.dto';

import { WsNotificationDto } from './entities.dto';

/**
 * Union type for all Redis Pub/Sub message types
 */
export type RedisPubSubMessage = WsNotificationDto;
