import { TestBed, inject } from '@angular/core/testing';

import { StudyDataService } from './study-data.service';

describe('GroupDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ StudyDataService ]
    });
  });

  it('should be created', inject([ StudyDataService ], (service: StudyDataService) => {
    expect(service).toBeTruthy();
  }));
});