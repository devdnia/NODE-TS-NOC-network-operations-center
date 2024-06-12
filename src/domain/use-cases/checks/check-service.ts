import { FetchService } from "../fetch/fetch-service";

interface CheckServiceUseCase {
    execute( url: string ):Promise<boolean>;
}

type SuccesCallback = () => void;
type ErrorCallback = ( error:string ) => void;



export class CheckService implements CheckServiceUseCase {

    constructor(
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

            this.succesCallback();

            return true;

        } catch (error) {

            this.errorCallback(`${ error } `)

            return false;
        }


    }


}