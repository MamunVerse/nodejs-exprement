const Person = require('./Person');

const _department = Symbol('department');
const _account = Symbol('account');

class UniPerson extends Person{
    constructor(id, name){
        super(id, name);
        this[_department] = null;
        this[_account] = null;
    }
    get department(){
        return this[_department];
    }
    set department(value){
        this[_department] = value;
    }
    get account(){
        return this[_account];
    }
    set account(value){
        this[_account] = value;
    }
    toString(){
        super.toString();
        console.log(`Department = ${this[_department]}`);
        console.log(`Account = ${this[_account]}`);
    }
}

export default UniPerson;