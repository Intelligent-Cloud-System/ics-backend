import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { iocContainer } from 'src/ioc';
import { User } from 'src/model/user';
import { AccountService } from 'src/service/account.service';

export class AuthenticationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const container = iocContainer();
    const childContainer = container.createChild();
    Object.defineProperty(req, 'childContainer', { value: childContainer });

    // const authHeader = req.headers['authorization'];
    // const accessToken: string = authHeader ? authHeader.split('Bearer ')[1] : '';

    const accessToken = 'eyJraWQiOiIzaHRkdFBYQnM2bFVUNGtTajhjcVRkUFhxTktoQ2ZaSW80QWdBQWhscGlVPSIsImFsZyI6IlJTMjU2In0.eyJvcmlnaW5fanRpIjoiMjUwZGFhOTAtMjdlMi00YTY1LWEyMDQtOWU1ZjNmOGNmYjM5Iiwic3ViIjoiOThkZWNmZGYtMTlhNS00MWI2LTlkZWYtY2RhZmJlYmQ1NDVkIiwiZXZlbnRfaWQiOiJkYmIzNmEzNS05MmVhLTQ4YmQtYTQ1Yy00NmRhNGM5NWU1Y2QiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNjM3OTY1MTAyLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtY2VudHJhbC0xLmFtYXpvbmF3cy5jb21cL2V1LWNlbnRyYWwtMV9kWTRaZmlaRVkiLCJleHAiOjE2MzgwNTE1MDIsImlhdCI6MTYzNzk2NTEwMiwianRpIjoiMTE2YjExMjAtZThjYS00N2QzLWE2MDMtNjA0NGFiNmE2MTZiIiwiY2xpZW50X2lkIjoiNTdsOGxmdGdyaHJldmtob3NkZG51aTZjODYiLCJ1c2VybmFtZSI6ImRteXRyb0BkaWdpYS5jbyJ9.d95t4uKFBm-uYsSxs5mdblDLOqtgJYMCTH9qikYwSsd3TIblJRoJ0FO73qfTJJv_21cnFI3tKxLZkFruIiH0qM6AO3mUWd-WfyEy-UtaaeLlCD_QD_9hAOM4Z_1mwShfbgKPI527nv2lFZTewJ87iLQ5T1Qug8n3dT9zl5IEYqPP9oNCPGAVqBErGvlUyCzLCdqFPDLM0nUYttZanNQiNWEAzTrj0xCika1jteWW6SA86KSieh11AaGW5mzhvMo24T5qoMRYfHDBP0fjB3lb1oO7cfOnLYR_Py6NuouEW2mlIYVosuHxcJrSyl3jZwsilmPwvi4Df6Ol__q9m_7aFQ';

    const user: User = await container.get(AccountService).getUserByToken(accessToken);
    childContainer.bind<User>(User).toConstantValue(user);

    next();
  }
}
