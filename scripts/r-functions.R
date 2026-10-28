# Writes src/build/r-functions.json: the functions the R editors suggest,
# grouped by package, each with its signature as R reports it. The lists are
# chosen by hand for beginners, not every export: what the lessons use and
# what comes next. Run it again after changing a list.
# Usage: Rscript scripts/r-functions.R   (needs dplyr and ggplot2 installed)

wanted <- list(
  base = c(
    "abs", "all", "any", "as.character", "as.integer", "as.numeric", "c", "cat", "class",
    "cumsum", "exp", "head", "ifelse", "is.na", "length", "library", "log", "max", "mean",
    "median", "min", "names", "nchar", "ncol", "nrow", "paste", "paste0", "print", "quantile",
    "range", "rep", "replicate", "rev", "round", "sample", "sd", "seq", "set.seed", "sort",
    "sqrt", "str", "sum", "summary", "table", "tail", "tolower", "toupper", "unique", "which"
  ),
  dplyr = c(
    "across", "anti_join", "arrange", "as_tibble", "between", "bind_rows", "case_when",
    "coalesce", "contains", "count", "desc", "distinct", "ends_with", "everything", "filter",
    "first", "full_join", "glimpse", "group_by", "if_else", "inner_join", "lag", "last", "lead",
    "left_join", "mutate", "n", "n_distinct", "na_if", "pull", "relocate", "rename",
    "right_join", "row_number", "select", "semi_join", "slice", "slice_head", "slice_max",
    "slice_min", "slice_sample", "slice_tail", "starts_with", "summarise", "summarize",
    "tibble", "ungroup", "where"
  ),
  ggplot2 = c(
    "aes", "coord_flip", "facet_grid", "facet_wrap", "geom_bar", "geom_boxplot", "geom_col",
    "geom_density", "geom_histogram", "geom_jitter", "geom_line", "geom_point", "geom_smooth",
    "geom_text", "geom_violin", "ggplot", "ggtitle", "labs", "scale_fill_brewer",
    "scale_fill_viridis_d", "scale_x_continuous", "scale_y_continuous", "theme",
    "theme_bw", "theme_minimal", "xlab", "ylab"
  )
)

suppressPackageStartupMessages({
  library(dplyr)
  library(ggplot2)
})

# "round(x, digits = 0)": the arguments as R knows them, long defaults shortened
signature <- function(name) {
  f <- get(name)
  if (is.primitive(f)) f <- args(f)
  arguments <- formals(f)
  parts <- vapply(names(arguments), function(arg) {
    # an argument without default is the empty symbol, which must not be
    # assigned to a variable, so it is checked in place
    if (identical(arguments[[arg]], quote(expr = ))) return(arg)
    shown <- paste(deparse(arguments[[arg]], width.cutoff = 500L), collapse = " ")
    if (nchar(shown) > 24) shown <- "…"
    paste(arg, "=", shown)
  }, character(1))
  paste0(name, "(", paste(parts, collapse = ", "), ")")
}

quote_json <- function(text) paste0('"', gsub('"', '\\\\"', gsub("\\\\", "\\\\\\\\", text)), '"')

groups <- vapply(names(wanted), function(group) {
  entries <- vapply(sort(wanted[[group]]), function(name) {
    paste0("[", quote_json(name), ", ", quote_json(signature(name)), "]")
  }, character(1))
  paste0("  ", quote_json(group), ": [\n    ", paste(entries, collapse = ",\n    "), "\n  ]")
}, character(1))

out <- file.path("src", "build", "r-functions.json")
writeLines(c("{", paste(groups, collapse = ",\n"), "}"), out, useBytes = TRUE)
cat(sum(lengths(wanted)), "functions ->", out, "\n")
