import type { PaginatedResult } from '$lib/core/shared';
import type { IBranchRepository } from './branch.repository';
import type {
  BranchModel,
  CreateBranchInput,
  UpdateBranchInput,
  BranchParams
} from './branch.model';

export class BranchUseCase {
  constructor(private readonly repository: IBranchRepository) {}

  async getAll(params: BranchParams): Promise<PaginatedResult<BranchModel>> {
    return this.repository.getAll(params);
  }

  async getById(id: string): Promise<BranchModel | null> {
    return this.repository.getById(id);
  }

  async create(input: CreateBranchInput): Promise<BranchModel> {
    return this.repository.create(input);
  }

  async update(input: UpdateBranchInput): Promise<BranchModel> {
    return this.repository.update(input);
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}
