import { Test, TestingModule } from "@nestjs/testing";
import { SendEmailService } from "./send-email.service";
import { MailerService } from "@nestjs-modules/mailer";
import {
  USER_KAKAO_LOGIN_TOKEN,
  UserKaKaoLoginInterface,
} from "src/kakao-userinfo/interface/kakao-login.interface";

describe("SendEmailService", () => {
  let service: SendEmailService;
  let kakaoUserInfoService: UserKaKaoLoginInterface;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendEmailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        {
          provide: USER_KAKAO_LOGIN_TOKEN,
          useValue: {
            usreEmailActiveTrue: jest.fn(),
            findUserSignUpDate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SendEmailService>(SendEmailService);
    mailerService = module.get<MailerService>(MailerService);
    kakaoUserInfoService = module.get<UserKaKaoLoginInterface>(
      USER_KAKAO_LOGIN_TOKEN
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(kakaoUserInfoService).toBeDefined();
    expect(mailerService).toBeDefined();
  });

  describe("sendEmailToUsersNew", () => {
    const userFindData = [
      {
        id: 1,
        user_name: "지민",
        user_email: "jimin8830@naver.com",
      },
      {
        id: 2,
        user_name: "지민2",
        user_email: "jimin8830@naver.com2",
      },
      {
        id: 3,
        user_name: "지민3",
        user_email: "jimin8830@naver.com3",
      },
    ] as any;

    const noEmailUserDatat = [
      {
        id: 1,
        user_name: "지민",
      },
    ] as any;

    it("어제 회원가입한 사람들에게 메일 보내기", async () => {
      const usersToSendEmail = jest
        .spyOn(kakaoUserInfoService, "findUserSignUpDate")
        .mockResolvedValue(userFindData);

      const mailerServiceResult = jest.spyOn(mailerService, "sendMail");

      await service.sendEmailToUsersNew();

      expect(usersToSendEmail).toBeCalledTimes(1);

      expect(mailerServiceResult).toHaveBeenCalledTimes(3);
      expect(mailerServiceResult).toHaveBeenNthCalledWith(1, {
        to: userFindData[0].user_email,
        from: "jimin8830@naver.com",
        subject: `👋🏻환영해요! 1일차 위셔 ${userFindData[0].user_name}님`,
        text: "welcome nodemailer",
        html: `
              <html>
                <body>
                  <p>안녕하세요, ${userFindData[0].user_name} 님.</p>
                  <p>저희의 소중한 위셔가 되신 것을 환영해요 :)</p>
                  <br>
                  <p>이번 주는 위시보드에 위시카드를 추가해보는 건 어떠신가요?</p>
                  <p>저희가 앞으로도 ${userFindData[0].user_name}님의 위시 달성을 위해 꾸준히 알림을 </p>
                  <p>보내드릴게요! </p>
                  <p>(알림 해제 방법: 설정 > 알림 > off)</p>
                  <br>
                  <p>
                    <a href="https://potenday-project.github.io/Wishu" target="_blank" rel="noopener noreferrer">
                      Click here to visit our website
                    </a>
                  </p>
                </body>
              </html>
            `,
      });
      expect(mailerServiceResult).toHaveBeenNthCalledWith(2, {
        to: userFindData[1].user_email,
        from: "jimin8830@naver.com",
        subject: `👋🏻환영해요! 1일차 위셔 ${userFindData[1].user_name}님`,
        text: "welcome nodemailer",
        html: `
              <html>
                <body>
                  <p>안녕하세요, ${userFindData[1].user_name} 님.</p>
                  <p>저희의 소중한 위셔가 되신 것을 환영해요 :)</p>
                  <br>
                  <p>이번 주는 위시보드에 위시카드를 추가해보는 건 어떠신가요?</p>
                  <p>저희가 앞으로도 ${userFindData[1].user_name}님의 위시 달성을 위해 꾸준히 알림을 </p>
                  <p>보내드릴게요! </p>
                  <p>(알림 해제 방법: 설정 > 알림 > off)</p>
                  <br>
                  <p>
                    <a href="https://potenday-project.github.io/Wishu" target="_blank" rel="noopener noreferrer">
                      Click here to visit our website
                    </a>
                  </p>
                </body>
              </html>
            `,
      });
      expect(mailerServiceResult).toHaveBeenNthCalledWith(3, {
        to: userFindData[2].user_email,
        from: "jimin8830@naver.com",
        subject: `👋🏻환영해요! 1일차 위셔 ${userFindData[2].user_name}님`,
        text: "welcome nodemailer",
        html: `
              <html>
                <body>
                  <p>안녕하세요, ${userFindData[2].user_name} 님.</p>
                  <p>저희의 소중한 위셔가 되신 것을 환영해요 :)</p>
                  <br>
                  <p>이번 주는 위시보드에 위시카드를 추가해보는 건 어떠신가요?</p>
                  <p>저희가 앞으로도 ${userFindData[2].user_name}님의 위시 달성을 위해 꾸준히 알림을 </p>
                  <p>보내드릴게요! </p>
                  <p>(알림 해제 방법: 설정 > 알림 > off)</p>
                  <br>
                  <p>
                    <a href="https://potenday-project.github.io/Wishu" target="_blank" rel="noopener noreferrer">
                      Click here to visit our website
                    </a>
                  </p>
                </body>
              </html>
            `,
      });
    });

    it("이메일 없는 유저 인 경우 메일 안보냄", async () => {
      const usersToSendEmail = jest
        .spyOn(kakaoUserInfoService, "findUserSignUpDate")
        .mockResolvedValue(noEmailUserDatat);

      const mailerServiceResult = jest.spyOn(mailerService, "sendMail");

      await service.sendEmailToUsersNew();

      expect(usersToSendEmail).toBeCalledTimes(1);
      expect(mailerServiceResult).toHaveBeenCalledTimes(0);
    });
  });

  describe("sendEmailToUsers", () => {
    const userFindData = [
      {
        id: 1,
        user_name: "지민",
        user_email: "jimin8830@naver.com",
      },
      {
        id: 2,
        user_name: "지민2",
        user_email: "jimin8830@naver.com2",
      },
      {
        id: 3,
        user_name: "지민3",
        user_email: "jimin8830@naver.com3",
      },
    ] as any;

    it("어제, 오늘 회원가입한 사람들 제외하고 메일 보내기 + email 알람 on인 경우", async () => {
      const usersToSendEmail = jest
        .spyOn(kakaoUserInfoService, "usreEmailActiveTrue")
        .mockResolvedValue(userFindData);

      const mailerServiceResult = jest.spyOn(mailerService, "sendMail");

      await service.sendEmailToUsers();

      expect(usersToSendEmail).toBeCalledTimes(1);

      expect(mailerServiceResult).toHaveBeenCalledTimes(3);
      expect(mailerServiceResult).toHaveBeenNthCalledWith(1, {
        to: userFindData[0].user_email,
        from: "jimin8830@naver.com",
        subject: `🗓️ 위슈와 맞이하는 한 주의 시작!`,
        text: "welcome nodemailer",
        html: `
              <html>
                <body>
                  <p>안녕하세요, ${userFindData[0].user_name} 님.</p>
                  <p>위슈와 함께 맞는 첫 주에요!</p>
                  <br>
                  <p>이번 주는 3개의 위시카드 달성을 목표로 해보는 건 어떨까요? 😉</p>
                  <p>위슈와 함께 위시를 이뤄간다면 지난 주보다 더욱 풍성한 한 주가 될 거에요!</p>
                  <br>
                  <p>달성한 위시들은 위슈에게 알려주는 것! 잊지 마세요~ 🤙🏻</p>
                  <br>
                  <p>
                    <a href="https://potenday-project.github.io/Wishu" target="_blank" rel="noopener noreferrer">
                      Click here to visit our website
                    </a>
                  </p>
                </body>
              </html>
            `,
      });
      expect(mailerServiceResult).toHaveBeenNthCalledWith(2, {
        to: userFindData[1].user_email,
        from: "jimin8830@naver.com",
        subject: `🗓️ 위슈와 맞이하는 한 주의 시작!`,
        text: "welcome nodemailer",
        html: `
              <html>
                <body>
                  <p>안녕하세요, ${userFindData[1].user_name} 님.</p>
                  <p>위슈와 함께 맞는 첫 주에요!</p>
                  <br>
                  <p>이번 주는 3개의 위시카드 달성을 목표로 해보는 건 어떨까요? 😉</p>
                  <p>위슈와 함께 위시를 이뤄간다면 지난 주보다 더욱 풍성한 한 주가 될 거에요!</p>
                  <br>
                  <p>달성한 위시들은 위슈에게 알려주는 것! 잊지 마세요~ 🤙🏻</p>
                  <br>
                  <p>
                    <a href="https://potenday-project.github.io/Wishu" target="_blank" rel="noopener noreferrer">
                      Click here to visit our website
                    </a>
                  </p>
                </body>
              </html>
            `,
      });
      expect(mailerServiceResult).toHaveBeenNthCalledWith(3, {
        to: userFindData[2].user_email,
        from: "jimin8830@naver.com",
        subject: `🗓️ 위슈와 맞이하는 한 주의 시작!`,
        text: "welcome nodemailer",
        html: `
              <html>
                <body>
                  <p>안녕하세요, ${userFindData[2].user_name} 님.</p>
                  <p>위슈와 함께 맞는 첫 주에요!</p>
                  <br>
                  <p>이번 주는 3개의 위시카드 달성을 목표로 해보는 건 어떨까요? 😉</p>
                  <p>위슈와 함께 위시를 이뤄간다면 지난 주보다 더욱 풍성한 한 주가 될 거에요!</p>
                  <br>
                  <p>달성한 위시들은 위슈에게 알려주는 것! 잊지 마세요~ 🤙🏻</p>
                  <br>
                  <p>
                    <a href="https://potenday-project.github.io/Wishu" target="_blank" rel="noopener noreferrer">
                      Click here to visit our website
                    </a>
                  </p>
                </body>
              </html>
            `,
      });
    });
  });
});
