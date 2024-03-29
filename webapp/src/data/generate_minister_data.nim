# generate_minister_data
#
# Utility to create a random dataset for the UPCI Wall of Honor project.
# Creates a single dataset of ministers and a single view of that dataset
# organized in the way the Deceased Ministers page expects.

import algorithm, json, options, random, tables, times, uuids

randomize()

const dateFormat = "yyyy-MM-dd"

const numDeceased = 4000
const numLiving = 200
const numOoF = 100

const birthMin = 1930
const birthMax = 1990
const deathMin = 1960
const deathMax = 2020

const minLifespan = 35
const maxLifespan = 92

const lastNames = @[
  "Adams", "Allen", "Anderson", "Bailey", "Baker", "Barnes", "Bell",
  "Bennett", "Brooks", "Brown", "Butler", "Campbell", "Carter", "Clark",
  "Collins", "Cook", "Cooper", "Cox", "Cruz", "Davis", "Diaz", "Edwards",
  "Evans", "Fisher", "Flores", "Foster", "Garcia", "Gomez", "Gonzalez",
  "Gray", "Green", "Gutierrez", "Hall", "Harris", "Hernandez", "Hill",
  "Howard", "Hughes", "Jackson", "James", "Jenkins", "Johnson", "Jones",
  "Kelly", "King", "Lee", "Lewis", "Long", "Lopez", "Martin", "Martinez",
  "Miller", "Mitchell", "Moore", "Morales", "Morgan", "Morris", "Murphy",
  "Myers", "Nelson", "Nguyen", "Ortiz", "Parker", "Perez", "Perry",
  "Peterson", "Phillips", "Powell", "Price", "Ramirez", "Reed", "Reyes",
  "Richardson", "Rivera", "Roberts", "Robinson", "Rodriguez", "Rogers",
  "Ross", "Russell", "Sanchez", "Sanders", "Scott", "Smith", "Stewart",
  "Sullivan", "Taylor", "Thomas", "Thompson", "Torres", "Turner", "Walker",
  "Ward", "Watson", "White", "Williams", "Wilson", "Wood", "Wright", "Young",
]

