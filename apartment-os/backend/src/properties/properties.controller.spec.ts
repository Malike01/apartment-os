// backend/src/properties/properties.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';

const mockPropertiesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('PropertiesController', () => {
  let controller: PropertiesController;
  let service: PropertiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertiesController],
      providers: [
        { provide: PropertiesService, useValue: mockPropertiesService },
      ],
    }).compile();

    controller = module.get<PropertiesController>(PropertiesController);
    service = module.get<PropertiesService>(PropertiesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create() should call service.create with userId', async () => {
    const dto = { name: 'Test Site' };
    const userId = 'user-123';

    await controller.create(dto, userId);

    expect(service.create).toHaveBeenCalledWith(dto, userId);
  });

  it('findAll() should call service.findAll with userId', async () => {
    const userId = 'user-123';
    await controller.findAll(userId);
    expect(service.findAll).toHaveBeenCalledWith(userId);
  });
});
