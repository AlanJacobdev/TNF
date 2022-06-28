import { Test, TestingModule } from '@nestjs/testing';
import { FetchAccueilService } from './fetch-accueil.service';

describe('FetchAccueilService', () => {
  let service: FetchAccueilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FetchAccueilService],
    }).compile();

    service = module.get<FetchAccueilService>(FetchAccueilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
