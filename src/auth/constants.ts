export const jwtContants = {
  secret: `${process.env.JWT_SECRET}`,
};
enum PostgresErrorCode {
  UniqueViolation = '23505',
}
export default PostgresErrorCode;
