export const jwtContants = {
  secret: process.env.JWT_SECRET as string,
};

export enum PostgresErrorCode {
  UniqueViolation = '23505',
}

export enum ResponseStatuses { OK = 'OK', ERROR = 'ERROR' }