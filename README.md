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
        Vendor CRUD was copied from ProfileController.ts
        
removePreferredEvent in 'UserController.ts'
I used this to get it to work:
    Reference: https://stackoverflow.com/questions/71259876/removing-a-single-row-in-a-manytomany-table-with-typeorm-nestjs

'siginup.tsx' with the validation:
    Reference:
    https://www.c-sharpcorner.com/blogs/various-types-of-password-validation-in-javascript1
    https://iamkartikeya.medium.com/form-validation-in-javascript-ddc776f76920
    https://www.the-art-of-web.com/javascript/validate-password/

in 'create' for user and 'login' in UserController.ts:
    Reference:
    https://medium.com/@gaganparmar110/build-a-login-and-registration-system-using-nestjs-and-typeorm-with-postgresql-a-step-by-step-d913e344eff8
    https://medium.com/@ggluopeihai/unlocking-system-security-master-authentication-and-access-control-with-nestjs-jwt-and-redis-b2c60c4383b4
    https://peaklab.fr/en/glossaire/argon2
    https://www.npmjs.com/package/argon2
    

NEED TO DO:
finish of validations to applicaiton and vendorcomments
apply them to the routes
Updpate event for vendor (CRUD)
removepreferredEvents works but every slowly. need to fix to make it quicker somehow

User Logins (plaintext):
userName: harryp
email: harry.potter@email.com
password: Magic123!

User Logins (plaintext):
userName: homers
email: homer.simpson@email.com
password: Donut123!

User Logins (plaintext):
userName: janed
email: jane.doe@email.com
password: Password123@

User Logins (plaintext):
userName: johnd
email: john.doe@email.com
password: Password123!

User Logins (plaintext):
userName: minhn
email: minh.nguyen@team5.com
password: Rmit1234!

User Logins (plaintext):
userName: willk
email: willknights@rmit.com
password: Rmit123