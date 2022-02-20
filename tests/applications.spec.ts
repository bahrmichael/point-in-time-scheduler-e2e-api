import {ApplicationsApi, Configuration, CreateApplicationInput} from "point-in-time-scheduler";

describe("With existing control key", () => {

    // Go to the dashboard and create a control key, then pass it as this environment variable
    const controlKeySecret = process.env.CONTROL_KEY_SECRET;

    const applications = new ApplicationsApi(new Configuration({
        apiKey: `Token ${controlKeySecret}`,
        basePath: process.env.BASE_PATH ?? 'https://api.point-in-time-scheduler.com',
    }));

    beforeEach(async () => {
        // Clean up existing applications
        const {data: apps} = await applications.listApplications();
        for (const app of apps) {
            await applications.deleteApplication({
                appId: app.id,
            });
        }
    });

    it("should create a new application and see its details", async () => {
        const applicationInput: CreateApplicationInput = {
            name: 'MyApp',
            endpoint: 'https://example.org',
            type: 'REST'
        };
        const {data: application} = await applications.createApplication({
            createApplicationInput: applicationInput
        });
        const {id: appId} = application;
        expect(appId).toBeTruthy();

        const {data: appDetails} = await applications.getApplication({appId});
        expect(appDetails).toMatchObject(applicationInput);

    });

    it("should list newly created application", async () => {
        const applicationInput: CreateApplicationInput = {
            name: 'MyApp',
            endpoint: 'https://example.org',
            type: 'REST'
        };
        const {data: application} = await applications.createApplication({
            createApplicationInput: applicationInput
        });
        const {id: appId} = application;

        const {data: apps} = await applications.listApplications();
        expect(apps.length).toBe(1);
        expect(apps[0].id).toBe(appId);
    });

    it("should be able to update application", async() => {
        const applicationInput: CreateApplicationInput = {
            name: 'MyApp',
            description: 'Old description',
            endpoint: 'https://example.org',
            type: 'REST'
        };
        const {data: application} = await applications.createApplication({
            createApplicationInput: applicationInput
        });
        const {id: appId} = application;

        await applications.updateApplication({
            appId,
            updateApplicationInput: {
                description: 'New description'
            }
        });

        const {data: appDetails} = await applications.getApplication({appId});
        expect(appDetails.description).toBe('New description');

    });

    it("should be able to delete an application", async() => {
        const applicationInput: CreateApplicationInput = {
            name: 'MyApp',
            description: 'Old description',
            endpoint: 'https://example.org',
            type: 'REST'
        };
        const {data: application} = await applications.createApplication({
            createApplicationInput: applicationInput
        });
        const {id: appId} = application;

        const {data: apps1} = await applications.listApplications();
        expect(apps1.length).toBe(1);

        await applications.deleteApplication({appId});

        const {data: apps2} = await applications.listApplications();
        expect(apps2.length).toBe(0);
    });

})