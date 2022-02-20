import {ApplicationsApi, Configuration, DataKeysApi} from "point-in-time-scheduler";

describe("With existing control key", () => {

    // Go to the dashboard and create a control key, then pass it as this environment variable
    const controlKeySecret = process.env.CONTROL_KEY_SECRET;

    const dataKeys = new DataKeysApi(new Configuration({
        apiKey: `Token ${controlKeySecret}`,
        basePath: process.env.BASE_PATH ?? 'https://api.point-in-time-scheduler.com',
    }));

    let appId;

    beforeEach(async () => {
        const applications = new ApplicationsApi(new Configuration({
            apiKey: `Token ${controlKeySecret}`,
            basePath: process.env.BASE_PATH ?? 'https://api.point-in-time-scheduler.com',
        }));

        // Clean up existing applications
        const {data: apps} = await applications.listApplications();
        for (const app of apps) {
            await applications.deleteApplication({
                appId: app.id,
            });
        }

        // Create a new application for this test
        const {data: application} = await applications.createApplication({
            createApplicationInput: {
                name: 'MyApp',
                endpoint: 'https://example.org',
                type: 'REST'
            }
        });
        appId = application.id;
    });

    it("should have no data keys when app was newly created", async () => {
        const {data: keys} = await dataKeys.listDataKeys({appId});

        expect(keys.length).toBe(0);
    });

    it("should allow creating new api keys", async() => {
        const {data: dataKey} = await dataKeys.createDataKey({
            appId
        });

        const {data: keys} = await dataKeys.listDataKeys({appId});
        expect(keys.length).toBe(1);
        expect(keys[0].id).toBe(dataKey.id);
    });

})