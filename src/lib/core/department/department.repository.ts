import type {
	CreateDepartmentInput,
	DepartmentModel,
	DepartmentParams,
	UpdateDepartmentInput
} from './department.model';

export interface IDepartmentRepository {
	getAll(params?: DepartmentParams): Promise<DepartmentModel[]>;
	getById(id: string): Promise<DepartmentModel>;
	create(input: CreateDepartmentInput): Promise<DepartmentModel>;
	update(input: UpdateDepartmentInput): Promise<DepartmentModel>;
	delete(id: string): Promise<void>;
}
