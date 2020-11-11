export class User {
    firstName : String;
    lastName : String;
    username : String;
    member : Boolean;
    staff : Boolean;
    programs : [];

    constructor(obj : any){
        this.username = obj.username;
        this.firstName = obj.firstName;
        this.lastName = obj.lastName;
        this.member = obj.member;
        this.staff = obj.staff;
        this.programs = obj.progrmas;
    }
}
