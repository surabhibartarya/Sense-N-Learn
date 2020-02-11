import { TestBed } from '@angular/core/testing';

import { GooglePieChartServiceService } from './google-pie-chart-service.service';

describe('GooglePieChartServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GooglePieChartServiceService = TestBed.get(GooglePieChartServiceService);
    expect(service).toBeTruthy();
  });
});
