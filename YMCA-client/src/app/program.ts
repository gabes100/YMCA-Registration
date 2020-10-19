export class Program {
    name : String;
    location : String;
    description : String;
    capacity : Number;
    time : String;
    date : String;
    fee : Number;
    

    constructor(obj : any){
        this.name = obj.name;
        this.location = obj.location;
        this.description = obj.description;
        this.time = obj.time;
        this.capacity = obj.capacity;
        this.date = obj.date;
        this.fee = obj.fee;
    }
}
