import fs from "fs";

import { LogDatasource } from "../../domain/datasources/log-datasource";
import { LogEntity, LogSeveryLevel } from '../../domain/entities/log.entity';


export class FileSystemDataSource implements LogDatasource{

    private readonly logPath        = 'logs/'; 
    private readonly allLogsPath    = 'logs/logs-all.log'; 
    private readonly mediumLogsPath = 'logs/logs-medium.log'; 
    private readonly highLogsPath   = 'logs/logs-high.log'; 


    constructor(){
        this.createLogsFile();
    }

    private createLogsFile = () => {

        if( !fs.existsSync( this.logPath )){
            fs.mkdirSync( this.logPath )
        }

        [
            this.allLogsPath,
            this.mediumLogsPath,
            this.highLogsPath
        ].forEach( path => {
            if( fs.existsSync( path ) ) return;
            fs.mkdirSync( path, '');
        })

    }

    async saveLog( newLog: LogEntity): Promise<void> {
       
        const logAsJson = `${ JSON.stringify( newLog )}\n`;

        fs.appendFileSync( this.allLogsPath, logAsJson );

        if( newLog.level === LogSeveryLevel.low ) return;

        if( newLog.level === LogSeveryLevel.medium ){
            fs.appendFileSync( this.mediumLogsPath, logAsJson );
        }
        else {
            fs.appendFileSync( this.highLogsPath, logAsJson );
        }

    
    }

    private getLogsFromFile = ( path: string ): LogEntity[] => {

        const content = fs.readFileSync( path, 'utf-8');

        // const logs = content.split('\n').map( 
        //     log => LogEntity.fromJson( log )
        // );
        const logs = content.split('\n').map( LogEntity.fromJson );

        return logs;

    }

    
    async getLogs(severityLevel: LogSeveryLevel): Promise<LogEntity[]> {
        
        switch( severityLevel ){
            case LogSeveryLevel.low:
                return this.getLogsFromFile( this.allLogsPath );
            
            case LogSeveryLevel.medium:
                return this.getLogsFromFile( this.mediumLogsPath );

            case LogSeveryLevel.high:
                return this.getLogsFromFile( this.highLogsPath );
            
            default:
                throw new Error(`${ severityLevel } not implemented` );
        }



    }

}