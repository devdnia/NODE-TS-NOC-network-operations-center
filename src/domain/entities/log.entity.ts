
export enum LogSeverityLevel {
    low = 'low',
    medium = 'medium',
    high = 'high'
}


export interface LogEntityOptions {
    createdAt?: Date;
    level: LogSeverityLevel
    message: string;
    origin: string;
}

export class LogEntity {

    public createdAt?: Date;
    public level: LogSeverityLevel
    public message: string;
    public origin: string;

    constructor( options:LogEntityOptions ){
        const { createdAt = new Date(), level, message, origin } = options;
        this.message = message;
        this.level = level;
        this.createdAt = createdAt;
        this.origin = origin;

    }

    static fromJson = ( json: string ): LogEntity => {
        const { message, level, createdAt, origin }= JSON.parse( json );

        const log = new LogEntity( {
            message,
            level,
            origin,
            createdAt
        });

        return log;
    }
    
}