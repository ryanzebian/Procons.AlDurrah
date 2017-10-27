import { Component, ElementRef, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ApiService } from '../../Services/ApiService';
import { ProconsModalSerivce } from '../../Services/ProconsModalService';
import { Worker } from "../../Models/Worker";
import { SearchCriteriaParams } from '../../Models/ApiRequestType'

@Component({
    selector: "add-profile",
    templateUrl: "./add-profile.component.html",
    styleUrls: ["./add-profile.component.css"],
    providers: [DatePipe]
})
export class AddProfileComponent implements OnInit {
    @Input() worker;
    @Input() searchCriterias: SearchCriteriaParams;
    @Output() onBack = new EventEmitter<any>();
    @ViewChild("photoUpload") photoUpload;
    @ViewChild("passportUpload") passportUpload;

    photoFileText = "Select Photo File";
    passportFileText = "Select Passport File";

    loading = false;
    state: { isAddMode: boolean, title: string, worker: Worker, selectOptionText: string } = {
        isAddMode: true,
        title: "Add Profile",
        worker: null,
        selectOptionText: "-- select an option -- "
    }
    photoServerMode: FileUploadMode = FileUploadMode.Add;
    passportServerMode: FileUploadMode = FileUploadMode.Add;

    constructor(public myApi: ApiService, public myModal: ProconsModalSerivce) {
    }

    ngOnInit(): void {
        if (this.worker) {
            //EditMode
            this.state.isAddMode = false;
            this.state.title = "Edit Profile"
            this.state.worker = Object.assign({}, this.worker);
            // this.tempData();
            this.photoServerMode = FileUploadMode.Edit;
            this.passportServerMode = FileUploadMode.Edit;
            console.log('searchCriteria Params ', this.searchCriterias);
        } else {
            let workerParams: any = Array.from({ length: 24 }, x => { return '' }) as any;
            this.state.worker = new (<any>Worker)(...workerParams);
            this.state.isAddMode = true;
        }
    }

    tempData() {
        this.state.worker = {
            "workerCode": null,
            "serialNumber": "AB23102017",
            "agent": "SA004",
            "age": 47,
            "name": "Maid Srilanka Sample",
            "code": "DW00003",
            "birthDate": "1/1/1970 12:00:00 AM",
            "gender": "F",
            "nationality": "2",
            "religion": "2",
            "maritalStatus": "1",
            "language": "2",
            "photo": "http://127.0.0.1:1357/minion2.jpeg",
            "price": 237.0,
            "weight": "65",
            "height": "150",
            "education": "1",
            "passport": "http://127.0.0.1:1357/minion2.jpeg",
            "video": null,
            "passportNumber": "AB23102017",
            "passportIssDate": "1/1/2016",
            "passportExpDate": "12/31/2026",
            "passportPoIssue": "Bandaranaiyak",
            "civilId": null,
            "status": "2"
        } as any;
        this.searchCriterias = { "languages": [{ "name": "English", "value": "1" }, { "name": "Arabic", "value": "2" }, { "name": "Hindi", "value": "3" }], "education": [{ "name": "University", "value": "1" }, { "name": "High School", "value": "2" }, { "name": "None", "value": "3" }, { "name": "Technical", "value": "4" }], "religion": [{ "name": "Christian", "value": "1" }, { "name": "Muslim", "value": "2" }, { "name": "Hindu", "value": "3" }], "nationality": [{ "name": "India", "value": "1" }, { "name": "Bengladish", "value": "2" }, { "name": "Philipin", "value": "3" }, { "name": "Ethioipia", "value": "4" }, { "name": "Srilanka", "value": "5" }, { "name": "Egypt", "value": "6" }], "gender": [{ "name": "Male", "value": "M" }, { "name": "Female", "value": "F" }], "maritalStatus": [{ "name": "Single", "value": "1" }, { "name": "Married", "value": "2" }, { "name": "Divorced", "value": "3" }], "workerTypes": [{ "name": "Domestic worker", "value": "DW00001" }, { "name": "Maid - Ethiopia", "value": "DW00002" }, { "name": "Maid - SriLanka", "value": "DW00003" }, { "name": "Driver Indian Fresh", "value": "DW00004" }, { "name": "Laptop Lenovo Thinkpad", "value": "FA00001" }, { "name": "Decoretion for main office", "value": "FA00002" }, { "name": "Laptop", "value": "FA00003" }] };

    }
    back() {
        this.onBack.emit();
    }
    submitWorker(a, b) {
        if (this.state.isAddMode) {
            this.addWorker(a, b);
        } else {
            this.editWorker(a, b);
        }
    }
    addWorker(photoInput: any, passInput: any) {
        let photoFile = photoInput.files;
        let passportFile = passInput.files;

        if (photoFile && photoFile[0] && passportFile && passportFile[0]) {
            const formData = new FormData();
            formData.append("Photo", photoFile[0], photoFile[0].name);
            formData.append("Passport", passportFile[0], passportFile[0].name);
            this.getFormData(formData);
            this.loading = true;
            this.myApi.addWorker(formData).subscribe(x => {
                this.onSucessfullUpdate(x);
            }, onError => {
                this.onErrorUpdate(onError);
            });

        } else {
            alert('TEMP Error Message: Photo or Passport Files are missing!');
        }

    }