const firstNames = @[
  "Duke", "Edsel", "James", "Robert", "John", "Michael", "David", "William",
  "Richard", "Thomas", "Charles", "Gary", "Steven", "Joseph", "Donald",
  "Larry", "Ronald", "Kenneth", "Mark", "Dennis", "Paul", "Daniel",
  "Stephen", "George", "Edward", "Gregory", "Bruce", "Jerry", "Timothy",
  "Douglas", "Terry", "Roger", "Jeffrey", "Frank", "Raymond", "Anthony",
  "Lawrence", "Peter", "Patrick", "Wayne", "Gerald", "Danny", "Randy",
  "Alan", "Kevin", "Walter", "Carl", "Dale", "Arthur", "Willie", "Keith",
  "Henry", "Harold", "Jack", "Johnny", "Christopher", "Scott", "Roy",
  "Ralph", "Stanley", "Craig", "Philip", "Glenn", "Joe", "Randall", "Brian",
  "Billy", "Samuel", "Albert", "Andrew", "Barry", "Russell", "Eugene",
  "Jimmy", "Howard", "Phillip", "Harry", "Frederick", "Allen", "Bobby",
  "Louis", "Martin", "Ricky", "Ronnie", "Leonard", "Rodney", "Steve",
  "Curtis", "Ernest", "Eric", "Francis", "Fred", "Melvin", "Eddie", "Lee",
  "Micheal", "Marvin", "Norman", "Tommy", "Earl", "Clifford", "Theodore",
  "Vincent", "Clarence", "Dean", "Alfred", "Jerome", "Jay", "Victor",
  "Calvin", "Darrell", "Gordon", "Bernard", "Jesse", "Ray", "Jose",
  "Herbert", "Leroy", "Warren", "Edwin", "Rick", "Don", "Glen", "Benjamin",
  "Dwight", "Leon", "Leslie", "Kim", "Nicholas", "Alvin", "Dan", "Lloyd",
  "Joel", "Duane", "Tony", "Jeffery", "Jon", "Mike", "Vernon", "Jonathan",
  "Gene", "Rickey", "Matthew", "Bradley", "Jackie", "Clyde", "Lewis",
  "Allan", "Neil", "Lonnie", "Floyd", "Juan", "Gilbert", "Guy", "Marc",
  "Randolph", "Donnie", "Garry", "Mitchell", "Lester", "Franklin", "Chris",
  "Manuel", "Charlie", "Jimmie", "Kent", "Bill", "Wesley", "Harvey", "Lynn",
  "Milton", "Leo", "Karl", "Jim", "Johnnie", "Herman", "Freddie", "Reginald",
  "Rex", "Arnold", "Kurt", "Chester", "Tom", "Ted", "Dana", "Gerard",
  "Cecil", "Alexander", "Roland", "Nathaniel", "Carlos", "Stuart", "Maurice",
  "Fredrick", "Daryl", "Kerry", "Terrence", "Perry", "Claude", "Neal",
  "Kirk", "Darryl", "Ruben", "Marshall", "Robin", "Oscar", "Brent",
  "Antonio", "Jessie", "Sidney", "Hugh", "Wallace", "Mario", "Brad", "Todd",
  "Sam", "Aaron", "Clifton", "Tyrone", "Ross", "Terrance", "Morris", "Byron",
  "Lyle", "Benny", "Edgar", "Clinton", "Wendell", "Clayton", "Ricardo",
  "Nathan", "Bryan", "Laurence", "Nelson", "Earnest", "Kelly", "Jesus",
  "Willard", "Virgil", "Marion", "Rudolph", "Luis", "Sammy", "Greg", "Dave",
  "Ira", "Max", "Elmer", "Bennie", "Bob", "Otis", "Everett", "Luther",
  "Gregg", "Rickie", "Randal", "Ben", "Raul", "Lance", "Tim", "Alex",
  "Carlton", "Francisco", "Roberto", "Marcus", "Loren", "Troy", "Jeff",
  "Edmund", "Myron", "Bradford", "Frankie", "Horace", "Rudy", "Delbert",
  "Clark", "Geoffrey", "Jan", "Denis", "Alton", "Sherman", "Malcolm",
  "Sylvester", "Leland", "Wade", "Salvatore", "Archie", "Hector",
  "Roosevelt", "Stewart", "Tommie", "Wilbert", "Darrel", "Ramon", "Hubert",
  "Monte", "Isaac", "Rodger", "Doyle", "Jacob", "Jerald", "Oliver",
  "Preston", "Kenny", "Grant", "Roderick", "Pedro", "Homer", "Felix",
  "Rocky", "Teddy", "Van", "Julian", "Armando", "Forrest", "Miguel",
  "Willis", "Pete", "Angelo", "Mickey", "Ivan", "Unknown", "Lowell",
  "Julius", "Carroll", "Rufus", "Cary", "Mack", "Owen", "Stephan", "Lorenzo",
  "Percy", "Terence", "Rene", "Grady", "Ervin", "Dallas", "Nick", "Andy",
  "Ellis", "Andre", "Dewey", "Fernando", "Arturo", "Wilbur", "Dwayne",
  "Boyd", "Conrad", "Hal", "Irvin", "Freddy", "Bert", "Kyle", "Alfredo",
  "Adrian", "Sheldon", "Elbert", "Rafael", "Travis", "Royce", "Wilson",
  "Woodrow", "Alfonso", "Sammie", "Derek", "Guadalupe", "Garland", "Noel",
  "Alonzo", "Spencer", "Merle", "Lionel", "Carey", "Cornelius", "Monty",
  "Cleveland", "Jeffry", "Louie", "Pat", "Dominick", "Tracy", "Salvador",
  "Christian", "Gale", "Ken", "Lanny", "Emmett", "Buddy", "Harlan", "Vance",
  "Angel", "Gerry", "Aubrey", "Amos", "Marlin", "Miles", "Darwin", "Galen",
  "Rodolfo", "Derrick", "Wilfred", "Alberto", "Eldon", "Adam", "Edmond",
  "Dominic", "Dewayne", "Norris", "Evan", "Moses", "Barney", "Dannie",
  "Jerrold", "Murray", "Marty", "Frederic", "Ron", "Ernie", "Lamar",
  "Darnell", "Enrique", "Grover", "Ernesto", "Harley", "Ned", "Ronny", "Al",
  "Clay", "Alphonso", "Blaine", "Dexter", "Gabriel", "Kirby", "Elijah",
  "Winston", "Curt", "Kelvin", "Junior", "Phil", "Sterling", "Orville",
  "Abraham", "Brett", "Jorge", "Irving", "Jess", "Reed", "Denny", "Linwood",
  "Loyd", "Vaughn", "Javier", "Julio", "Reuben", "Elton", "Joey", "Lon",
  "Donny", "Elliott", "Sanford", "Randell", "Thaddeus", "Billie", "Harrison",
  "Roscoe", "Simon", "Michel", "Thurman", "Levi", "Blair", "Burton",
  "Joesph", "Austin", "Dick", "Cornell", "Jason", "Drew", "Kermit", "Kris",
  "Emanuel", "Sean", "Blake", "Eddy", "Nolan", "Kennith", "Will", "Dudley",
  "Jaime", "Tomas", "Jasper", "Sandy", "Emil", "Carmen", "Elliot", "Fredric",
  "Ramiro", "Stevie", "Reid", "Rocco", "Odell", "Norbert", "Colin", "August",
  "Kendall", "Shawn", "Wiley", "Elwood", "Dane", "Toby", "Geary", "Danial",
  "Erik", "Lane", "Jody", "Millard", "Lamont", "Ulysses", "Felipe", "Ward",
  "Donn", "Rogelio", "Timmy", "Casey", "Val", "Gilberto", "Israel", "Russel",
  "Elvin", "Jeremiah", "Terrell", "Gus", "Robbie", "Alejandro", "Eduardo",
  "Jake", "Justin", "Orlando", "Joshua", "Pablo", "Zachary", "Garrett",
  "Gail", "Monroe", "Morgan", "Abel", "Elias", "Riley", "Winfred", "Rory",
  "Merrill", "Reynaldo", "Ivory", "Jackson", "Charley", "Mitchel", "Weldon",
  "Luke", "Mary", "Bobbie", "Merlin", "Carter", "Cedric", "Roman", "Maynard",
  "Erwin", "Jefferson", "Solomon", "Domingo", "Otto", "Andres", "Chuck",
  "Nicky", "Barton", "Donnell", "Ollie", "Adolph", "Stan", "Jean", "Bennett",
  "Harris", "Ismael", "Vern", "Bryant", "Emory", "Rogers", "Duncan",
  "Hollis", "Noah", "Davis", "Delmar", "Jacky", "Sergio", "Booker", "Emery",
  "Mathew", "Rolando", "Denver", "Irwin", "Jamie", "Armand", "Eli",
  "Guillermo", "Linda", "Bart", "Vito", "Bryce", "Dwain", "Ed", "Isaiah",
  "Jerold", "Anton", "Shelby", "Emilio", "Hiram", "Lindsey", "Santiago",
  "Damon", "Dickie", "Clair", "Quentin", "Arlen", "Seth", "Connie", "Coy",
  "Bernie", "Reggie", "Stanford", "Clement", "Douglass", "Benito", "Butch",
  "Shelton", "Errol", "Myles", "Ryan", "Sonny", "Hershel", "Carson",
  "Kenton", "Dalton", "Ian", "Rusty", "Scotty", "Chad", "Nickolas",
  "Ignacio", "Johnie", "Brady", "Major", "Burt", "Cameron", "Lavern",
  "Wilford", "Wilton", "Doug", "Mac", "Hilton", "Rand", "Gaylord", "Rayford",
  "Wilmer", "Buford", "Marco", "Carmine", "Hank", "Dee", "Dirk", "Garth",
  "Lenard", "Stanton", "Stevan", "Augustus", "Cleo", "Isiah", "Gearld",
  "Laverne", "Marcel", "Patricia", "Shannon", "Stacy", "Corey", "Lemuel",
  "Nicolas", "Carol", "Freeman", "Lonny", "Mikel", "Pierre", "Basil",
  "Glynn", "Pasquale", "Royal", "Saul", "Fletcher", "Gayle", "Taylor",
  "Anderson", "Bud", "Earle", "Leigh", "Silas", "Jeremy", "Mervin",
  "Napoleon", "Santos", "Wilburn", "Herschel", "Kip", "Marlon", "Everette",
  "Forest", "Jules", "Raleigh", "Felton", "Lacy", "Lindsay", "Otha",
  "Randel", "Scot", "Alva", "Judson", "Marcos", "Alden", "Houston",
  "Lawerence", "Lincoln", "Humberto", "Milo", "Ricki", "Graham", "Jere",
  "Kimberly", "Rolland", "Artis", "King", "Rod", "Deborah", "Del", "Emmitt",
  "Huey", "Tod", "Alphonse", "Ike", "Jonathon", "Len", "Mckinley", "Mose",
  "Sherwood", "Lauren", "Noe", "Augustine", "Cliff", "Cyril", "Dwaine",
  "Raphael", "Theron", "Avery", "Erick", "Mason", "Cruz", "Emerson", "Fidel",
  "Odis", "Woody", "Elroy", "Beverly", "Bruno", "Clint", "Eloy", "Joaquin",
  "Jordan", "Xavier", "Leonardo", "Lyman", "Tyler", "Wardell", "Brooks",
  "Carlo", "Olin", "Ritchie", "Burl", "Coleman", "Foster", "Gustavo", "Hans",
  "Hugo", "Lynwood", "Murphy", "Berry", "Delmer", "Gil", "Matt", "Milford",
  "Waymon", "Courtney", "Cyrus", "Lesley", "Von", "Efrain", "Lupe", "Warner",
  "Dewitt", "Lucius", "Cletus", "Mel", "Normand", "Quinton", "Vicente",
  "Barbara", "Curtiss", "Kurtis", "Meredith", "Brandon", "Donell", "Donovan",
  "Emile", "Kit", "Layne", "Verne", "Zane", "Adolfo", "Brice", "Cleve",
  "Columbus", "Domenic", "Farrell", "Gerardo", "Haywood", "Maxwell",
  "Truman", "Buster", "Hayward", "Lawrance", "Lorenza", "Trinidad", "Alec",
  "Audie", "Bertram", "Boyce", "Derrell", "Garfield", "Carleton", "Dennie",
  "Ferdinand", "Lorin", "Arnulfo", "Bryon", "Cody", "Darren", "Dell",
  "Emmanuel", "Gaylen", "Hoyt", "Agustin", "Arlie", "Fritz", "Jarvis",
  "Lucian", "Raymon", "Rubin", "Toney", "Wally", "Alford", "Arden", "Artie",
  "Brendan", "Olen", "Regis", "Winford", "Adan", "Cris", "Edwardo", "Kelley",
  "Nancy", "Robby", "Walker", "Alfonzo", "Benedict", "Darold", "Duwayne",
  "Elmo", "Gaylon", "Jed", "Melton", "Omar", "Shirley", "Brant", "Dorsey",
  "Garold", "Gregorio", "Issac", "Lyndon", "Reynold", "Rolf", "Theadore",
  "Vernell", "Vince", "Bonnie", "Cordell", "Hardy", "Jacques", "Lenny",
  "Parker", "Rollin", "Stefan", "Ashley", "Bernardo", "Carnell", "Cesar",
  "Garey", "Mikeal", "Rupert", "Stacey", "Thad", "Trent", "Valentine",
  "Carrol", "Enoch", "Erich", "Ezell", "Federico", "Gerold", "Lindell",
  "Sydney", "Adolphus", "Eliot", "Lucious", "Michal", "Randle", "Rob",
  "Windell", "Darius", "Elden", "Harmon", "Isidro", "Jame", "Jared",
  "Newton", "Noble", "Prince", "Rodrick", "Skip", "Theodis", "Alvis",
  "Damian", "Dayton", "Eldridge", "Ezra", "Howell", "Jewel", "Kimball",
  "Lenwood", "Oren", "Raymundo", "Verlin", "Elwin", "Hobert", "Jonas",
  "Jonnie", "Mahlon", "Milan", "Susan", "Ambrose", "Britt", "Darell",
  "Edsel", "Genaro", "Josh", "Loy", "Whitney", "Arlan", "Clarke", "Edison",
  "Elvis", "Ezzard", "Gonzalo", "Johnathan", "Madison", "Maxie", "Wyatt",
  "Aron", "Benton", "Carmelo", "Davie", "Donal", "Durwood", "Ethan",
  "Franklyn", "Granville", "Leopoldo", "Lucien", "Margarito", "Orrin",
  "Orval", "Terrill", "Brock", "Glendon", "Michale", "Quincy", "Wilfredo",
  "Lolita", "Thomas", "Linda", "Mary", "Patricia", "Deborah", "Barbara",
  "Susan", "Nancy", "Karen", "Sandra", "Kathleen", "Carol", "Donna",
  "Sharon", "Brenda", "Diane", "Pamela", "Margaret", "Debra", "Janet",
  "Cynthia", "Janice", "Carolyn", "Elizabeth", "Christine", "Judith", "Judy",
  "Shirley", "Joyce", "Betty", "Cheryl", "Gloria", "Rebecca", "Beverly",
  "Catherine", "Kathy", "Gail", "Bonnie", "Martha", "Joan", "Peggy",
  "Marilyn", "Dorothy", "Jane", "Connie", "Kathryn", "Ann", "Virginia",
  "Denise", "Jean", "Diana", "Paula", "Wanda", "Ruth", "Helen", "Katherine",
  "Jacqueline", "Phyllis", "Vicki", "Frances", "Laura", "Rita", "Alice",
  "Teresa", "Rose", "Theresa", "Elaine", "Jo", "Ellen", "Sherry", "Sheila",
  "Cathy", "Lynn", "Joanne", "Marcia", "Maria", "Marsha", "Sally", "Marie",
  "Darlene", "Doris", "Victoria", "Anne", "Suzanne", "Charlotte", "Lois",
  "Constance", "Vickie", "Evelyn", "Glenda", "Dianne", "Sarah", "Roberta",
  "Maureen", "Anna", "Eileen", "Anita", "Jeanne", "Sylvia " ]

