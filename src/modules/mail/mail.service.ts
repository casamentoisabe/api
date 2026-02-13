import { Injectable } from '@nestjs/common';
import Mailgun from 'mailgun.js';
import FormData from 'form-data';

@Injectable()
export class MailService {
  private mg;

  constructor() {
    const mailgun = new Mailgun(FormData);

    this.mg = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY!,
    });
  }

  public async sendInvite(name: string, email: string) {
    const html = this.inviteTemplate(name?.split(' ')[0]);

    return this.mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: `Casamento Isa & Be 💍 <noivos@${process.env.MAILGUN_DOMAIN}>`,
      to: [email],
      subject: 'Confirmação de presença 💌',
      text: `Olá ${name?.split(' ')[0]}, obrigado por confirmar sua presença!`,
      html,
    });
  }

  private inviteTemplate(name: string): string {
    return `
      <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Confirmação de Presença</title>
          </head>

          <body style="margin: 0; padding: 0; background-color: #e8e3d9">
            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="background-color: #e8e3d9; padding: 50px 0"
            >
              <tr>
                <td align="center">
                  <table
                    width="620"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="
                      background-color: #f8f6f1;
                      border-radius: 10px;
                      overflow: hidden;
                      font-family: Georgia, serif;
                    "
                  >
                    <!-- HEADER -->
                    <tr>
                      <td
                        align="center"
                        style="padding: 50px 40px 30px 40px; background-color: #f8f6f1"
                      >
                        <p
                          style="
                            margin: 0;
                            letter-spacing: 4px;
                            font-size: 12px;
                            color: #dfb03a;
                          "
                        >
                          SAVE THE DATE
                        </p>

                        <img
                          src="https://casamentoisaebe.com.br/images/monograma-bg.png"
                          alt="Isadora & Bernardo"
                          style="
                            width: 50%;
                            margin: 15px auto 10px auto;
                            display: block;
                          "
                        />

                        <p
                          style="
                            margin: 0;
                            font-size: 14px;
                            letter-spacing: 3px;
                            color: #013179;
                          "
                        >
                          15 • 05 • 2027
                        </p>
                      </td>
                    </tr>

                    <!-- GOLD DIVIDER -->
                    <tr>
                      <td align="center">
                        <div
                          style="height: 2px; width: 90px; background-color: #dfb03a"
                        ></div>
                      </td>
                    </tr>

                    <!-- MESSAGE -->
                    <tr>
                      <td
                        style="
                          padding: 50px 50px;
                          background-color: #e8e3d9;
                          text-align: center;
                          color: #013179;
                        "
                      >
                        <p style="font-size: 20px; margin-bottom: 25px">
                          Olá, <strong>${name}</strong>
                        </p>

                        <p
                          style="font-size: 16px; line-height: 1.7; margin-bottom: 25px"
                        >
                          Recebemos com alegria a confirmação da sua presença. Será uma
                          honra celebrar esse momento tão especial ao seu lado.
                        </p>

                        <p style="font-size: 16px; line-height: 1.7">
                          Prepare-se para uma noite inesquecível.
                        </p>
                      </td>
                    </tr>

                    <!-- EVENT INFO -->
                    <tr>
                      <td
                        style="
                          padding: 45px 50px;
                          background-color: #f8f6f1;
                          color: #013179;
                        "
                      >
                        <h2
                          style="
                            text-align: center;
                            font-weight: normal;
                            font-size: 24px;
                            margin-bottom: 35px;
                            color: #dfb03a;
                          "
                        >
                          Informações do Evento
                        </h2>

                        <p style="margin: 12px 0; font-size: 15px">
                          📅 <strong>Data:</strong> 15/05/2027
                        </p>

                        <p style="margin: 12px 0; font-size: 15px">
                          🏡 <strong>Local:</strong> Casa Nossa Eventos
                        </p>

                        <p style="margin: 12px 0; font-size: 15px">
                          📍 <strong>Endereço:</strong> Av. Assis Brasil, 1144 - Santa
                          Maria Goretti<br />
                          Porto Alegre - RS
                        </p>

                        <p style="margin: 12px 0; font-size: 15px">
                          🕖 <strong>Horário:</strong> 19h — seja pontual
                        </p>

                        <p style="margin: 12px 0; font-size: 15px">
                          🌤️ A cerimônia ocorrerá ao ar livre. Confira a previsão do
                          tempo no dia.
                        </p>

                        <p style="margin: 25px 0 0 0; font-size: 15px">
                          🌐 Saiba tudo sobre o evento no site:<br />
                          <a
                            href="https://casamentoisaebe.com.br"
                            style="
                              color: #dfb03a;
                              text-decoration: none;
                              font-weight: bold;
                            "
                          >
                            casamentoisaebe.com.br
                          </a>
                        </p>
                      </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                      <td
                        align="center"
                        style="
                          padding: 50px 40px;
                          background-color: #e8e3d9;
                          color: #013179;
                        "
                      >
                        <p style="margin: 0; font-size: 18px">Com amor,</p>

                        <p style="margin: 12px 0 0 0; font-size: 26px; color: #dfb03a">
                          Isa & Be ❤️
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
    `;
  }
}
