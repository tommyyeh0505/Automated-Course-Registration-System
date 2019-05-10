import { TestBed } from '@angular/core/testing';

import { WaitlistService } from './waitlist.service';

describe('WaitlistService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WaitlistService = TestBed.get(WaitlistService);
    expect(service).toBeTruthy();
  });
});
