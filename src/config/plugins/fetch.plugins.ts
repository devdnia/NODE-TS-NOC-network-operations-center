
export class FetchService {

    public static async fetchApi( url:string ):Promise<Response>{
        const req = await fetch( url );
        return req;
    }

}