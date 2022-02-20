# E2E Tests for the Point In Time Scheduler API

## How to run tests

The tests require the two environment variables `CONTROL_KEY_SECRET` and `CONTROL_KEY_ID`. You can generate those
by going to the [Point In Time Scheduler Dashboard](https://app.point-in-time-scheduler.com), and then navigate to Control Keys and create one.

Then run the following:

```
yarn install

CONTROL_KEY_SECRET=secret CONTROL_KEY_ID=id yarn test
```

## Resources

- [OpenApi Spec](https://app.swaggerhub.com/apis/bahrmichael/Scheduler/0.1.0)
- [Package on NPM](https://npmjs.com/package/point-in-time-scheduler)