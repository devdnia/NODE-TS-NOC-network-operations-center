import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log-repository";
import { FetchService } from "../fetch/fetch-service";

interface CheckServiceUseCase {
    execute( url: string ):Promise<boolean>;
}

type SuccesCallback = () => void;
type ErrorCallback = ( error:string ) => void;



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

            const log = new LogEntity(`Service ${ url } working`, LogSeverityLevel.low );
            this.logRepository.saveLog(  log )
            this.succesCallback && this.succesCallback();

            return true;

        } catch (error) {

            const errorMessage = `${url} is not ok. ${ error }`
            const log = new LogEntity( errorMessage, LogSeverityLevel.high );
            this.logRepository.saveLog( log );
           this.errorCallback && this.errorCallback(`${ errorMessage } `);


            return false;
        }


    }


}