interface CanvasUser {
    created_at: string;
    email: string;
    has_non_collaborative_groups: boolean;
    id: number;
    integration_id: string | null;
    login_id: string;
    name: string;
    short_name: string;
    sis_import_id: number;
    sis_user_id: string;
    sortable_name: string;
}

interface StudentName {
    firstName: string;
    lastName: string;
}

export class Users {
    users: { [key: string]: CanvasUser };

    constructor(users: { [key: string]: CanvasUser }) {
        this.users = users;
    }

    getStudentSortableName(ltiCustomUserId: number): string {
        const user = this.users[ltiCustomUserId];
        return user ? user.sortable_name || '' : '';
    }

    getStudentFullName(ltiCustomUserId: number): string {
        const user = this.users[ltiCustomUserId];
        return user ? user.name || '' : '';
    }
}