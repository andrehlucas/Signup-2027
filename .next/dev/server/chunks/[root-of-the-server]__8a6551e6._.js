module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/server/storage.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MemStorage",
    ()=>MemStorage,
    "storage",
    ()=>storage
]);
class MemStorage {
    users;
    locations;
    mailItems;
    mailSettings;
    notificationItems;
    notificationPrefs;
    constructor(){
        this.users = new Map();
        this.locations = new Map();
        this.mailItems = new Map();
        this.mailSettings = new Map();
        this.notificationItems = new Map();
        this.notificationPrefs = new Map();
        this.seed();
    }
    seed() {
        const mockUser = {
            id: '1',
            username: 'demo_user',
            password: 'password123',
            businessName: 'Acme Corporation'
        };
        this.users.set(mockUser.id, mockUser);
        const mockLocations = [
            {
                id: '1',
                name: 'Manhattan Office',
                address: '123 5th Avenue, New York, NY',
                imageUrl: '/attached_assets/manhattan.jpg'
            },
            {
                id: '2',
                name: 'Brooklyn Hub',
                address: '456 Atlantic Ave, Brooklyn, NY',
                imageUrl: '/attached_assets/brooklyn.jpg'
            },
            {
                id: '3',
                name: 'Los Angeles Office',
                address: '789 Wilshire Blvd, LA, CA',
                imageUrl: '/attached_assets/la.jpg'
            }
        ];
        mockLocations.forEach((loc)=>this.locations.set(loc.id, loc));
        const mockMail = [
            {
                id: '1',
                name: 'Mail 01',
                receivedDate: '02/12/2025',
                thumbnailUrl: null,
                envelopeImageUrl: null,
                status: 'pending',
                senderName: 'General John Doe',
                senderAddress: '123 Long Street Apt. 45, Radstock, FL 32178',
                recipientName: 'PFC Harry Dobson',
                recipientAddress: '45th ENG 2nd PLT - B CO, APO AE 34566-2367'
            },
            {
                id: '2',
                name: 'Mail 02',
                receivedDate: '03/12/2025',
                thumbnailUrl: null,
                envelopeImageUrl: null,
                status: 'pending',
                senderName: 'Sarah Williams',
                senderAddress: '456 Oak Avenue, Boston, MA 02115',
                recipientName: 'PFC Harry Dobson',
                recipientAddress: '45th ENG 2nd PLT - B CO, APO AE 34566-2367'
            },
            {
                id: '3',
                name: 'Mail 03',
                receivedDate: '04/12/2025',
                thumbnailUrl: null,
                envelopeImageUrl: null,
                status: 'pending',
                senderName: 'IRS Department',
                senderAddress: '1111 Constitution Ave NW, Washington, DC 20224',
                recipientName: 'PFC Harry Dobson',
                recipientAddress: '45th ENG 2nd PLT - B CO, APO AE 34566-2367'
            }
        ];
        mockMail.forEach((m)=>this.mailItems.set(m.id, m));
        const defaultSettings = {
            id: '1',
            userId: '1',
            defaultAction: 'keep'
        };
        this.mailSettings.set('1', defaultSettings);
        const mockNotifications = [
            {
                id: 'n1',
                userId: '1',
                type: 'mail',
                title: 'New Mail Received',
                message: 'You have a new piece of mail from IRS Department waiting at your Manhattan Office.',
                isRead: false,
                link: '/office',
                createdAt: '2025-02-06T10:30:00Z'
            },
            {
                id: 'n2',
                userId: '1',
                type: 'billing',
                title: 'Invoice Due Soon',
                message: 'Your monthly subscription invoice of $149.00 is due in 3 days.',
                isRead: false,
                link: '/billing',
                createdAt: '2025-02-05T14:00:00Z'
            },
            {
                id: 'n3',
                userId: '1',
                type: 'billing',
                title: 'Payment Processed',
                message: 'Your payment of $149.00 for January has been processed successfully.',
                isRead: true,
                link: '/billing',
                createdAt: '2025-01-30T09:15:00Z'
            },
            {
                id: 'n4',
                userId: '1',
                type: 'account',
                title: 'Password Changed',
                message: 'Your account password was changed successfully. If this wasn\'t you, contact support immediately.',
                isRead: true,
                link: '/account',
                createdAt: '2025-01-28T16:45:00Z'
            },
            {
                id: 'n5',
                userId: '1',
                type: 'service',
                title: 'Phone Number Activated',
                message: 'Your new business phone number (305) 555-9876 has been activated and is ready to use.',
                isRead: false,
                link: '/phone',
                createdAt: '2025-02-04T11:20:00Z'
            },
            {
                id: 'n6',
                userId: '1',
                type: 'mail',
                title: 'Mail Forwarded',
                message: 'Your mail item from Sarah Williams has been forwarded to your registered address.',
                isRead: true,
                link: '/office',
                createdAt: '2025-01-27T08:30:00Z'
            },
            {
                id: 'n7',
                userId: '1',
                type: 'location',
                title: 'New Location Available',
                message: 'A new premium office location is now available in Chicago. Explore our latest offerings.',
                isRead: false,
                link: '/add-location',
                createdAt: '2025-02-03T13:00:00Z'
            },
            {
                id: 'n8',
                userId: '1',
                type: 'service',
                title: 'Call Forwarding Updated',
                message: 'Your call forwarding settings have been updated for your Manhattan Office number.',
                isRead: true,
                link: '/phone',
                createdAt: '2025-01-25T10:00:00Z'
            },
            {
                id: 'n9',
                userId: '1',
                type: 'account',
                title: 'New Login Detected',
                message: 'A new login to your account was detected from Chrome on Windows. Location: Miami, FL.',
                isRead: false,
                link: '/account',
                createdAt: '2025-02-06T08:00:00Z'
            },
            {
                id: 'n10',
                userId: '1',
                type: 'billing',
                title: 'Add-on Subscription Confirmed',
                message: 'Your Virtual Phone Receptionist add-on has been added to your plan. Monthly cost: $29.99.',
                isRead: false,
                link: '/billing',
                createdAt: '2025-02-01T15:30:00Z'
            }
        ];
        mockNotifications.forEach((n)=>this.notificationItems.set(n.id, n));
        const defaultNotifPrefs = {
            id: 'np1',
            userId: '1',
            mailEnabled: true,
            billingEnabled: true,
            accountEnabled: true,
            serviceEnabled: true,
            locationEnabled: true,
            emailDelivery: true,
            inAppDelivery: true
        };
        this.notificationPrefs.set('np1', defaultNotifPrefs);
    }
    async getUser(id) {
        return this.users.get(id);
    }
    async getUserByUsername(username) {
        return Array.from(this.users.values()).find((u)=>u.username === username);
    }
    async createUser(insertUser) {
        const id = Math.random().toString(36).substr(2, 9);
        const user = {
            id,
            username: insertUser.username,
            password: insertUser.password,
            businessName: insertUser.businessName ?? "Opus Business"
        };
        this.users.set(id, user);
        return user;
    }
    async getLocations() {
        return Array.from(this.locations.values());
    }
    async getLocation(id) {
        return this.locations.get(id);
    }
    async createLocation(location) {
        const id = Math.random().toString(36).substr(2, 9);
        const newLocation = {
            id,
            ...location
        };
        this.locations.set(id, newLocation);
        return newLocation;
    }
    async getPendingMail() {
        return Array.from(this.mailItems.values()).filter((m)=>m.status === 'pending');
    }
    async getMail(id) {
        return this.mailItems.get(id);
    }
    async updateMailStatus(id, action) {
        const mail = this.mailItems.get(id);
        if (mail) {
            const updatedMail = {
                ...mail,
                status: action
            };
            this.mailItems.set(id, updatedMail);
            return updatedMail;
        }
        return undefined;
    }
    async getMailSettings(userId) {
        return Array.from(this.mailSettings.values()).find((s)=>s.userId === userId);
    }
    async updateMailSettings(userId, defaultAction) {
        let settings = await this.getMailSettings(userId);
        if (settings) {
            settings = {
                ...settings,
                defaultAction
            };
            this.mailSettings.set(settings.id, settings);
            return settings;
        }
        const newSettings = {
            id: Math.random().toString(36).substr(2, 9),
            userId,
            defaultAction
        };
        this.mailSettings.set(newSettings.id, newSettings);
        return newSettings;
    }
    async getNotifications(userId, type) {
        const all = Array.from(this.notificationItems.values()).filter((n)=>n.userId === userId);
        const filtered = type ? all.filter((n)=>n.type === type) : all;
        return filtered.sort((a, b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    async getUnreadNotificationCount(userId) {
        return Array.from(this.notificationItems.values()).filter((n)=>n.userId === userId && !n.isRead).length;
    }
    async markNotificationRead(id) {
        const notif = this.notificationItems.get(id);
        if (notif) {
            const updated = {
                ...notif,
                isRead: true
            };
            this.notificationItems.set(id, updated);
            return updated;
        }
        return undefined;
    }
    async markAllNotificationsRead(userId) {
        for (const [id, notif] of this.notificationItems.entries()){
            if (notif.userId === userId && !notif.isRead) {
                this.notificationItems.set(id, {
                    ...notif,
                    isRead: true
                });
            }
        }
    }
    async deleteNotification(id) {
        return this.notificationItems.delete(id);
    }
    async getNotificationPreferences(userId) {
        return Array.from(this.notificationPrefs.values()).find((p)=>p.userId === userId);
    }
    async updateNotificationPreferences(userId, prefs) {
        let existing = await this.getNotificationPreferences(userId);
        if (existing) {
            const updated = {
                ...existing,
                ...prefs
            };
            this.notificationPrefs.set(existing.id, updated);
            return updated;
        }
        const newPrefs = {
            id: Math.random().toString(36).substr(2, 9),
            userId,
            mailEnabled: prefs.mailEnabled ?? true,
            billingEnabled: prefs.billingEnabled ?? true,
            accountEnabled: prefs.accountEnabled ?? true,
            serviceEnabled: prefs.serviceEnabled ?? true,
            locationEnabled: prefs.locationEnabled ?? true,
            emailDelivery: prefs.emailDelivery ?? true,
            inAppDelivery: prefs.inAppDelivery ?? true
        };
        this.notificationPrefs.set(newPrefs.id, newPrefs);
        return newPrefs;
    }
}
const storage = new MemStorage();
}),
"[project]/app/api/notifications/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/storage.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const validTypes = [
            'mail',
            'billing',
            'account',
            'service',
            'location'
        ];
        if (type && !validTypes.includes(type)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Invalid notification type"
            }, {
                status: 400
            });
        }
        const notifications = await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storage"].getNotifications("1", type || undefined);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Internal server error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8a6551e6._.js.map