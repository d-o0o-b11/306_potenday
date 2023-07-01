import { Injectable } from "@nestjs/common";
import { CreateSendEmailDto } from "./dto/create-send-email.dto";
import { UpdateSendEmailDto } from "./dto/update-send-email.dto";
import { KakaoUserinfoService } from "src/kakao-userinfo/kakao-userinfo.service";
import { MailerService } from "@nestjs-modules/mailer";
import * as path from "path";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class SendEmailService {
  constructor(
    private readonly kakaoUserInfoService: KakaoUserinfoService,
    private readonly mailerService: MailerService
  ) {}

  // 이메일 전송 로직
  async sendEmailToUsers() {
    // 메일을 보낼 사용자 조회 로직
    // signupDate가 현재 일자의 전날인 사용자들을 조회합니다.
    // 예시로는 TypeORM을 사용하여 DB 조회 로직을 작성합니다.
    const usersToSendEmail =
      await this.kakaoUserInfoService.findUserSignUpDate();

    try {
      // 각 사용자에게 이메일을 보냅니다.
      for (const user of usersToSendEmail) {
        const html = `
              <html>
                <body>
                  <p>안녕하세요, ${user.user_name} 님.</p>
                  <p>저희의 소중한 위셔가 되신 것을 환영해요 :)</p>
                  <br>
                  <p>이번 주는 위시보드에 위시카드를 추가해보는 건 어떠신가요?</p>
                  <p>저희가 앞으로도 ${user.user_name}님의 위시 달성을 위해 꾸준히 알림을 </p>
                  <p>보내드릴게요! </p>
                  
                  <p>
                    <a href="https://potenday-project.github.io/Wishu" target="_blank" rel="noopener noreferrer">
                      Click here to visit our website
                    </a>
                  </p>
                </body>
              </html>
            `;

        //유저 이메일 존재하면 보내기
        if (user.user_email) {
          this.mailerService.sendMail({
            to: `${user.user_email}`,
            from: "jimin8830@naver.com",
            subject: `👋🏻환영해요! 1일차 위셔 ${user.user_name}님`,
            text: "welcome nodemailer ",
            html: html,
          });
        }
      }
    } catch (e) {
      throw new Error("이메일 전송 실패");
    }
  }

  // 매일 오전 10시에 sendEmailToUsers() 메서드를 실행합니다.
  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  handleCron() {
    this.sendEmailToUsers();
  }

  async sendMail() {
    const user_name = "지민";
    // const imagePath = path.join(__dirname, "..", "..", "img", "email.png");

    // const imagePath = path.join(__dirname, "email.png");
    const imagePath = path.join(
      process.cwd(),
      "src",
      "send-email",
      "email.png"
    );
    console.log("ima", imagePath);

    const img = "/email.png";

    const html = `
      <html>
        <body>
          <img src="email.png" alt="Image" width="550" height="220">
          <p>안녕하세요, ${user_name} 님.</p>
          <p>저희의 소중한 위셔가 되신 것을 환영해요 :)</p>
          <br>
          <p>이번 주는 위시보드에 위시카드를 추가해보는 건 어떠신가요?</p>
          <p>저희가 앞으로도 ${user_name}님의 위시 달성을 위해 꾸준히 알림을 </p>
          <p>보내드릴게요! </p>
          
          <p>
            <a href="https://potenday-project.github.io/Wishu" target="_blank" rel="noopener noreferrer">
              Click here to visit our website
            </a>
          </p>
        </body>
      </html>
    `;
    try {
      this.mailerService.sendMail({
        to: "jimin8830@naver.com",
        from: "jimin8830@naver.com",
        subject: `👋🏻환영해요! 1일차 위셔 ${user_name}님`,
        text: "welcome nodemailer ",
        html: html,
      });
    } catch (e) {
      throw new Error("이메일 전송 실패");
    }
  }
}
