import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadErrorComponent } from './upload-error.component';

describe('OrgGraphComponent', () => {
  let component: UploadErrorComponent;
  let fixture: ComponentFixture<UploadErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadErrorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
