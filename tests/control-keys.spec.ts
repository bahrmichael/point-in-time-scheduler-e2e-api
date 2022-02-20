import {Configuration, ControlKeysApi} from "point-in-time-scheduler";

describe("With existing control key", () => {

    // Go to the dashboard and create a control key, then pass it as this environment variable
    const secret = process.env.CONTROL_KEY_SECRET;
    // After creating the control key, go to the control keys page and get the control key's id from there
    const id = process.env.CONTROL_KEY_ID;

    const api = new ControlKeysApi(new Configuration({
        apiKey: `Token ${secret}`,
        basePath: process.env.BASE_PATH ?? 'https://api.point-in-time-scheduler.com',
    }));

    it("should show existing control key", async() => {
        const {data: keys} = await api.listControlKeys();

        expect(keys.length).toBeGreaterThanOrEqual(1);
        const found = keys.find((key) => key.id === id);
        expect(found).toBeTruthy();
    });

    it("should register and deactivate a control key", async() => {
        const {data} = await api.createControlKey();
        const {id: keyId} = data;

        const {data: keys1} = await api.listControlKeys();
        const found1 = keys1.find((key) => key.id === keyId);
        expect(found1?.active).toBeTruthy();

        await api.deactivateControlKey({controlKeyId: keyId});

        const {data: keys2} = await api.listControlKeys();
        const found2 = keys2.find((key) => key.id === keyId);
        expect(found2?.active).toBeFalsy();
    });
})