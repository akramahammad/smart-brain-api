BEGIN TRANSACTION;

insert into users(name,email,entries,joined) values ('jack','jack@mail.com',5,'2018-01-01');
insert into login(hash,email) values ('$2a$10$xt65sENH1BFiBj4cy48iIuP1IEAa0JlhhqB4DevSmP0fcyHw6cK5C','jack@mail.com');

COMMIT;