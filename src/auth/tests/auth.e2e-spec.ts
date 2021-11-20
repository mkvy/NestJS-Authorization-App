import { INestApplication, LoggerService } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../../app.module";
import * as request from 'supertest'

class TestLogger implements LoggerService {
  log(message: string) {}
  error(message: string, trace: string) {}
  warn(message: string) {}
  debug(message: string) {}
  verbose(message: string) {}
}
describe('Auth Controller (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useLogger(new TestLogger());
    await app.init();
    //db conn???
  })
  afterAll(async () => {
    await Promise.all([
      app.close(),
    ])
  });
  describe('AuthModule', () => {
    let jwtToken: string;
    // assume test data includes user test@example.com with password 'password'
    it('authenticates user with valid credentials and provides a jwt token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password' })
        .expect(200)

      // set jwt token for use in subsequent tests
      jwtToken = response.body.accessToken
      expect(jwtToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/) // jwt regex
    })

    it('fails to authenticate user with an incorrect password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'wrong' })
        .expect(401)

      expect(response.body.accessToken).not.toBeDefined()
    })

    // assume test data does not include a nobody@example.com user
    it('fails to authenticate user that does not exist', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'nobody@example.com', password: 'test' })
        .expect(401)

      expect(response.body.accessToken).not.toBeDefined()
    })

    describe('Protected', () => {
      it('gets protected resource with jwt authenticated request', async () => {
        const response = await request(app.getHttpServer())
          .get('/protected')
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect(200)

        const data = response.body.data
        // add assertions that reflect your test data
        // expect(data).toHaveLength(3)
      })
    })
  })
})