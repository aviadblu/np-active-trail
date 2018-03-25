import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

declare var jsKeyboard: any;
declare var jQuery: any;

@Component({
    selector: 'app-keyboard',
    template: `
        <input type="text" id="hiddenInput" #hiddenInput>
        <div class="en" [class.sm]="smallLayout" (click)="updateInputOnClick()" #keyboardWrapper id="LPVirtualKeyboard">

        </div>`,
    styles: []
})
export class KeyboardComponent implements OnInit {
    private focusOn;
    public smallLayout = true;

    @Input('focusElement')
    set focusElement(value) {
        this.focusOn = value;
    }

    @Input('resetEmitter') resetEmitter;

    @Output() setValue: EventEmitter<any> = new EventEmitter();

    @ViewChild('keyboardWrapper') keyboardWrapper: ElementRef;

    @ViewChild('hiddenInput') hiddenInput: ElementRef;

    constructor() {
        if(window.screen.width > 1100) {
            this.smallLayout = false;
        }
    }

    ngOnInit() {
        this.resetEmitter.subscribe(() => {
            this.reset();
        });


        jsKeyboard.init();
        jsKeyboard.currentElementCursorPosition = 0;
        setTimeout(() => {
            jsKeyboard.currentElement = jQuery(this.hiddenInput.nativeElement);
            jsKeyboard.switchLang();
        }, 0)
    }

    updateInputOnClick() {
        this.setValue.emit(jsKeyboard.currentElement.val())
    }

    reset() {
        jsKeyboard.currentElement.val('');
        jsKeyboard.currentElementCursorPosition = 0;
    }
}
