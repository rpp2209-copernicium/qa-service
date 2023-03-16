describe('tests work', () => {
  it('should pass', function() {
    expect(true).toBe(true);
    expect(false).not.toBe(true);
  });
})

// describe.only('QA database', function() {
//   // test that the database + associated tables exist
//   it('database should exist', function() {
//     // connect to the postgres db -> container
//     // expect \l to list the db, \dt should list the questions, answers, answers_photos tables
//     expect().toBe();
//   });
// });

// test that a sample query returns as expected from each db table
// describe('DB Queries', function() {
//   it('should return the first five records from the questions, answers, and answers_photos tables', function() {
//     // todo
//     // expect().toBe();
//   });

//   // test that the record count matches expected for each db table

//   // questions: 3518963
//   // answers: 6879306
//   // answers_photos: 2063759
//   it('should', function() {
//     // todo
//     // expect().toBe();
//   });

// });