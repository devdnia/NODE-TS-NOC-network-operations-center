import nodemailer from 'nodemailer';
import { envs } from '../../config/plugins/envs.plugins';
import { LogRepository } from '../../domain/repository/log-repository';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';


interface SendMailOptions {
    to: string | string[];
    subject: string;
    htmlBody: string;
    attachements?: Attachement[];
}

interface Attachement {
    filename: string;
    path: string;
}


export class EmailService {

    private trasporter = nodemailer.createTransport({
        service: envs.MAILER_SERVICE,
        auth: {
            user: envs.MAILER_EMAIL,
            pass: envs.MAILER_SECRET_KEY
        }
    });

    constructor(){}


    async sendEmail(options: SendMailOptions): Promise<boolean> {

        const { to, subject, htmlBody, attachements = [] } = options;

        try {

            const sentInformation = await this.trasporter.sendMail({
                to,
                subject,
                html: htmlBody,
                attachments: attachements
            });

            const log = new LogEntity({
                level: LogSeverityLevel.low,
                message: 'Email sent',
                origin: 'email.service.ts'
            })


            return true;
            
        } catch (error) {
            const log = new LogEntity({
                level: LogSeverityLevel.high,
                message: 'Email not sent',
                origin: 'email.service.ts'
            })


            return false;
        }

    }

   async sendEmailWithFileSystemLogs( to: string | string[] ) {
        const subject = 'Logs del servidor'
        const htmlBody = `
                <h3>Logs de sistema - NOC</h3>
                <p> Ad dolore amet veniam aliqua id magna. Et id eiusmod id deserunt anim id esse deserunt magna amet mollit laboris. Do et ullamco aute nostrud ullamco nisi ullamco laboris cillum esse velit ea. Est exercitation velit aliquip mollit nulla velit do sit id Lorem. Commodo adipisicing Lorem ipsum aute. Labore minim do non magna aute adipisicing culpa enim aute.</p>
            `;
        const attachements: Attachement[] = [
            { filename: 'logs-all.log',     path: './logs/logs-all.log' },
            { filename: 'logs-high.log',    path: './logs/logs-high.log' },
            { filename: 'logs-medium.log',  path: './logs/logs-medium.log' }
        ]

        return this.sendEmail({
            to, subject, attachements, htmlBody
        })
    };



}