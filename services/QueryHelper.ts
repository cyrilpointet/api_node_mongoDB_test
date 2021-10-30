import express from "express";

export class QueryHelper {
  static getQueryFilters(req: express.Request): Record<string, string> {
    const queryFilter = {};
    const reqFilter =
      req.query.filter && typeof req.query.filter === "string"
        ? JSON.parse(req.query.filter)
        : {};
    for (const [key, value] of Object.entries(reqFilter)) {
      queryFilter[key] = { $regex: value, $options: "i" };
    }
    return queryFilter;
  }

  static getQuerySort(req: express.Request): Record<string, number> {
    return req.query.sort
      ? { [req.query.sort as string]: req.query.order === "ASC" ? 1 : -1 }
      : {};
  }

  static getQueryLimit(req: express.Request): number {
    return req.query.perPage ? parseInt(req.query.perPage as string) : 0;
  }

  static getQuerySkip(req: express.Request): number {
    return req.query.page && req.query.perPage
      ? (parseInt(req.query.page as string) - 1) *
          parseInt(req.query.perPage as string)
      : 0;
  }
}