type
  Minister = ref object
    id: UUID
    firstName: string
    lastName: string
    dateOfBirth: DateTime
    dateOfDeath: Option[DateTime]

  MinistersDB = object
    ministers: seq[Minister]

  DeceasedMinistersView = TableRef[int, seq[Minister]]

proc `%`(m: Minister): JsonNode =
  result = %*{
    "id": $(m.id),
    "firstName": m.firstName,
    "lastName": m.lastName,
    "dateOfBirth": m.dateOfBirth.format(dateFormat)
  }

  if m.dateOfDeath.isSome():
    result["dateOfDeath"] = %(m.dateOfDeath.get.format(dateFormat))

proc `%`(db: MinistersDB): JsonNode =
  result = %*{
    "ministers": db.ministers
  }

proc `%`(d: DeceasedMinistersView): JsonNode =
  result = newJObject()

  for year in d.keys: result[$year] = %d[year]

proc generateMinister(deceased = true): Minister =
  let dateOfDeath: Option[DateTime] =
    if deceased:
      some(initDateTime(
        rand(1..28),
        cast[Month](rand(1..12)),
        rand(deathMin..deathMax),
        0, 0, 0, utc()))
    else: none[DateTime]()

  let dateOfBirth: DateTime =
    initDateTime(
      rand(1..28),
      cast[Month](rand(12) + 1),
      if deceased: rand(dateOfDeath.get.year - maxLifespan ..
                        dateOfDeath.get.year - minLifespan)
      else: rand((now().year - maxLifespan) .. now().year),
      0, 0, 0, utc())

  result = Minister(
    id: genUUID(),
    firstName: firstNames[rand(0..<len(firstNames))],
    lastName: lastNames[rand(0..<len(lastNames))],
    dateOfBirth: dateOfBirth,
    dateOfDeath: dateOfDeath
  )

proc compareDeathDates(a, b: Minister): int =
  if a < b: result = -1
  elif a > b: result  = 1
  else: result = 0

when isMainModule:

  var db = MinistersDB(ministers: @[])
  var deceasedMinistersView: DeceasedMinistersView = newTable[int, seq[Minister]]()

  for i in (0..<numDeceased): db.ministers.add(generateMinister(true))
  for i in (0..<numLiving): db.ministers.add(generateMinister(false))

  writeFile("ministers.json", $(%db))

  for m in db.ministers:
    if not m.dateOfDeath.isSome(): continue
    let year = m.dateOfDeath.get.year
    if not deceasedMinistersView.hasKey(year):
      deceasedMinistersView[year] = @[m]
    else:
      deceasedMinistersView[year].add(m)

  for k in deceasedMinistersView.keys:
    deceasedMinistersView[k].sort(compareDeathDates)

  writeFile("deceased.ministers.view.json", $(%deceasedMinistersView))
