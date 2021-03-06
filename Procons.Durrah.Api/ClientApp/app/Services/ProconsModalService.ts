import { Injectable, OnDestroy } from '@angular/core';
import { Modal } from 'ngx-modialog/plugins/bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ProconsModalSerivce {
    constructor(private modal: Modal, public translate: TranslateService) {

    }

    showErrorModal(optionalMessage: string = "error.default", isTranslateKey = true) {
        if (isTranslateKey) {
            this.translate.get([optionalMessage, 'ok']).subscribe(errorMessages => {
                this.createErrorModalTemplate(errorMessages[optionalMessage], errorMessages['ok']);
            });
        } else {
            this.translate.get(['ok']).subscribe(errorMessages => {
                this.createErrorModalTemplate(optionalMessage, errorMessages['ok']);
            });
        }

    }
    showSuccessModal(message: string, isTranslateKey = true) {
        if (isTranslateKey) {
            this.translate.get([message, 'ok']).subscribe(translatedMessages => {
                this.createMessageModalTemplate(translatedMessages[message], translatedMessages['ok']);
            });
        } else {
            this.translate.get(['ok']).subscribe(translatedMessages => {
                this.createMessageModalTemplate(message, translatedMessages['ok']);
            });
        }
    }
    private createErrorModalTemplate(errorMessage: string, buttonMessage: string) {
        this.modal.alert()
            .showClose(true)
            .body(`
                        <div class="modal-body">
                            <div class="modal-icon"><img src="/Assets/src/app/images/icon_lock.png" class="icon" /></div>
                            <p><small>${errorMessage}</small></p>
                        </div>`
            )
            .okBtn(buttonMessage)
            .open();


    }
    private createMessageModalTemplate(message: string, buttonMessage: string) {
        this.modal.alert()
            .showClose(true)
            .body(`
                    <div class="modal-body">
                        <span class="glyphicon glyphicon-ok lg" "></span>
                        <p><small>${message}</small></p>
                    </div>`
            )
            .okBtn(buttonMessage)
            .open();

    }
//<span class="glyphicons glyphicons-ok-circle"></span>
    showHTMLModal(html: string) {
        this.modal.alert()
            .showClose(true)
            .body(html)
            .open();
    }
}
