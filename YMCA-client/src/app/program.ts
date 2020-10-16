export class Program {
    name : String;
    location : String;
    description : String;
    time : String;
    date : String;
    fee : Number;
    

    constructor(obj : any){
        this.name = obj.name;
        this.location = obj.location;
        this.description = obj.description;
        this.time = obj.time;
        this.date = obj.date;
        this.fee = obj.fee;
    }
}
