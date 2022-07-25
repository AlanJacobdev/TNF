import { Test, TestingModule } from '@nestjs/testing';
import { FetchInformationService } from './fetch-information.service';

describe('FetchInformationService', () => {
  let service: FetchInformationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FetchInformationService],
    }).compile();

    service = module.get<FetchInformationService>(FetchInformationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
