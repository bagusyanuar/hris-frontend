import type {
  IBranchRepository,
  BranchModel,
  CreateBranchInput,
  UpdateBranchInput,
  BranchParams
} from '$lib/core/branch';
import type { PaginatedResult } from '$lib/core/shared';
import type { BranchResponse, BranchListResponse } from './branch.schema';
import { BranchMapper } from './branch.mapper';
import { httpClient } from '$lib/infrastructure/http/client';
import { handleAppError } from '$lib/infrastructure/http/error.mapper';
import { PaginationMapper } from '$lib/infrastructure/http/pagination.mapper';
import type { ApiResponse } from '$lib/infrastructure/http/types';

export class BranchRepositoryImpl implements IBranchRepository {
  private readonly basePath = '/v1/branches';

  async getAll(params: BranchParams & { companyId?: string }): Promise<PaginatedResult<BranchModel>> {
    return handleAppError(async () => {
      const query = BranchMapper.toQuery(params);
      const url = params.companyId 
        ? `/v1/companies/${params.companyId}/branches`
        : this.basePath;
      const response = await httpClient.get<BranchListResponse>(url, { params: query });
      return PaginationMapper.toResult(response, BranchMapper.toModel);
    });
  }

  async getById(id: string): Promise<BranchModel | null> {
    return handleAppError(async () => {
      const response = await httpClient.get<ApiResponse<BranchResponse>>(`${this.basePath}/${id}`);
      return BranchMapper.toModel(response.data);
    });
  }

  async create(input: CreateBranchInput): Promise<BranchModel> {
    return handleAppError(async () => {
      const request = BranchMapper.toCreateRequest(input);
      const url = `/v1/companies/${input.companyId}/branches`;
      const response = await httpClient.post<ApiResponse<BranchResponse>>(url, request);
      return BranchMapper.toModel(response.data);
    });
  }

  async update(input: UpdateBranchInput): Promise<BranchModel> {
    return handleAppError(async () => {
      const request = BranchMapper.toUpdateRequest(input);
      const response = await httpClient.put<ApiResponse<BranchResponse>>(
        `${this.basePath}/${input.id}`,
        request
      );
      return BranchMapper.toModel(response.data);
    });
  }

  async delete(id: string): Promise<boolean> {
    return handleAppError(async () => {
      await httpClient.delete(`${this.basePath}/${id}`);
      return true;
    });
  }
}
