import {AfterViewInit, Component, ElementRef, EventEmitter, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Http} from "@angular/http";
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/take';

@Component({
    selector: 'app-root',
    template: `        
        <section id="content">
            <div class="spacer" [class.hide]="showConfirm"></div>
            <h1 [class.hide]="showConfirm">
                חווית הנתינה הישראלית
            </h1>
            <div id="form-wrapper" [class.hide]="showConfirm || showLoader">
                <form [formGroup]="newUserForm" (ngSubmit)="submit()" novalidate>
                    <input placeholder="הכנס את כתובת המייל שלך" type="email" formControlName="email" #emailInput>
                    <button type="submit">
                        הירשם עכשיו
                    </button>
                </form>
                <div id="error" *ngIf="error">{{error}}</div>
                <app-keyboard [focusElement]="emailInput" (setValue)="setEmailVal($event)" [resetEmitter]="resetEmitter"></app-keyboard>
            </div>

            <div id="thanks-wrapper" [class.hide]="!showConfirm">
                <h2>
                    תודה!
                </h2>
            </div>
        </section>
    `,
    styles: []
})
export class AppComponent implements AfterViewInit {
    public newUserForm: FormGroup;
    title = 'app';
    error = null;
    showConfirm = false;
    showLoader = false;
    resetEmitter: EventEmitter<any> = new EventEmitter();

    @ViewChild('emailInput') emailInput: ElementRef;

    constructor(private fb: FormBuilder,
                private http: Http) {
        this.initForm();
    }

    ngAfterViewInit() {
        this.focusInput();
    }

    focusInput() {
        this.emailInput.nativeElement.focus();
    }

    initForm() {
        this.newUserForm = this.fb.group({
            email: ["", Validators.email]
        });
    }

    setEmailVal(value) {
        this.newUserForm.setValue({email: value});
    }

    submit() {
        if (this.newUserForm.valid) {
            this.error = null;
            this.showLoader = true;
            this.http.post('/', this.newUserForm.value)
                .take(1)
                .map(res => res.json)
                .subscribe(() => {
                    this.showLoader = false;
                    this.showConfirm = true;
                    this.newUserForm.reset();
                    this.resetEmitter.emit(true);
                    setTimeout(() => {
                        this.showConfirm = false;
                        this.focusInput();
                    }, 15000);
                }, err => {
                    this.error = err;
                    this.showLoader = false;
                });
        } else {
            this.error = 'כתובת אימייל לא תקינה';
        }
    }
}
