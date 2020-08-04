import json, nre, options, parsecsv, strformat, strutils, tables, times, unicode, uuids

const outDateFormat = "yyyy-MM-dd"
const inDateFormat = "MM/dd/yyyy"

type
  Minister = ref object
    id: UUID
    slug: string
    state: string
    firstName: string
    lastName: string
    middleName: Option[seq[string]]
    suffix: Option[string]
    dateOfDeath: DateTime

proc `%`(m: Minister): JsonNode =
  result = %*{
    "id": $(m.id),
    "slug": m.slug,
    "state": "published",
    "name": {
      "given": m.firstName,
      "surname": m.lastName,
    },
    "dateOfBirth": "1800-01-01",
    "dateOfDeath": m.dateOfDeath.format(outDateFormat)
  }

  if m.middleName.isSome:
    result["name"]["additional"] = %m.middleName.get

proc slugify(first, middle, last: string): string =
  result = last.toLower()
  if not middle.isEmptyOrWhitespace():
    result = result & '-' & middle.toLower()
  if not first.isEmptyOrWhitespace():
    result = result & '-' & first.toLower()

proc patternName(m: Minister): string =
  result = m.lastName & ", " & m.firstName
  #if m.middleName.isSome:
  #  result &= " " & join(m.middleName.get, " ")
  if m.suffix.isSome:
    result &= ", " & m.suffix.get

when isMainModule:

  var ministers = newSeq[Minister]()
  var mismatchNameCount = 0

  var p: CsvParser
  open(p, "deceased-ministers-2020-07-24.csv")

  while p.readRow():
    var m = Minister(
      id: genuuid(),
      slug: slugify(p.row[6], p.row[7], p.row[5]),
      lastName: p.row[5],
      firstName: p.row[6],
      middleName:
        if p.row[7].isEmptyOrWhitespace(): none[seq[string]]()
        else: some(@[p.row[7]]),
      dateOfDeath: p.row[3].parse(inDateFormat))

    let expectedName = patternName(m)
    if expectedName != p.row[8]:

      # We're missing something, let see if it's a suffix
      let suffixPat = re(expectedName & ",? (Jr|Sr|[IVX]+)")
      let match = p.row[8].find(suffixPat)
      if match.isSome:
        m.suffix = some(match.get.captures[0])

      # If we're still missing something, talk about it.
      if patternName(m) != p.row[8]:
        echo "\nUnexpected display name:"
        echo "\tid:      " & $m.id
        var nameComparison = "\tname:    " & p.row[8] & "  /  f:" & m.firstName
        if m.middleName.isSome: nameComparison &= " m:" & join(m.middleName.get, " ")
        nameComparison &= " l:" & m.lastName
        if m.suffix.isSome: nameComparison &= " s:" & m.suffix.get
        echo nameComparison
        mismatchNameCount += 1

    ministers.add(m)

  "deceased-ministers.json".writeFile((%*{
    "ministers": ministers
  }).pretty)
  p.close()

  echo "\nTotal number of records: " & $ministers.len
  echo "\nTotal name mismatches:   " & $mismatchNameCount
