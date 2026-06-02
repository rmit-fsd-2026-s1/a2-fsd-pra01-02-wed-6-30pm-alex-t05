William Knights s3731804 - https://github.com/s3731804

Minh Nguyen s3989825 - https://github.com/s3989825          

Timetable: A2 FSD PRA01-02 Wed 630pm Alex T05
URL: https://github.com/rmit-fsd-2026-s1/a2-fsd-pra01-02-wed-6-30pm-alex-t05


Referenced Materials:
Lab08 code archive:
    UserController.ts
    User.ts

Lectorial Week 8:
    Backend:
        Event.ts (Many to One relationship with User.ts)
        User.ts (One to Many relationship with Event.ts) (createAt and updateAt to see when they create/update their profile)
        eventRoute.tsx & eventController.tsx (Can find events from Username)


Lectorial Week 9:
    Frontend:
        api.tsx (holds userService and eventService)
        eventContext.tsx (Put fetchEvents() in context)
        authContext.tsx (Put fetchUsers() in context)
        signup.tsx (NEEDS TO BE FIX. but it can create User from the userService)
        signin.tsx (scans users from context. Context holds the users in database)
        [id].tsx (changing hirer.tsx and vendor.tsx to this)
        [userName].tsx to allow vendor to hirer profile history

    Backend:
        validation and dtos where copied to fit our system of (profile/events)
        used attachProfile the same way to attach users(hirers) to events. This way, its like a preferred Event
        
removePreferredEvent in 'EventController.ts'
I used this to get it to work:
    Reference: https://stackoverflow.com/questions/71259876/removing-a-single-row-in-a-manytomany-table-with-typeorm-nestjs
    

NEED TO DO:
finish of validations to applicaiton and vendorcomments
apply them to the routes
Updpate event for vendor (CRUD)
removepreferredEvents works but every slowly. need to fix to make it quicker somehow