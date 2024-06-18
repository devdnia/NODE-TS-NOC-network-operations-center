import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log-repository";
import { FetchService } from "../../../config/plugins/fetch.plugins";

interface CheckServiceUseCase {
    execute( url: string ):Promise<boolean>;
}

type SuccesCallback = (() => void) | undefined;
type ErrorCallback = (( error:string ) => void) | undefined;

const origin:string = 'check-service.ts';

export class CheckService implements CheckServiceUseCase {

    constructor(
        private readonly logRepository: LogRepository,
        private readonly succesCallback: SuccesCallback,
        private readonly errorCallback: ErrorCallback
    ){

    }

    public async execute( url: string ):Promise<boolean> {



        try {
            const req = await FetchService.fetchApi( url );

            if( !req.ok ){
                throw new Error(`Error on check service ${ url }`);
            }

            const log = new LogEntity(
                {
                    message: `Service ${ url } working`,
                    level: LogSeverityLevel.low,
                    origin: origin
                });
            this.logRepository.saveLog(  log )
            this.succesCallback && this.succesCallback();

            return true;

        } catch (error) {

            const errorMessage = `${url} is not ok. ${ error }`
            const log = new LogEntity( 
                {
                message: errorMessage, 
                level: LogSeverityLevel.high,
                origin: origin
            });
            this.logRepository.saveLog( log );
           this.errorCallback && this.errorCallback(`${ errorMessage } `);


            return false;
        }


    }


}