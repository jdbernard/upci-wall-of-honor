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
    dateOfBirth: Option[DateTime]
    dateOfDeath: Option[DateTime]

proc `%`(m: Minister): JsonNode =
  result = %*{
    "id": $(m.id),
    "slug": m.slug,
    "state": "published",
    "isDeceased": true,
    "name": {
      "given": m.firstName,
      "surname": m.lastName,
    }
  }

  if m.dateOfBirth.isSome:
    result["dateOfBirth"] = %(m.dateOfBirth.get.format(outDateFormat))

  if m.dateOfDeath.isSome:
    result["dateOfDeath"] = %(m.dateOfDeath.get.format(outDateFormat))

  if m.middleName.isSome:
    result["name"]["additional"] = %m.middleName.get

  if m.suffix.isSome:
    result["name"]["suffix"] = %m.suffix.get

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
  open(p, "deceased-ministers-2020-08-14.csv")

  while p.readRow():
    var m = Minister(
      id: genuuid(),
      slug: slugify(p.row[6], p.row[8], p.row[7]).replace(".", ""),
      lastName: p.row[6],
      firstName: p.row[7],
      middleName:
        if p.row[8].isEmptyOrWhitespace(): none[seq[string]]()
        else: some(@[p.row[8]]),
      dateOfBirth:
          if p.row[3].isEmptyOrWhitespace: none[DateTime]()
          else: some(p.row[3].parse(inDateFormat)),
      dateOfDeath:
          if p.row[4].isEmptyOrWhitespace: none[DateTime]()
          else: some(p.row[4].parse(inDateFormat)))

    let expectedName = patternName(m)
    if expectedName != p.row[9]:

      # We're missing something, let see if it's a suffix
      let suffixPat = re(expectedName & ",? (Jr|Sr|[IVX]+)")
      let match = p.row[9].find(suffixPat)
      if match.isSome:
        m.suffix = some(match.get.captures[0])

      # If we're still missing something, talk about it.
      if patternName(m) != p.row[9]:
        echo "\nUnexpected display name:"
        echo "\tid:      " & $m.id
        var nameComparison = "\tname:    " & p.row[9] & "  /  f:" & m.firstName
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
