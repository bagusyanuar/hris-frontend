import type {
  BranchModel,
  CreateBranchInput,
  UpdateBranchInput,
  BranchParams,
  BranchStatus
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
      code: response.code,
      name: response.name,
      address: response.address,
      phone: response.phone,
      status: response.status as BranchStatus,
      createdAt: response.created_at,
      updatedAt: response.updated_at
    };
  }

  static toQuery(params: BranchParams): BranchQuery {
    return {
      ...PaginationMapper.toQuery(params),
      ...(params.search && { search: params.search }),
      ...(params.status && params.status !== 'all' && { status: params.status })
    };
  }

  static toCreateRequest(input: CreateBranchInput): CreateBranchRequest {
    return {
      code: input.code,
      name: input.name,
      address: input.address ?? undefined,
      phone: input.phone ?? undefined,
      status: input.status
    };
  }

  static toUpdateRequest(input: UpdateBranchInput): UpdateBranchRequest {
    return this.toCreateRequest(input);
  }
}
