import { CheckService } from '../domain/use-cases/checks/check-service';
import { SendEmailLogs } from '../domain/use-cases/logs/send-email-logs';
import { FileSystemDatasource } from '../infrastructure/datasources/file-system.datasource';
import { LogRepositoryImpl } from '../infrastructure/repositories/log.repository.impl';
import { CronService } from './cron/cron-service';
import { EmailService } from './email/email.service';



const fileSystemLogRepository = new LogRepositoryImpl(
    new FileSystemDatasource(),
)

const emailService = new EmailService();

export class Server {

    public static start(){

        console.log('Server started...' );
      
        // Mandar correos
        // new SendEmailLogs(
        //     emailService,
        //     fileSystemLogRepository
        // ).execute(
        //     'iperezportillo1984@gmail.com'
        // )

        // CronService.createJob( 
        //     '*/5 * * * * *',
        //     () =>{
        //         //new CheckService().execute( 'http://localhost:3000' );
        //         const url = 'http://google.com';
        //         new CheckService(
        //             fileSystemLogRepository,
        //             () => console.log( `${ url } is ok`),
        //             ( error ) => console.log( error )
        //         ).execute( url );
        //     }
        // );


    };


}