    editWorker(photoInput: any, passInput: any) {
        //entering editMode! 
        let photoFile = photoInput.files;
        let passportFile = passInput.files;
        const formData = new FormData();

        //new filese is uploaded
        if (photoFile && photoFile[0] && passportFile && passportFile[0]) {
            formData.append("Photo", photoFile[0], photoFile[0].name);
            formData.append("Passport", passportFile[0], passportFile[0].name);
        } else {
            //edit or delete files
            formData.append("Photo", this.photoServerMode === FileUploadMode.Delete ? "0" : "1");
            formData.append("Passport", this.passportServerMode === FileUploadMode.Delete ? "0" : "1");
        }

        this.getFormData(formData);
        this.loading = true;
        this.myApi.updateWorker(formData).subscribe(x => {
            this.onSucessfullUpdate(x);
        }, onError => {
            this.onErrorUpdate(onError);
        });
    }

    onSucessfullUpdate(onSuccessMessage) {
        if (!onSuccessMessage) {
            return this.onErrorUpdate(onSuccessMessage);
        }
        this.loading = false;
        this.myModal.showSuccessModal("Transaction Sucessful!", false);
    }
    onErrorUpdate(onErrorMessage) {
        console.log(onErrorMessage);
        this.loading = false;
        this.myModal.showErrorModal("Transaction Failed", false);

    }

    getFormData(formData: FormData) {
        formData.append('BirthDate', this.state.worker.birthDate);
        formData.append('Gender', this.state.worker.gender);
        formData.append('Nationality', this.state.worker.nationality);
        formData.append('Religion', this.state.worker.religion);
        formData.append('MaritalStatus', this.state.worker.maritalStatus);
        formData.append('Language', this.state.worker.language);
        formData.append('Weight', this.state.worker.weight);
        formData.append('Height', this.state.worker.height);
        formData.append('Education', this.state.worker.education);
        formData.append('Video', this.state.worker.video);
        formData.append('PassportNumber', this.state.worker.passportNumber);
        formData.append('PassportIssDate', this.state.worker.passportIssDate);
        formData.append('PassportExpDate', this.state.worker.passportExpDate);
        formData.append('CivilId', this.state.worker.civilId);
        let itemName: any[] = this.searchCriterias.workerTypes.filter(nameValuePair => nameValuePair.value === this.state.worker.code);
        formData.append('Name', itemName[0].name);
        formData.append('Code', this.state.worker.code);
    }


    isFilesAttached(): boolean {

        let photoFile = this.photoUpload.files;
        let passportFile = this.passportUpload.files;

        return (photoFile && photoFile[0] && passportFile && passportFile[0]);
    }
    originalUploadFile(elFiles: ElementRef) {

        let files = elFiles.nativeElement.files;
        if (files && files[0]) {
            const formData = new FormData();
            for (var i = 0; i < files.length; i++) {
                formData.append("Photo", files[i], files[i].name);
                formData.append("Passport", files[i], files[i].name);
            }
            formData.append('BirthDate', '01-01-2000');
            formData.append('Gender', '1');
            formData.append('Nationality', '1');
            formData.append('Religion', '1');
            formData.append('MaritalStatus', '1');
            formData.append('Language', '1');
            //photo Missing
            formData.append('Weight', '80');
            formData.append('Height', '180');
            formData.append('Education', '1');
            formData.append('Video', '01-01-2000');
            formData.append('PassportNumber', '01-01-2000');
            formData.append('PassportIssDate', '01-01-2000');
            formData.append('PassportExpDate', '01-01-2000');
            formData.append('CivilId', '124542154215');
            //type Missing ? is it code
            formData.append('Age', '43'); //This is not needed
            formData.append('Code', 'code');


            this.myApi.addWorker(formData).subscribe(x => {
                console.log('Somethign Happend ! ', formData)
            }, onError => {

            });
        }
    }
    myUploader(event) {
        //event.files == files to upload
        console.log('I should upload the files!');
    }

    deleteServerFile(isPhotoUpload: boolean) {
        if (isPhotoUpload) {
            this.photoServerMode = FileUploadMode.Delete;
        } else {
            this.passportServerMode = FileUploadMode.Delete;
        }
    }
    FUM = FileUploadMode;
}

enum FileUploadMode {
    Add, Edit, Delete
}