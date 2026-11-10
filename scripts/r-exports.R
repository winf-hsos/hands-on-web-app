# Writes src/client/r-packages.js: for every function of the core tidyverse
# that is not already there when R starts (base R and dplyr), the packages
# that export it. r-engine.js reads it to load a package the first time a
# block calls one of its functions, so that every block behaves as after
# library(tidyverse) without every learner downloading all nine packages.
# Run it again after changing the packages in scripts/fetch-r-packages.mjs.
# Usage: Rscript scripts/r-exports.R   (needs the tidyverse installed)

# attached when R starts in the browser (r-engine.js), so never loaded on demand
present <- c("base", "stats", "utils", "methods", "graphics", "grDevices", "dplyr")
# the packages library(tidyverse) attaches, besides dplyr
core <- c("tibble", "ggplot2", "tidyr", "readr", "purrr", "stringr", "forcats", "lubridate")

taken <- unique(unlist(lapply(present, getNamespaceExports)))
syntactic <- function(names) names[grepl("^[A-Za-z.][A-Za-z0-9._]*$", names) & !startsWith(names, ".")]

owners <- list()
for (package in core) {
  for (name in setdiff(syntactic(getNamespaceExports(package)), taken)) {
    owners[[name]] <- c(owners[[name]], package)
  }
}
owners <- owners[order(names(owners))]

entry <- function(name) {
  packages <- paste0("'", owners[[name]], "'", collapse = ", ")
  key <- if (grepl("^[A-Za-z_$][A-Za-z0-9_$]*$", name)) name else paste0("'", name, "'")
  paste0("  ", key, ": [", packages, "],")
}

lines <- c(
  "// Written by scripts/r-exports.R, do not edit: for each function of the core",
  "// tidyverse that base R and dplyr do not have, the packages that export it.",
  "// r-engine.js loads them when a block calls the function.",
  "",
  paste0("export const CORE = [", paste0("'", core, "'", collapse = ", "), "];"),
  "",
  "export const EXPORTS = {",
  vapply(names(owners), entry, character(1)),
  "};",
  ""
)
# a binary connection keeps LF line endings on Windows, as .gitattributes wants
out <- file("src/client/r-packages.js", "wb")
writeLines(lines, out, useBytes = TRUE)
close(out)
cat(length(owners), "functions from", length(core), "packages\n")
