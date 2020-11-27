## Problem

The DynamoDB database structure (specifically the table keys) changes from 1.0
to 1.1. Because of this change the table must be rebuilt: the old deleted and a
new created.

The plan will be to:
1. read the data out of the existing database using the API into the
   administrative application,
2. hold the data in memory while the database is torn down and rebuilt,
3. write back the dataset using the (updated) API.
