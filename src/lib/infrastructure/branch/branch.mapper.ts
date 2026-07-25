import type {
  BranchModel,
  CreateBranchInput,
  UpdateBranchInput,
  BranchParams
} from '$lib/core/branch';
import type {
  BranchResponse,
  BranchQuery,
  CreateBranchRequest,
  UpdateBranchRequest
} from './branch.schema';
import { PaginationMapper } from '$lib/infrastructure/http/pagination.mapper';

export class BranchMapper {
  static toModel(response: BranchResponse): BranchModel {
    return {
      id: response.id,
      companyId: response.company_id,
      code: response.code,
      name: response.name,
      city: response.city,
      isMain: response.is_main,
      isActive: response.is_active,
      createdAt: response.created_at,
      updatedAt: response.updated_at
    };
  }

  static toQuery(params: BranchParams): BranchQuery {
    return {
      ...PaginationMapper.toQuery(params),
      ...(params.search && { search: params.search }),
      ...(params.isActive !== undefined && params.isActive !== 'all' && { is_active: params.isActive })
    };
  }

  static toCreateRequest(input: CreateBranchInput): CreateBranchRequest {
    return {
      code: input.code,
      name: input.name,
      city: input.city,
      is_main: input.isMain,
      is_active: input.isActive
    };
  }

  static toUpdateRequest(input: UpdateBranchInput): UpdateBranchRequest {
    return this.toCreateRequest(input);
  }
}
