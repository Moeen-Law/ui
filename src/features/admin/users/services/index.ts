import api from "@/shared/api";
import request from "@/shared/api/request";
import { adminService } from "../../helpers";
import type { GetUsersParams, AllUsersRes, User, UserStats, MessageRes, ToggleUserRolesParams } from "../types";

const appendParam = (
    params: URLSearchParams,
    key: string,
    value: string | number | boolean | undefined
) => {
    if (value === undefined || value === "") {
        return;
    }

    params.set(key, String(value));
};

export const getAllUsers = ({
    page = 0,
    size = 10,
    id,
    name,
    email,
    active,
    deleted,
    emailVerified,
}: GetUsersParams) => {
    const params = new URLSearchParams();

    appendParam(params, "page", page);
    appendParam(params, "size", size);
    appendParam(params, "id", id);
    appendParam(params, "name", name);
    appendParam(params, "email", email);
    appendParam(params, "active", active);
    appendParam(params, "deleted", deleted);
    appendParam(params, "emailVerified", emailVerified);

    return request<AllUsersRes>(api.get(`${adminService}/admin/users?${params.toString()}`))
}


export const getUser = (id: string) => request<User>(api.get(`${adminService}/admin/users/${id}`));


export const UsersStats = () => request<UserStats>(api.get(`${adminService}/admin/users/stats`));


export const toggleActivation = (userId: string) => request<MessageRes>(api.post(`${adminService}/admin/users/ban/${userId}`));


export const deleteUser = (userId: string) => request<MessageRes>(api.delete(`${adminService}/admin/users/delete/${userId}`));


export const toggleUserRoles = ({ userId, action, role }: ToggleUserRolesParams) =>
    request<MessageRes>(api.put(`${adminService}/admin/users/${action}/${userId}?role=${role}`));
