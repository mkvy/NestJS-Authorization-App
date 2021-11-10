export const jwtContants = {
  secret: process.env.JWT_SECRET as string,
};

export enum ResponseStatuses { OK = 'OK', ERROR = 'ERROR' }