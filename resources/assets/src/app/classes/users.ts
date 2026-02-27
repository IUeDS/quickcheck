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

    userExists(ltiCustomUserId: number): boolean {
        return this.users[ltiCustomUserId] !== undefined;
    }

    searchByName(searchTerm: string): Set<number> {
        const matchingUserIds = new Set<number>();
        
        if (!searchTerm) {
            // If no search term, return all user IDs
            for (const userId in this.users) {
                matchingUserIds.add(parseInt(userId, 10));
            }
            return matchingUserIds;
        }
        
        const lowerSearchTerm = searchTerm.toLowerCase();
        
        // Search through all users in O(N) time
        for (const userId in this.users) {
            const user = this.users[userId];
            const fullName = (user.name || '').toLowerCase();
            
            if (fullName.includes(lowerSearchTerm)) {
                matchingUserIds.add(parseInt(userId, 10));
            }
        }
        
        return matchingUserIds;
    }

    getSortedUsers(): CanvasUser[] {
        const userArray: CanvasUser[] = [];
        
        // Convert object to array
        for (const userId in this.users) {
            userArray.push(this.users[userId]);
        }
        
        // Sort by sortable_name
        userArray.sort((a, b) => {
            const nameA = (a.sortable_name || '').toLowerCase();
            const nameB = (b.sortable_name || '').toLowerCase();
            return nameA.localeCompare(nameB);
        });
        
        return userArray;
    }
}