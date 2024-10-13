export const tools = {
  parseError(error) {
    if (error.startsWith("rpc error")) {
      const startIndex = error.indexOf("desc = ") + "desc = ".length;
      const result = error.substring(startIndex);
      return result;
    }
    return error;
  },
};
