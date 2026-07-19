import type { PaginatedResult } from '$lib/core/shared';
import type {
  BranchModel,
  CreateBranchInput,
  UpdateBranchInput,
  BranchParams
} from './branch.model';

export interface IBranchRepository {
  getAll(params: BranchParams): Promise<PaginatedResult<BranchModel>>;
  getById(id: string): Promise<BranchModel | null>;
  create(input: CreateBranchInput): Promise<BranchModel>;
  update(input: UpdateBranchInput): Promise<BranchModel>;
  delete(id: string): Promise<boolean>;
}
