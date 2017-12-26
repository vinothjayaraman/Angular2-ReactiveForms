import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl,ValidatorFn} from '@angular/forms';
import { Customer } from './customer';

function emailMatcher(c: AbstractControl){
    let emailControl = c.get('email');
    let confirmEmailControl = c.get('confirmEmail');

    if (emailControl.pristine || confirmEmailControl.pristine) {
        return null;
    }
    if (emailControl.value === confirmEmailControl.value) {
        return null;
    }
    return {'match': true};
}

function ratingRange(min: number, max: number) : ValidatorFn { 
    return (c: AbstractControl) : {[key: string]:boolean} | null => {
        if (c.value != undefined && (isNaN(c.value) || c.value < min || c.value > max )) {
            return {'range': true};
        };
        return null;
    };
}

@Component({
    selector: 'my-signup',
    templateUrl: './app/customers/customer.component.html'
})
export class CustomerComponent implements OnInit {
    customerForm : FormGroup;
    customer: Customer= new Customer();

    constructor(private fb: FormBuilder){

    }

    ngOnInit():void{
        this.customerForm = this.fb.group({
            firstName: ['',[Validators.required,Validators.minLength(3)]],
            lastName: ['',[Validators.required,Validators.maxLength(50)]],
            emailGroup: this.fb.group({
                email: ['',[Validators.required,Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]],
                confirmEmail: ['',[Validators.required]],
            },{validator:emailMatcher}),
            phone: '',
            notification: 'email',
            rating: ['',ratingRange(1,8)],
            sendCatalog: true
        });
    }

    populateValues(): void{
        this.customerForm.setValue({
            firstName: 'Vinoth',
            lastName: 'Jayaraman',
            email:'vino@vin.com',
            sendCatalog: false
        });
    }

    save() {
        console.log(this.customerForm);
        console.log('Saved: ' + JSON.stringify(this.customerForm.value));
    }

    setNotification(notifyVia: string): void{
        const phoneControl = this.customerForm.get('phone');
        const emailControl = this.customerForm.get('email');
        if (notifyVia === 'text') {
            phoneControl.setValidators(Validators.required);
            emailControl.clearValidators();
        } else {
            phoneControl.clearValidators();
            emailControl.setValidators([Validators.required,Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]);
        }
        phoneControl.updateValueAndValidity();
        emailControl.updateValueAndValidity();
    }
 }
