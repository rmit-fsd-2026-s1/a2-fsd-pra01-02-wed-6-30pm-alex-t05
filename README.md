William Knights s3731804 - https://github.com/s3731804

Minh Nguyen s3989825 - https://github.com/s3989825          

Timetable: FSD PRA01/02 Wed 6.30pm Alex Team 11
URL: https://github.com/rmit-fsd-2026-s1/a2-fsd-pra01-02-wed-6-30pm-alex-team-11


Referenced Materials:
Lab08 code archive:
    UserController.ts
    User.ts

Lectorial Week 8:
    Backend:
        Event.ts (Many to One relationship with User.ts)
        User.ts (One to Many relationship with Event.ts)
        eventRoute.tsx & eventController.tsx (Can find events from Username)

Lectorial Week 9:
    Frontend:
        api.tsx (holds userService and eventService)
        eventContext.tsx (Put fetchEvents() in context)
        authContext.tsx (Put fetchUsers() in context)
        signup.tsx (NEEDS TO BE FIX. but it can create User from the userService)
        signin.tsx (scans users from context. Context holds the users in database)
        [id].tsx (changing hirer.tsx and vendor.tsx to this)