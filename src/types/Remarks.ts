import { User } from "./User";

export type RemarksPayload = {
  id: string;
  remark_header_id?: number;
  type?: "Place" | "Visit";
  description: string;
};
export type RemarksEditPayload = {
  id: string;
 data: { description?: string; delete: boolean}
};

export type Remark = {
    id: number;
    createdAt: Date;
    remark_details: RemarkDetails;
}

export interface ChildRemark extends RemarkDetails {
  id: number;
  createdAt: string;
};

export interface RemarkDetails {
    description: string;
    id: number;
    remark_header_id: number;
    users_permissions_user: User;
    child: ChildRemark[];
    createdAt: string;
    updatedAt: string;
}
