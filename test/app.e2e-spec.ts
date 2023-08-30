import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';


describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3001);
    prisma = app.get(PrismaService);
    await prisma.cleanDB();
    pactum.request.setBaseUrl('http://localhost:3001')
  });

  afterAll(async () => {
    app.close();
  });
  describe('Auth', () => {

    describe('Signup', () => {
      //it.todo('should signup');
      it('should throw if email is empty', () => {
        const data = {
          email: "side.sarr@gmail.com",
          password: "Passer123@",
        };
        return pactum
          .spec()
          .post('/auth/signup',)
          .withBody({
            password: data.password,
          })
          .expectStatus(400);
      });
      it('should throw if password is empty', () => {
        const data = {
          email: "side.sarr@gmail.com",
          password: "Passer123@",
        };
        return pactum
          .spec()
          .post('/auth/signup',)
          .withBody({
            email: data.email,
          })
          .expectStatus(400);
      });
      it('should throw if nobody is provided', () => {
        const data = {
          email: "side.sarr@gmail.com",
          password: "Passer123@",
        };
        return pactum
          .spec()
          .post('/auth/signup',)
          .expectStatus(400);
      });
      it('Should signup', () => {
        const data: AuthDto = {
          email: 'side.sarr@gmail.com',
          password: 'Passer123@'
        };
        return pactum
          .spec()
          .post('/auth/signup',)
          .withBody(data)
          .expectStatus(201);
          //.inspect();
      });
    });

    describe('Signin', () => {
      //it.todo('should signin');
      it('should throw if email is empty', () => {
        const data = {
          email: "side.sarr@gmail.com",
          password: "Passer123@",
        };
        return pactum
          .spec()
          .post('/auth/login',)
          .withBody({
            password: data.password,
          })
          .expectStatus(400);
      });
      it('should throw if password is empty', () => {
        const data = {
          email: "side.sarr@gmail.com",
          password: "Passer123@",
        };
        return pactum
          .spec()
          .post('/auth/login',)
          .withBody({
            email: data.email,
          })
          .expectStatus(400);
      });
      it('should throw if nobody is provided', () => {
        const data = {
          email: "side.sarr@gmail.com",
          password: "Passer123@",
        };
        return pactum
          .spec()
          .post('/auth/login',)
          .expectStatus(400);
      });
      it('Should signin', () => {
        const data: AuthDto = {
          email: 'side.sarr@gmail.com',
          password: 'Passer123@',
        };
        return pactum
          .spec()
          .post('/auth/login',)
          .withBody(data)
          .expectStatus(200)
          .stores('userAt', 'access_token');
          //.inspect();
      });
    });

  });
  describe('User', () => {

    describe('GetMe', () => {
      it('should return current User', () => {
        return pactum
          .spec()
          //.withHeaders('Authorization', 'Bearer $S{userAt}')
          .get('/users/me')
          .expectStatus(200)
          .withBearerToken('$S{userAt}');
      });
    });

    describe('Edit User', () => {
      it('should edit user', () => {
        const dto = {
          email: 'user@example.com',
          firstName: 'John',
          lastName: 'Doe',
        };
        return pactum
          .spec()
          .patch('/users')
          .withBody(dto)
          .withBearerToken('$S{userAt}')
          .expectStatus(200);
      });
    });

  });
  describe('Bookmarks', () => {

    describe('Create Bookmark', () => {
      it('should create a bookmark', () => {
        const dto = {
          title: 'bookmark title',
          description: 'bookmark description',
        };
        return pactum
          .spec()
          .post('/bookmarks/')
          .withBody(dto)
          .withBearerToken('$S{userAt}')
          .stores('bookmarkId', 'id');
      });
    });

    describe('Get Bookmarks', () => {
      it('should get the bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders('Authorization', 'Bearer $S{userAt}')
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get Bookmark by id', () => {
      it('should return the bookmark with the given id', () => {
        return pactum
          .spec()
          .get('/bookmarks/$S{bookmarkId}')
          .withHeaders('Authorization', 'Bearer $S{userAt}')
          .expectStatus(200)
          .inspect();
      });
    });

    describe('Delete Bookmark', () => {
      it('should delete bookmark with given user id and bookmark id', () => {
        return pactum
          .spec()
          .delete('/bookmarks/$S{bookmarkId}')
          .withHeaders('Authorization', 'Bearer $S{userAt}')
          .expectStatus(200);
      });
    });

  });
});
