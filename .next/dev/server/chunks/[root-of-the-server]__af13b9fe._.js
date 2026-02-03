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
    constructor(){
        this.users = new Map();
        this.locations = new Map();
        this.mailItems = new Map();
        this.mailSettings = new Map();
        // Seed mock data
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
}
const storage = new MemStorage();
}),
"[project]/app/api/mail/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/storage.ts [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        const pendingMail = await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storage"].getPendingMail();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(pendingMail);
    } catch (error) {
        console.error("Error fetching mail:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Internal server error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__af13b9fe._.js.map