William Knights s3731804 - https://github.com/s3731804

Minh Nguyen s3989825 - https://github.com/s3989825          

Timetable: A2 FSD PRA01-02 Wed 630pm Alex T05
URL: https://github.com/rmit-fsd-2026-s1/a2-fsd-pra01-02-wed-6-30pm-alex-t05


Referenced Materials:
Lab08 code archive:
    UserController.ts
    User.ts

Render URL:
frontend: https://a2-fsd-pra01-02-wed-6-30pm-alex-t05-1.onrender.com/
backend: https://a2-fsd-pra01-02-wed-6-30pm-alex-t05.onrender.com/
admin-frontend: https://a2-fsd-pra01-02-wed-6-30pm-alex-t05-yn74.onrender.com/
admin-backend: https://a2-fsd-pra01-02-wed-6-30pm-alex-t05-9tjr.onrender.com/


Majority of the backend was taken from Lectorial Week 8-9 for both backend's (node-express, typeorm , graphql)


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
        
'siginup.tsx' with the validation:
    Reference:
    Chand, G 2014, Various types of password validation in JavaScript, C-sharpcorner.com, C# Corner, viewed 6 June 2026, <https://www.c-sharpcorner.com/blogs/various-types-of-password-validation-in-javascript1>.
    Mishra, K 2024, Form Validation in JavaScript, Medium, viewed 6 June 2026, <https://iamkartikeya.medium.com/form-validation-in-javascript-ddc776f76920>.
    Chirp Internet 2017, Password Validation using regular expressions and HTML5 < JavaScript | The Art of Web, The-art-of-web.com, viewed 6 June 2026, <https://www.the-art-of-web.com/javascript/validate-password/>.

in 'create' for user and 'login' in UserController.ts:
    Reference:
    argon2 2025, npm, viewed 3 June 2026, <https://www.npmjs.com/package/argon2>.
    BuildWithGagan 2024, Build a Login and Registration System Using NestJS and TypeORM with PostgreSQL: A Step-By-Step…, Medium, viewed 4 June 2026, <https://medium.com/@gaganparmar110/build-a-login-and-registration-system-using-nestjs-and-typeorm-with-postgresql-a-step-by-step-d913e344eff8>.
    Luo, N 2024, Unlocking System Security: Master Authentication and Access Control with NestJS, JWT, and Redis, Medium, viewed 4 June 2026, <https://medium.com/@ggluopeihai/unlocking-system-security-master-authentication-and-access-control-with-nestjs-jwt-and-redis-b2c60c4383b4>.
    ‌PeakLab 2026, peaklab, PeakLab, viewed 6 June 2026, <https://peaklab.fr/en/glossaire/argon2>.
‌
for .max
    Repository APIs | TypeORM 2020, Typeorm.io, viewed 5 June 2026, <https://typeorm.io/docs/working-with-entity-manager/repository-api/>.

for order: { ranking: "ASC }
    Find Options | TypeORM 2020, Typeorm.io, viewed 4 June 2026, <https://typeorm.io/docs/working-with-entity-manager/find-options/>.

for one-to-one relations
    One-to-one relations | TypeORM 2026, Typeorm.io, viewed 6 June 2026, <https://typeorm.io/docs/relations/one-to-one-relations/>.

Search functions in hirer dashboard:
MDN Web Docs. (2019). Array.prototype.filter(). [online] Available at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter.
‌
Chakra v2 forms, used in componts EventModal, ApplicationModal
Adebayo, S. (n.d.). Form Control. [online] Chakra UI: Simple, Modular and Accessible UI Components for your React Applications. Available at: https://v2.chakra-ui.com/docs/components/form-control [Accessed 7 Jun. 2026].

Paramaterised queries in Application Controler
Pleerock (2017) Re: parameterized queries in TypeORM with MSSQL. GitHub issue comment, 17 November. Available at: https://github.com/typeorm/typeorm/issues/881 (Accessed: 7 June 2026).

Use of Generative AI:
Generative AI tools including Claude, Chatgpt and Copilot were used in this project primarily for bug diagonisisand, inline completion for repetitive areas and for conceptual exploration. Generated code snippets were critically analysed and care was taken to suitibly modify and adapt any outputs before implementation. Specific areas of use were: several sql queries in applicationController, repetition of back end entities, various front end css elememts, 

FileReader component
developer.mozilla.org. (n.d.). FileReader - Web APIs | MDN. [online] Available at: https://developer.mozilla.org/en-US/docs/Web/API/FileReader.

Cascade in PreferredEvents, FeaturedEvents, and Event Tags (tricky bug)
GeeksforGeeks (2023). Cascade in SQL. [online] GeeksforGeeks. Available at: 
https://www.geeksforgeeks.org/sql/cascade-in-sql/.


‌Note for Render Deployment:
This api call works:
https://a2-fsd-pra01-02-wed-6-30pm-alex-t05.onrender.com/api/users
But we had trouble with deployment as it was reporting memory issues and full deployment was not successful.



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