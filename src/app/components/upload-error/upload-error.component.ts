import { Component } from '@angular/core';
import { CsvReadService } from '../../services/csvRead.service';
import { UploadBoxMessage } from '../../interfaces/employee.interface';

@Component({
  selector: 'app-upload-error',
  standalone: true,
  imports: [],
  templateUrl: './upload-error.component.html',
  styleUrl: './upload-error.component.scss',
})
export class UploadErrorComponent {
  errors: string[] = [];
  isFileChecked: boolean = false;
  fileName: string = '';
  isDragOver: boolean = false;
  uploadBoxMessage: string = UploadBoxMessage.DEFAULT;

  constructor(private csvReadService: CsvReadService) {}

  onDragOver(event: DragEvent): void {
    this.isDragOver = true;
    this.uploadBoxMessage = UploadBoxMessage.DRAGOVER;
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(): void {
    this.isDragOver = false;
    this.uploadBoxMessage = UploadBoxMessage.DEFAULT;
  }

  onDrop(event: DragEvent): void {
    this.isDragOver = false;
    this.uploadBoxMessage = UploadBoxMessage.DEFAULT;
    event.preventDefault();
    const files: FileList | undefined = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onFileSelected(event: any) {
    const files: FileList | undefined = event.target?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  private handleFiles(files: FileList): void {
    this.errors = [];
    this.isFileChecked = true;
    if (files.length != 1) {
      this.errors.push('Multiple files uploaded, please upload one file.');
    } else {
      const file = files[0];
      this.fileName = file.name;

      if (!this.isCsvFile(file)) {
        this.errors.push('Uploaded file is not a CSV file.');
      } else {
        this.csvReadService
          .parseCsv(file)
          .then((employeeList) => {
            this.errors.push(
              ...this.csvReadService.validateCsvRules(employeeList)
            );
          })
          .catch((error) => {
            this.errors.push(`Error parsing CSV: ${error}`);
          });
      }
    }
  }

  private isCsvFile(file: File): boolean {
    const mimeType = file.type;
    const extension = file.name.split('.').pop()?.toLowerCase();
    return mimeType === 'text/csv' || extension === 'csv';
  }
}
